import { IAP } from "@apps-in-toss/web-framework";
import { IapServiceBase } from "../../generated/IapService/ait_iap_IapServiceBase";
import type {
  GetProductItemListResponse,
  CreateOneTimePurchaseOrderRequest,
  CreateOneTimePurchaseOrderResponse,
  PollPurchaseEventsRequest,
  PollPurchaseEventsResponse,
  GetPendingOrdersResponse,
  GetCompletedOrRefundedOrdersResponse,
  CompleteProductGrantRequest,
  CompleteProductGrantResponse,
  PurchaseEvent,
  Long,
} from "../../generated/IapService/IapService";

// --- State Management for Polling ---

interface PurchaseOperationState {
  events: PurchaseEvent[];
  isFinished: boolean;
}

const purchaseOperationStore = new Map<string, PurchaseOperationState>();

// A helper type for the Toss IAP error structure
interface TossIapError {
  code?: string;
  message?: string;
}

export class IapServiceImpl extends IapServiceBase {
  // 1. GetProductItemList
  async GetProductItemList(): Promise<GetProductItemListResponse> {
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
    if (!request.sku) {
      throw new Error("CreateOneTimePurchaseOrder requires a SKU.");
    }

    const operationId = crypto.randomUUID();
    purchaseOperationStore.set(operationId, { events: [], isFinished: false });

    IAP.createOneTimePurchaseOrder({
      options: {
        sku: request.sku,
        processProductGrant: ({ orderId }) => {
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
              amount: { low: event.data.amount, high: 0, unsigned: false } as Long,
              currency: event.data.currency,
              fraction: event.data.fraction,
              mini_app_icon_url: event.data.miniAppIconUrl ?? "",
            },
          });
        }
        state.isFinished = true;
      },
      onError: (error: unknown) => {
        const state = purchaseOperationStore.get(operationId);
        if (!state) return;

        const tossError = error as TossIapError; // Type assertion
        state.events.push({
          error: {
            error_code: tossError?.code ?? 'UNKNOWN_ERROR',
            error_message: tossError?.message ?? 'An unknown error occurred.',
          },
        });
        state.isFinished = true;
      },
    });

    return { operation_id: operationId };
  }

  // 3. PollPurchaseEvents
  async PollPurchaseEvents(request: PollPurchaseEventsRequest): Promise<PollPurchaseEventsResponse> {
    if (!request.operation_id) {
      throw new Error("PollPurchaseEvents requires an operation_id.");
    }
    const state = purchaseOperationStore.get(request.operation_id);

    if (!state) {
      return { events: [], is_finished: true };
    }

    const eventsToReturn = [...state.events];
    state.events = [];

    if (state.isFinished) {
      purchaseOperationStore.delete(request.operation_id);
    }

    return { events: eventsToReturn, is_finished: state.isFinished };
  }

  // 4. GetPendingOrders
  async GetPendingOrders(): Promise<GetPendingOrdersResponse> {
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
  async GetCompletedOrRefundedOrders(): Promise<GetCompletedOrRefundedOrdersResponse> {
    const result = await IAP.getCompletedOrRefundedOrders();
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
    if (!request.order_id) {
      throw new Error("CompleteProductGrant requires an order_id.");
    }
    const result = await IAP.completeProductGrant({ params: { orderId: request.order_id } });
    return { success: result ?? false };
  }
}
