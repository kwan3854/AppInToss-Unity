using System;
using System.Text;
using Ait.Iap;
using AitBridge.RPC;
using AIT.AIT_SDK.ExtensionMethods;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace AIT.AIT_SDK.Test
{
    public class IapServiceTester : MonoBehaviour
    {
        public Button getProductListButton;
        public Button createOrderButton;
        public Button getPendingOrdersButton;
        public Button getCompletedOrdersButton;
        public Button completeGrantButton;
        public Text logText;

        private IapServiceClient _iapServiceClient;
        private string _currentOperationId;
        private string _lastPendingOrderId;

        void Start()
        {
            _iapServiceClient = AitRpcBridge.Instance.IapService;

            getProductListButton.onClick.AddListener(TestGetProductList);
            createOrderButton.onClick.AddListener(TestCreateOrder);
            getPendingOrdersButton.onClick.AddListener(TestGetPendingOrders);
            getCompletedOrdersButton.onClick.AddListener(TestGetCompletedOrders);
            completeGrantButton.onClick.AddListener(TestCompleteGrant);
            
            Log("IapServiceTester ready.");
        }

        private async void TestGetProductList()
        {
            Log("Calling GetProductItemList...");
            try
            {
                var response = await _iapServiceClient.GetProductItemList();
                var sb = new StringBuilder();
                sb.AppendLine($"GetProductItemList success. Found {response.Products.Count} products:");
                foreach (var product in response.Products)
                {
                    sb.AppendLine($"  - {product.DisplayName} ({product.DisplayAmount}) [SKU: {product.Sku}]");
                }
                Log(sb.ToString());
            }
            catch (Exception e)
            {
                Log($"GetProductItemList exception: {e.Message}");
            }
        }

        private async void TestCreateOrder()
        {
            Log("Calling CreateOneTimePurchaseOrder...");
            try
            {
                // In a real app, you would get the SKU from the product list
                var request = new CreateOneTimePurchaseOrderRequest { Sku = "sku1" }; 
                var response = await _iapServiceClient.CreateOneTimePurchaseOrder(request); 
                
                if (string.IsNullOrEmpty(response.OperationId))
                {
                    Log("CreateOneTimePurchaseOrder failed to start.");
                    return;
                }
                
                _currentOperationId = response.OperationId;
                Log($"CreateOneTimePurchaseOrder started. Operation ID: {_currentOperationId}");
                
                // Start polling for the result
                PollForPurchaseResult();
            }
            catch (Exception e)
            {
                Log($"CreateOneTimePurchaseOrder exception: {e.Message}");
            }
        }

        private async void PollForPurchaseResult()
        {
            if (string.IsNullOrEmpty(_currentOperationId))
            {
                Log("No purchase operation in progress.");
                return;
            }

            Log($"Polling for purchase result with op ID: {_currentOperationId}...");
            var isFinished = false;
            while (!isFinished)
            {
                try
                {
                    var response = await _iapServiceClient.PollPurchaseEvents(new PollPurchaseEventsRequest { OperationId = _currentOperationId });
                    isFinished = response.IsFinished;

                    foreach (var ev in response.Events)
                    {
                        switch (ev.EventCase)
                        {
                            case PurchaseEvent.EventOneofCase.Success:
                                Log($"Purchase Success! Order ID: {ev.Success.OrderId}, Amount: {ev.Success.DisplayAmount}");
                                break;
                            case PurchaseEvent.EventOneofCase.Error:
                                Log($"Purchase Error! Code: {ev.Error.ErrorCode}, Msg: {ev.Error.ErrorMessage}");
                                break;
                        }
                    }

                    if (!isFinished)
                    {
                        await UniTask.Delay(1000); // Wait 1 second before next poll
                    }
                    else
                    {
                        Log("Purchase flow finished.");
                    }
                }
                catch (Exception e)
                {
                    Log($"PollPurchaseEvents exception: {e.Message}");
                    isFinished = true; // Stop polling on error
                }
            }
            _currentOperationId = null;
        }

        private async void TestGetPendingOrders()
        {
            Log("Calling GetPendingOrders...");
            try
            {
                var response = await _iapServiceClient.GetPendingOrders();
                var sb = new StringBuilder();
                sb.AppendLine($"GetPendingOrders success. Found {response.Orders.Count} pending orders:");
                foreach (var order in response.Orders)
                {
                    sb.AppendLine($"  - Order ID: {order.OrderId}, SKU: {order.Sku}");
                    _lastPendingOrderId = order.OrderId; // Save the last one for testing completeGrant
                }
                Log(sb.ToString());
                if (!string.IsNullOrEmpty(_lastPendingOrderId))
                {
                    Log($"Saved last pending order ID for grant test: {_lastPendingOrderId}");
                }
            }
            catch (Exception e)
            {
                Log($"GetPendingOrders exception: {e.Message}");
            }
        }

        private async void TestGetCompletedOrders()
        {
            Log("Calling GetCompletedOrRefundedOrders...");
            try
            {
                var response = await _iapServiceClient.GetCompletedOrRefundedOrders();
                var sb = new StringBuilder();
                sb.AppendLine($"GetCompletedOrRefundedOrders success. HasNext: {response.HasNext}");
                foreach (var order in response.Orders)
                {
                    sb.AppendLine($"  - [{order.Status}] Order ID: {order.OrderId}, Date: {order.Date}");
                }
                Log(sb.ToString());
            }
            catch (Exception e)
            {
                Log($"GetCompletedOrRefundedOrders exception: {e.Message}");
            }
        }

        private async void TestCompleteGrant()
        {
            if (string.IsNullOrEmpty(_lastPendingOrderId))
            {
                Log("No pending order ID saved. Please run 'Get Pending Orders' first.");
                return;
            }
            
            Log($"Calling CompleteProductGrant for order ID: {_lastPendingOrderId}...");
            try
            {
                var request = new CompleteProductGrantRequest { OrderId = _lastPendingOrderId };
                var response = await _iapServiceClient.CompleteProductGrant(request);
                Log($"CompleteProductGrant success: {response.Success}");
                if (response.Success)
                {
                    _lastPendingOrderId = null;
                }
            }
            catch (Exception e)
            {
                Log($"CompleteProductGrant exception: {e.Message}");
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
