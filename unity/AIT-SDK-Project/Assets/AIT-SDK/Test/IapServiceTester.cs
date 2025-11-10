using System;
using System.Collections;
using Ait.Iap;
using AitBridge.RPC;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace AIT.AIT_SDK.Test
{
    public class IapServiceTester : MonoBehaviour
    {
        [Header("UI Elements")]
        public Button getProductListButton;
        public InputField skuInput;
        public Button createOrderButton;
        public Button getPendingOrdersButton;
        public InputField orderIdInput;
        public Button completeGrantButton;
        public Button getCompletedOrdersButton;
        public Text logText;

        private IapServiceClient _iapServiceClient;

        void Start()
        {
            _iapServiceClient = AitRpcBridge.Instance.IapService;

            if (_iapServiceClient == null)
            {
                Log("IapServiceClient is not available.");
                return;
            }

            getProductListButton.onClick.AddListener(TestGetProductItemList);
            createOrderButton.onClick.AddListener(TestCreateOrder);
            getPendingOrdersButton.onClick.AddListener(TestGetPendingOrders);
            completeGrantButton.onClick.AddListener(TestCompleteGrant);
            getCompletedOrdersButton.onClick.AddListener(TestGetCompletedOrders);

            Log("IapServiceTester ready.");
        }

        private async void TestGetProductItemList()
        {
            Log("Calling GetProductItemList...");
            try
            {
                var response = await _iapServiceClient.GetProductItemList(new GetProductItemListRequest());
                Log($"GetProductItemList success: Found {response.Products.Count} products.");
                foreach (var product in response.Products)
                {
                    Log($"  - SKU: {product.Sku}, Name: {product.DisplayName}, Price: {product.DisplayAmount}");
                }
            }
            catch (Exception e)
            {
                Log($"GetProductItemList exception: {e.Message}");
            }
        }

        private async void TestCreateOrder()
        {
            var sku = skuInput.text;
            if (string.IsNullOrEmpty(sku))
            {
                Log("SKU is required to create an order.");
                return;
            }

            Log($"Calling CreateOneTimePurchaseOrder with SKU: {sku}...");
            try
            {
                var request = new CreateOneTimePurchaseOrderRequest { Sku = sku };
                var response = await _iapServiceClient.CreateOneTimePurchaseOrder(request);
                Log($"CreateOneTimePurchaseOrder success, operation_id: {response.OperationId}");
                PollPurchaseEvents(response.OperationId).Forget();
            }
            catch (Exception e)
            {
                Log($"CreateOneTimePurchaseOrder exception: {e.Message}");
            }
        }

        private async UniTaskVoid PollPurchaseEvents(string operationId)
        {
            Log($"Starting to poll purchase events for op: {operationId}");
            var isFinished = false;
            while (!isFinished)
            {
                try
                {
                    var pollRequest = new PollPurchaseEventsRequest { OperationId = operationId };
                    var pollResponse = await _iapServiceClient.PollPurchaseEvents(pollRequest);
                    isFinished = pollResponse.IsFinished;

                    foreach (var ev in pollResponse.Events)
                    {
                        Log($"  - Polled Event: {ev.EventCase}");
                        if (ev.EventCase == PurchaseEvent.EventOneofCase.Success)
                        {
                            Log($"    Success! Order ID: {ev.Success.OrderId}");
                        }
                        else if (ev.EventCase == PurchaseEvent.EventOneofCase.Error)
                        {
                            Log($"    Error! Code: {ev.Error.ErrorCode}, Msg: {ev.Error.ErrorMessage}");
                        }
                    }
                }
                catch (Exception e)
                {
                    Log($"PollPurchaseEvents exception: {e.Message}");
                    isFinished = true; // Stop polling on error
                }
                if (!isFinished)
                {
                    await UniTask.Delay(TimeSpan.FromSeconds(1)); // Poll every second
                }
            }
            Log($"Finished polling purchase events for op: {operationId}");
        }

        private async void TestGetPendingOrders()
        {
            Log("Calling GetPendingOrders...");
            try
            {
                var response = await _iapServiceClient.GetPendingOrders(new GetPendingOrdersRequest());
                Log($"GetPendingOrders success: Found {response.Orders.Count} pending orders.");
                foreach (var order in response.Orders)
                {
                    Log($"  - Order ID: {order.OrderId}, SKU: {order.Sku}");
                }
            }
            catch (Exception e)
            {
                Log($"GetPendingOrders exception: {e.Message}");
            }
        }

        private async void TestCompleteGrant()
        {
            var orderId = orderIdInput.text;
            if (string.IsNullOrEmpty(orderId))
            {
                Log("Order ID is required to complete a grant.");
                return;
            }

            Log($"Calling CompleteProductGrant for order: {orderId}...");
            try
            {
                var request = new CompleteProductGrantRequest { OrderId = orderId };
                var response = await _iapServiceClient.CompleteProductGrant(request);
                Log($"CompleteProductGrant success: {response.Success}");
            }
            catch (Exception e)
            {
                Log($"CompleteProductGrant exception: {e.Message}");
            }
        }
        
        private async void TestGetCompletedOrders()
        {
            Log("Calling GetCompletedOrRefundedOrders...");
            try
            {
                var response = await _iapServiceClient.GetCompletedOrRefundedOrders(new GetCompletedOrRefundedOrdersRequest());
                Log($"GetCompletedOrRefundedOrders success: Found {response.Orders.Count} orders. HasNext: {response.HasNext}");
                foreach (var order in response.Orders)
                {
                    Log($"  - Order ID: {order.OrderId}, SKU: {order.Sku}, Status: {order.Status}");
                }
            }
            catch (Exception e)
            {
                Log($"GetCompletedOrRefundedOrders exception: {e.Message}");
            }
        }

        private void Log(string message)
        {
            Debug.Log($"[IapServiceTester] {message}");
            if (logText != null)
            {
                logText.text += $"> {message}\n";
            }
        }
    }
}