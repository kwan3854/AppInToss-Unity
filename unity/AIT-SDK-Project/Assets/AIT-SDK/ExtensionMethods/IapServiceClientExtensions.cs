using System;
using System.Threading;
using Ait.Iap;
using Cysharp.Threading.Tasks;
using Cysharp.Threading.Tasks.Linq;

namespace AIT.AIT_SDK.ExtensionMethods
{
    public static class IapServiceClientExtensions
    {
        public static UniTask<GetProductItemListResponse> GetProductItemList(this IapServiceClient client)
        {
            return client.GetProductItemList(new GetProductItemListRequest { Dummy = true });
        }

        public static UniTask<GetPendingOrdersResponse> GetPendingOrders(this IapServiceClient client)
        {
            return client.GetPendingOrders(new GetPendingOrdersRequest { Dummy = true });
        }
        
        public static UniTask<GetCompletedOrRefundedOrdersResponse> GetCompletedOrRefundedOrders(this IapServiceClient client)
        {
            return client.GetCompletedOrRefundedOrders(new GetCompletedOrRefundedOrdersRequest
            {
                NextKey = "empty"
            });
        }
        
        /// <summary>
        /// Creates a one-time purchase order and polls for purchase events, returning them as an async stream.
        /// Throws an exception if the CreateOrder operation fails to start.
        /// </summary>
        public static IUniTaskAsyncEnumerable<PurchaseEvent> CreateOrderAsStream(this IapServiceClient client, CreateOneTimePurchaseOrderRequest request, CancellationToken cancellationToken = default)
        {
            return UniTaskAsyncEnumerable.Create<PurchaseEvent>(async (writer, token) =>
            {
                var createOrderResponse = await client.CreateOneTimePurchaseOrder(request);
                var operationId = createOrderResponse.OperationId;

                if (string.IsNullOrEmpty(operationId))
                {
                    throw new Exception("Failed to start CreateOrder operation. SKU may be invalid or IAP service is unavailable.");
                }

                var isFinished = false;
                while (!isFinished && !token.IsCancellationRequested)
                {
                    var pollResponse = await client.PollPurchaseEvents(new PollPurchaseEventsRequest { OperationId = operationId });
                    isFinished = pollResponse.IsFinished;

                    foreach (var ev in pollResponse.Events)
                    {
                        await writer.YieldAsync(ev);
                    }

                    if (!isFinished)
                    {
                        await UniTask.Delay(TimeSpan.FromSeconds(1), cancellationToken: token);
                    }
                }
            });
        }
    }
}
