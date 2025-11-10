export interface GetProductItemListRequest {
  dummy?: boolean;
}

export function encodeGetProductItemListRequest(message: GetProductItemListRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetProductItemListRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetProductItemListRequest(message: GetProductItemListRequest, bb: ByteBuffer): void {
  // optional bool dummy = 1;
  let $dummy = message.dummy;
  if ($dummy !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $dummy ? 1 : 0);
  }
}

export function decodeGetProductItemListRequest(binary: Uint8Array): GetProductItemListRequest {
  return _decodeGetProductItemListRequest(wrapByteBuffer(binary));
}

function _decodeGetProductItemListRequest(bb: ByteBuffer): GetProductItemListRequest {
  let message: GetProductItemListRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool dummy = 1;
      case 1: {
        message.dummy = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetProductItemListResponse {
  products?: IapProductListItem[];
}

export function encodeGetProductItemListResponse(message: GetProductItemListResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetProductItemListResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeGetProductItemListResponse(message: GetProductItemListResponse, bb: ByteBuffer): void {
  // repeated IapProductListItem products = 1;
  let array$products = message.products;
  if (array$products !== undefined) {
    for (let value of array$products) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodeIapProductListItem(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeGetProductItemListResponse(binary: Uint8Array): GetProductItemListResponse {
  return _decodeGetProductItemListResponse(wrapByteBuffer(binary));
}

function _decodeGetProductItemListResponse(bb: ByteBuffer): GetProductItemListResponse {
  let message: GetProductItemListResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated IapProductListItem products = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.products || (message.products = []);
        values.push(_decodeIapProductListItem(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface IapProductListItem {
  sku?: string;
  display_name?: string;
  display_amount?: string;
  icon_url?: string;
  description?: string;
}

export function encodeIapProductListItem(message: IapProductListItem): Uint8Array {
  let bb = popByteBuffer();
  _encodeIapProductListItem(message, bb);
  return toUint8Array(bb);
}

function _encodeIapProductListItem(message: IapProductListItem, bb: ByteBuffer): void {
  // optional string sku = 1;
  let $sku = message.sku;
  if ($sku !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $sku);
  }

  // optional string display_name = 2;
  let $display_name = message.display_name;
  if ($display_name !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $display_name);
  }

  // optional string display_amount = 3;
  let $display_amount = message.display_amount;
  if ($display_amount !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $display_amount);
  }

  // optional string icon_url = 4;
  let $icon_url = message.icon_url;
  if ($icon_url !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $icon_url);
  }

  // optional string description = 5;
  let $description = message.description;
  if ($description !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $description);
  }
}

export function decodeIapProductListItem(binary: Uint8Array): IapProductListItem {
  return _decodeIapProductListItem(wrapByteBuffer(binary));
}

function _decodeIapProductListItem(bb: ByteBuffer): IapProductListItem {
  let message: IapProductListItem = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string sku = 1;
      case 1: {
        message.sku = readString(bb, readVarint32(bb));
        break;
      }

      // optional string display_name = 2;
      case 2: {
        message.display_name = readString(bb, readVarint32(bb));
        break;
      }

      // optional string display_amount = 3;
      case 3: {
        message.display_amount = readString(bb, readVarint32(bb));
        break;
      }

      // optional string icon_url = 4;
      case 4: {
        message.icon_url = readString(bb, readVarint32(bb));
        break;
      }

      // optional string description = 5;
      case 5: {
        message.description = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CreateOneTimePurchaseOrderRequest {
  sku?: string;
}

export function encodeCreateOneTimePurchaseOrderRequest(message: CreateOneTimePurchaseOrderRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeCreateOneTimePurchaseOrderRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeCreateOneTimePurchaseOrderRequest(message: CreateOneTimePurchaseOrderRequest, bb: ByteBuffer): void {
  // optional string sku = 1;
  let $sku = message.sku;
  if ($sku !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $sku);
  }
}

export function decodeCreateOneTimePurchaseOrderRequest(binary: Uint8Array): CreateOneTimePurchaseOrderRequest {
  return _decodeCreateOneTimePurchaseOrderRequest(wrapByteBuffer(binary));
}

function _decodeCreateOneTimePurchaseOrderRequest(bb: ByteBuffer): CreateOneTimePurchaseOrderRequest {
  let message: CreateOneTimePurchaseOrderRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string sku = 1;
      case 1: {
        message.sku = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CreateOneTimePurchaseOrderResponse {
  operation_id?: string;
}

export function encodeCreateOneTimePurchaseOrderResponse(message: CreateOneTimePurchaseOrderResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeCreateOneTimePurchaseOrderResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeCreateOneTimePurchaseOrderResponse(message: CreateOneTimePurchaseOrderResponse, bb: ByteBuffer): void {
  // optional string operation_id = 1;
  let $operation_id = message.operation_id;
  if ($operation_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $operation_id);
  }
}

export function decodeCreateOneTimePurchaseOrderResponse(binary: Uint8Array): CreateOneTimePurchaseOrderResponse {
  return _decodeCreateOneTimePurchaseOrderResponse(wrapByteBuffer(binary));
}

function _decodeCreateOneTimePurchaseOrderResponse(bb: ByteBuffer): CreateOneTimePurchaseOrderResponse {
  let message: CreateOneTimePurchaseOrderResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string operation_id = 1;
      case 1: {
        message.operation_id = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface PollPurchaseEventsRequest {
  operation_id?: string;
}

export function encodePollPurchaseEventsRequest(message: PollPurchaseEventsRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodePollPurchaseEventsRequest(message, bb);
  return toUint8Array(bb);
}

function _encodePollPurchaseEventsRequest(message: PollPurchaseEventsRequest, bb: ByteBuffer): void {
  // optional string operation_id = 1;
  let $operation_id = message.operation_id;
  if ($operation_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $operation_id);
  }
}

export function decodePollPurchaseEventsRequest(binary: Uint8Array): PollPurchaseEventsRequest {
  return _decodePollPurchaseEventsRequest(wrapByteBuffer(binary));
}

function _decodePollPurchaseEventsRequest(bb: ByteBuffer): PollPurchaseEventsRequest {
  let message: PollPurchaseEventsRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string operation_id = 1;
      case 1: {
        message.operation_id = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface PollPurchaseEventsResponse {
  events?: PurchaseEvent[];
  is_finished?: boolean;
}

export function encodePollPurchaseEventsResponse(message: PollPurchaseEventsResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodePollPurchaseEventsResponse(message, bb);
  return toUint8Array(bb);
}

function _encodePollPurchaseEventsResponse(message: PollPurchaseEventsResponse, bb: ByteBuffer): void {
  // repeated PurchaseEvent events = 1;
  let array$events = message.events;
  if (array$events !== undefined) {
    for (let value of array$events) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodePurchaseEvent(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional bool is_finished = 2;
  let $is_finished = message.is_finished;
  if ($is_finished !== undefined) {
    writeVarint32(bb, 16);
    writeByte(bb, $is_finished ? 1 : 0);
  }
}

export function decodePollPurchaseEventsResponse(binary: Uint8Array): PollPurchaseEventsResponse {
  return _decodePollPurchaseEventsResponse(wrapByteBuffer(binary));
}

function _decodePollPurchaseEventsResponse(bb: ByteBuffer): PollPurchaseEventsResponse {
  let message: PollPurchaseEventsResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated PurchaseEvent events = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.events || (message.events = []);
        values.push(_decodePurchaseEvent(bb));
        bb.limit = limit;
        break;
      }

      // optional bool is_finished = 2;
      case 2: {
        message.is_finished = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface PurchaseEvent {
  success?: PurchaseSuccessEvent;
  error?: PurchaseErrorEvent;
}

export function encodePurchaseEvent(message: PurchaseEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodePurchaseEvent(message, bb);
  return toUint8Array(bb);
}

function _encodePurchaseEvent(message: PurchaseEvent, bb: ByteBuffer): void {
  // optional PurchaseSuccessEvent success = 1;
  let $success = message.success;
  if ($success !== undefined) {
    writeVarint32(bb, 10);
    let nested = popByteBuffer();
    _encodePurchaseSuccessEvent($success, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional PurchaseErrorEvent error = 2;
  let $error = message.error;
  if ($error !== undefined) {
    writeVarint32(bb, 18);
    let nested = popByteBuffer();
    _encodePurchaseErrorEvent($error, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
}

export function decodePurchaseEvent(binary: Uint8Array): PurchaseEvent {
  return _decodePurchaseEvent(wrapByteBuffer(binary));
}

function _decodePurchaseEvent(bb: ByteBuffer): PurchaseEvent {
  let message: PurchaseEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional PurchaseSuccessEvent success = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.success = _decodePurchaseSuccessEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PurchaseErrorEvent error = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        message.error = _decodePurchaseErrorEvent(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface PurchaseSuccessEvent {
  order_id?: string;
  display_name?: string;
  display_amount?: string;
  amount?: Long;
  currency?: string;
  fraction?: number;
  mini_app_icon_url?: string;
}

export function encodePurchaseSuccessEvent(message: PurchaseSuccessEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodePurchaseSuccessEvent(message, bb);
  return toUint8Array(bb);
}

function _encodePurchaseSuccessEvent(message: PurchaseSuccessEvent, bb: ByteBuffer): void {
  // optional string order_id = 1;
  let $order_id = message.order_id;
  if ($order_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $order_id);
  }

  // optional string display_name = 2;
  let $display_name = message.display_name;
  if ($display_name !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $display_name);
  }

  // optional string display_amount = 3;
  let $display_amount = message.display_amount;
  if ($display_amount !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $display_amount);
  }

  // optional int64 amount = 4;
  let $amount = message.amount;
  if ($amount !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $amount);
  }

  // optional string currency = 5;
  let $currency = message.currency;
  if ($currency !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $currency);
  }

  // optional int32 fraction = 6;
  let $fraction = message.fraction;
  if ($fraction !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($fraction));
  }

  // optional string mini_app_icon_url = 7;
  let $mini_app_icon_url = message.mini_app_icon_url;
  if ($mini_app_icon_url !== undefined) {
    writeVarint32(bb, 58);
    writeString(bb, $mini_app_icon_url);
  }
}

export function decodePurchaseSuccessEvent(binary: Uint8Array): PurchaseSuccessEvent {
  return _decodePurchaseSuccessEvent(wrapByteBuffer(binary));
}

function _decodePurchaseSuccessEvent(bb: ByteBuffer): PurchaseSuccessEvent {
  let message: PurchaseSuccessEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string order_id = 1;
      case 1: {
        message.order_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional string display_name = 2;
      case 2: {
        message.display_name = readString(bb, readVarint32(bb));
        break;
      }

      // optional string display_amount = 3;
      case 3: {
        message.display_amount = readString(bb, readVarint32(bb));
        break;
      }

      // optional int64 amount = 4;
      case 4: {
        message.amount = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional string currency = 5;
      case 5: {
        message.currency = readString(bb, readVarint32(bb));
        break;
      }

      // optional int32 fraction = 6;
      case 6: {
        message.fraction = readVarint32(bb);
        break;
      }

      // optional string mini_app_icon_url = 7;
      case 7: {
        message.mini_app_icon_url = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface PurchaseErrorEvent {
  error_code?: string;
  error_message?: string;
}

export function encodePurchaseErrorEvent(message: PurchaseErrorEvent): Uint8Array {
  let bb = popByteBuffer();
  _encodePurchaseErrorEvent(message, bb);
  return toUint8Array(bb);
}

function _encodePurchaseErrorEvent(message: PurchaseErrorEvent, bb: ByteBuffer): void {
  // optional string error_code = 1;
  let $error_code = message.error_code;
  if ($error_code !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $error_code);
  }

  // optional string error_message = 2;
  let $error_message = message.error_message;
  if ($error_message !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $error_message);
  }
}

export function decodePurchaseErrorEvent(binary: Uint8Array): PurchaseErrorEvent {
  return _decodePurchaseErrorEvent(wrapByteBuffer(binary));
}

function _decodePurchaseErrorEvent(bb: ByteBuffer): PurchaseErrorEvent {
  let message: PurchaseErrorEvent = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string error_code = 1;
      case 1: {
        message.error_code = readString(bb, readVarint32(bb));
        break;
      }

      // optional string error_message = 2;
      case 2: {
        message.error_message = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetPendingOrdersRequest {
  dummy?: boolean;
}

export function encodeGetPendingOrdersRequest(message: GetPendingOrdersRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetPendingOrdersRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetPendingOrdersRequest(message: GetPendingOrdersRequest, bb: ByteBuffer): void {
  // optional bool dummy = 1;
  let $dummy = message.dummy;
  if ($dummy !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $dummy ? 1 : 0);
  }
}

export function decodeGetPendingOrdersRequest(binary: Uint8Array): GetPendingOrdersRequest {
  return _decodeGetPendingOrdersRequest(wrapByteBuffer(binary));
}

function _decodeGetPendingOrdersRequest(bb: ByteBuffer): GetPendingOrdersRequest {
  let message: GetPendingOrdersRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool dummy = 1;
      case 1: {
        message.dummy = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetPendingOrdersResponse {
  orders?: PendingOrder[];
}

export function encodeGetPendingOrdersResponse(message: GetPendingOrdersResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetPendingOrdersResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeGetPendingOrdersResponse(message: GetPendingOrdersResponse, bb: ByteBuffer): void {
  // repeated PendingOrder orders = 1;
  let array$orders = message.orders;
  if (array$orders !== undefined) {
    for (let value of array$orders) {
      writeVarint32(bb, 10);
      let nested = popByteBuffer();
      _encodePendingOrder(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeGetPendingOrdersResponse(binary: Uint8Array): GetPendingOrdersResponse {
  return _decodeGetPendingOrdersResponse(wrapByteBuffer(binary));
}

function _decodeGetPendingOrdersResponse(bb: ByteBuffer): GetPendingOrdersResponse {
  let message: GetPendingOrdersResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated PendingOrder orders = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        let values = message.orders || (message.orders = []);
        values.push(_decodePendingOrder(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface PendingOrder {
  order_id?: string;
  sku?: string;
}

export function encodePendingOrder(message: PendingOrder): Uint8Array {
  let bb = popByteBuffer();
  _encodePendingOrder(message, bb);
  return toUint8Array(bb);
}

function _encodePendingOrder(message: PendingOrder, bb: ByteBuffer): void {
  // optional string order_id = 1;
  let $order_id = message.order_id;
  if ($order_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $order_id);
  }

  // optional string sku = 2;
  let $sku = message.sku;
  if ($sku !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $sku);
  }
}

export function decodePendingOrder(binary: Uint8Array): PendingOrder {
  return _decodePendingOrder(wrapByteBuffer(binary));
}

function _decodePendingOrder(bb: ByteBuffer): PendingOrder {
  let message: PendingOrder = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string order_id = 1;
      case 1: {
        message.order_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional string sku = 2;
      case 2: {
        message.sku = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetCompletedOrRefundedOrdersRequest {
  next_key?: string;
}

export function encodeGetCompletedOrRefundedOrdersRequest(message: GetCompletedOrRefundedOrdersRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetCompletedOrRefundedOrdersRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeGetCompletedOrRefundedOrdersRequest(message: GetCompletedOrRefundedOrdersRequest, bb: ByteBuffer): void {
  // optional string next_key = 1;
  let $next_key = message.next_key;
  if ($next_key !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $next_key);
  }
}

export function decodeGetCompletedOrRefundedOrdersRequest(binary: Uint8Array): GetCompletedOrRefundedOrdersRequest {
  return _decodeGetCompletedOrRefundedOrdersRequest(wrapByteBuffer(binary));
}

function _decodeGetCompletedOrRefundedOrdersRequest(bb: ByteBuffer): GetCompletedOrRefundedOrdersRequest {
  let message: GetCompletedOrRefundedOrdersRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string next_key = 1;
      case 1: {
        message.next_key = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface GetCompletedOrRefundedOrdersResponse {
  has_next?: boolean;
  next_key?: string;
  orders?: CompletedOrRefundedOrder[];
}

export function encodeGetCompletedOrRefundedOrdersResponse(message: GetCompletedOrRefundedOrdersResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeGetCompletedOrRefundedOrdersResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeGetCompletedOrRefundedOrdersResponse(message: GetCompletedOrRefundedOrdersResponse, bb: ByteBuffer): void {
  // optional bool has_next = 1;
  let $has_next = message.has_next;
  if ($has_next !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $has_next ? 1 : 0);
  }

  // optional string next_key = 2;
  let $next_key = message.next_key;
  if ($next_key !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $next_key);
  }

  // repeated CompletedOrRefundedOrder orders = 3;
  let array$orders = message.orders;
  if (array$orders !== undefined) {
    for (let value of array$orders) {
      writeVarint32(bb, 26);
      let nested = popByteBuffer();
      _encodeCompletedOrRefundedOrder(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
}

export function decodeGetCompletedOrRefundedOrdersResponse(binary: Uint8Array): GetCompletedOrRefundedOrdersResponse {
  return _decodeGetCompletedOrRefundedOrdersResponse(wrapByteBuffer(binary));
}

function _decodeGetCompletedOrRefundedOrdersResponse(bb: ByteBuffer): GetCompletedOrRefundedOrdersResponse {
  let message: GetCompletedOrRefundedOrdersResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool has_next = 1;
      case 1: {
        message.has_next = !!readByte(bb);
        break;
      }

      // optional string next_key = 2;
      case 2: {
        message.next_key = readString(bb, readVarint32(bb));
        break;
      }

      // repeated CompletedOrRefundedOrder orders = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        let values = message.orders || (message.orders = []);
        values.push(_decodeCompletedOrRefundedOrder(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CompletedOrRefundedOrder {
  order_id?: string;
  sku?: string;
  status?: string;
  date?: string;
}

export function encodeCompletedOrRefundedOrder(message: CompletedOrRefundedOrder): Uint8Array {
  let bb = popByteBuffer();
  _encodeCompletedOrRefundedOrder(message, bb);
  return toUint8Array(bb);
}

function _encodeCompletedOrRefundedOrder(message: CompletedOrRefundedOrder, bb: ByteBuffer): void {
  // optional string order_id = 1;
  let $order_id = message.order_id;
  if ($order_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $order_id);
  }

  // optional string sku = 2;
  let $sku = message.sku;
  if ($sku !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $sku);
  }

  // optional string status = 3;
  let $status = message.status;
  if ($status !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $status);
  }

  // optional string date = 4;
  let $date = message.date;
  if ($date !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $date);
  }
}

export function decodeCompletedOrRefundedOrder(binary: Uint8Array): CompletedOrRefundedOrder {
  return _decodeCompletedOrRefundedOrder(wrapByteBuffer(binary));
}

function _decodeCompletedOrRefundedOrder(bb: ByteBuffer): CompletedOrRefundedOrder {
  let message: CompletedOrRefundedOrder = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string order_id = 1;
      case 1: {
        message.order_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional string sku = 2;
      case 2: {
        message.sku = readString(bb, readVarint32(bb));
        break;
      }

      // optional string status = 3;
      case 3: {
        message.status = readString(bb, readVarint32(bb));
        break;
      }

      // optional string date = 4;
      case 4: {
        message.date = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CompleteProductGrantRequest {
  order_id?: string;
}

export function encodeCompleteProductGrantRequest(message: CompleteProductGrantRequest): Uint8Array {
  let bb = popByteBuffer();
  _encodeCompleteProductGrantRequest(message, bb);
  return toUint8Array(bb);
}

function _encodeCompleteProductGrantRequest(message: CompleteProductGrantRequest, bb: ByteBuffer): void {
  // optional string order_id = 1;
  let $order_id = message.order_id;
  if ($order_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $order_id);
  }
}

export function decodeCompleteProductGrantRequest(binary: Uint8Array): CompleteProductGrantRequest {
  return _decodeCompleteProductGrantRequest(wrapByteBuffer(binary));
}

function _decodeCompleteProductGrantRequest(bb: ByteBuffer): CompleteProductGrantRequest {
  let message: CompleteProductGrantRequest = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string order_id = 1;
      case 1: {
        message.order_id = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface CompleteProductGrantResponse {
  success?: boolean;
}

export function encodeCompleteProductGrantResponse(message: CompleteProductGrantResponse): Uint8Array {
  let bb = popByteBuffer();
  _encodeCompleteProductGrantResponse(message, bb);
  return toUint8Array(bb);
}

function _encodeCompleteProductGrantResponse(message: CompleteProductGrantResponse, bb: ByteBuffer): void {
  // optional bool success = 1;
  let $success = message.success;
  if ($success !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $success ? 1 : 0);
  }
}

export function decodeCompleteProductGrantResponse(binary: Uint8Array): CompleteProductGrantResponse {
  return _decodeCompleteProductGrantResponse(wrapByteBuffer(binary));
}

function _decodeCompleteProductGrantResponse(bb: ByteBuffer): CompleteProductGrantResponse {
  let message: CompleteProductGrantResponse = {} as any;

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool success = 1;
      case 1: {
        message.success = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export interface Long {
  low: number;
  high: number;
  unsigned: boolean;
}

interface ByteBuffer {
  bytes: Uint8Array;
  offset: number;
  limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value: string): Long {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value: Long): string {
  let low = value.low;
  let high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

let f32 = new Float32Array(1);
let f32_u8 = new Uint8Array(f32.buffer);

let f64 = new Float64Array(1);
let f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value: number): Long {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

let bbStack: ByteBuffer[] = [];

function popByteBuffer(): ByteBuffer {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb: ByteBuffer): void {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb: ByteBuffer): Uint8Array {
  let bytes = bb.bytes;
  let limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb: ByteBuffer, offset: number): void {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
  return bb.offset >= bb.limit;
}

function grow(bb: ByteBuffer, count: number): number {
  let bytes = bb.bytes;
  let offset = bb.offset;
  let limit = bb.limit;
  let finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    let newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb: ByteBuffer, count: number): number {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb: ByteBuffer, count: number): Uint8Array {
  let offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb: ByteBuffer, buffer: Uint8Array): void {
  let offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb: ByteBuffer, count: number): string {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2: number, c3: number, c4: number, c: number;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb: ByteBuffer, text: string): void {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  let n = text.length;
  let byteCount = 0;

  // Write the byte count first
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  let offset = grow(bb, byteCount);
  let bytes = bb.bytes;

  // Then write the bytes
  for (let i = 0; i < n; i++) {
    let c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb: ByteBuffer, buffer: ByteBuffer): void {
  let offset = grow(bb, buffer.limit);
  let from = bb.bytes;
  let to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (let i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb: ByteBuffer): number {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb: ByteBuffer): number {
  let offset = advance(bb, 8);
  let bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 8);
  let bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb: ByteBuffer): number {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb: ByteBuffer, value: number): void {
  let offset = grow(bb, 4);
  let bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb: ByteBuffer, unsigned: boolean): Long {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb: ByteBuffer, value: Long): void {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb: ByteBuffer): number {
  let c = 0;
  let value = 0;
  let b: number;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb: ByteBuffer, value: number): void {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb: ByteBuffer, unsigned: boolean): Long {
  let part0 = 0;
  let part1 = 0;
  let part2 = 0;
  let b: number;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb: ByteBuffer, value: Long): void {
  let part0 = value.low >>> 0;
  let part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  let part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  let size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  let offset = grow(bb, size);
  let bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb: ByteBuffer): number {
  let value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb: ByteBuffer, value: number): void {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb: ByteBuffer): Long {
  let value = readVarint64(bb, /* unsigned */ false);
  let low = value.low;
  let high = value.high;
  let flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb: ByteBuffer, value: Long): void {
  let low = value.low;
  let high = value.high;
  let flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
