import { IAP } from "@apps-in-toss/web-framework";
import { IapServiceBase } from "../../generated/IapService/ait_iap_IapServiceBase";
import type {
  GetProductItemListRequest,
  GetProductItemListResponse,
  CreateOneTimePurchaseOrderRequest,
  CreateOneTimePurchaseOrderResponse,
  PollPurchaseEventsRequest,
  PollPurchaseEventsResponse,
  GetPendingOrdersRequest,
  GetPendingOrdersResponse,
  GetCompletedOrRefundedOrdersRequest,
  GetCompletedOrRefundedOrdersResponse,
  CompleteProductGrantRequest,
  CompleteProductGrantResponse,
  PurchaseEvent,
} from "../../generated/IapService/IapService";

// --- State Management for Polling ---

interface PurchaseOperationState {
  events: PurchaseEvent[];
  isFinished: boolean;
}

const purchaseOperationStore = new Map<string, PurchaseOperationState>();

export class IapServiceImpl extends IapServiceBase {
  // 1. GetProductItemList
  async GetProductItemList(request: GetProductItemListRequest): Promise<GetProductItemListResponse> {
    const result = await IAP.getProductItemList();
    if (!result) {
      return { products: [] };
    }
    return {
      products: result.products.map(p => ({
        sku: p.sku,
        display_name: p.displayName,
        display_amount: p.displayAmount,
        icon_url: p.iconUrl,
        description: p.description,
      })),
    };
  }

  // 2. CreateOneTimePurchaseOrder (Initiates polling)
  async CreateOneTimePurchaseOrder(request: CreateOneTimePurchaseOrderRequest): Promise<CreateOneTimePurchaseOrderResponse> {
    const operationId = crypto.randomUUID();
    purchaseOperationStore.set(operationId, { events: [], isFinished: false });

    IAP.createOneTimePurchaseOrder({
      options: {
        sku: request.sku,
        processProductGrant: ({ orderId }) => {
          // This logic runs on the web-side. For this RPC bridge,
          // we assume the client will handle the grant via GetPendingOrders and CompleteProductGrant.
          console.log(`[IapService] processProductGrant called for orderId: ${orderId}. Client should handle this.`);
          return true;
        },
      },
      onEvent: (event) => {
        const state = purchaseOperationStore.get(operationId);
        if (!state) return;

        if (event.type === 'success') {
          state.events.push({
            success: {
              order_id: event.data.orderId,
              display_name: event.data.displayName,
              display_amount: event.data.displayAmount,
              amount: event.data.amount,
              currency: event.data.currency,
              fraction: event.data.fraction,
              mini_app_icon_url: event.data.miniAppIconUrl ?? "",
            },
          });
        }
        state.isFinished = true; // One-time purchase flow ends after one event (success or error)
      },
      onError: (error: any) => {
        const state = purchaseOperationStore.get(operationId);
        if (!state) return;

        state.events.push({
          error: {
            error_code: error?.code ?? 'UNKNOWN_ERROR',
            error_message: error?.message ?? 'An unknown error occurred.',
          },
        });
        state.isFinished = true;
      },
    });

    return { operation_id: operationId };
  }

  // 3. PollPurchaseEvents
  async PollPurchaseEvents(request: PollPurchaseEventsRequest): Promise<PollPurchaseEventsResponse> {
    const state = purchaseOperationStore.get(request.operation_id);

    if (!state) {
      return { events: [], is_finished: true };
    }

    const eventsToReturn = [...state.events];
    state.events = []; // Clear queue

    if (state.isFinished) {
      purchaseOperationStore.delete(request.operation_id);
    }

    return { events: eventsToReturn, is_finished: state.isFinished };
  }

  // 4. GetPendingOrders
  async GetPendingOrders(request: GetPendingOrdersRequest): Promise<GetPendingOrdersResponse> {
    const result = await IAP.getPendingOrders();
    if (!result) {
      return { orders: [] };
    }
    return {
      orders: result.orders.map(o => ({
        order_id: o.orderId,
        sku: o.sku,
      })),
    };
  }

  // 5. GetCompletedOrRefundedOrders
  async GetCompletedOrRefundedOrders(request: GetCompletedOrRefundedOrdersRequest): Promise<GetCompletedOrRefundedOrdersResponse> {
    const result = await IAP.getCompletedOrRefundedOrders({ key: request.next_key });
    if (!result) {
      return { has_next: false, next_key: "", orders: [] };
    }
    return {
      has_next: result.hasNext,
      next_key: result.nextKey ?? "",
      orders: result.orders.map(o => ({
        order_id: o.orderId,
        sku: o.sku,
        status: o.status,
        date: o.date,
      })),
    };
  }

  // 6. CompleteProductGrant
  async CompleteProductGrant(request: CompleteProductGrantRequest): Promise<CompleteProductGrantResponse> {
    const result = await IAP.completeProductGrant({ params: { orderId: request.order_id } });
    return { success: result ?? false };
  }
}
