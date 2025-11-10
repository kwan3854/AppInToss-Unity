using Ait.Iap;
using Cysharp.Threading.Tasks;

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
            return client.GetCompletedOrRefundedOrders(new GetCompletedOrRefundedOrdersRequest { NextKey = "" });
        }
    }
}
