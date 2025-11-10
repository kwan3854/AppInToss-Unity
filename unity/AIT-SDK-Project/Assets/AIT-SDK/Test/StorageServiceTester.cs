using System;
using Ait.Storage;
using AitBridge.RPC;
using UnityEngine;
using UnityEngine.UI;

namespace AIT.AIT_SDK.Test
{
    public class StorageServiceTester : MonoBehaviour
    {
        [Header("UI Elements")]
        public InputField keyInput;
        public InputField valueInput;
        public Button setItemButton;
        public Button getItemButton;
        public Button removeItemButton;
        public Button clearItemsButton;
        public Text logText;

        private StorageServiceClient _storageServiceClient;

        void Start()
        {
            _storageServiceClient = AitRpcBridge.Instance.StorageService;

            if (_storageServiceClient == null)
            {
                Log("StorageServiceClient is not available. Make sure the bridge is initialized.");
                return;
            }

            setItemButton.onClick.AddListener(TestSetItem);
            getItemButton.onClick.AddListener(TestGetItem);
            removeItemButton.onClick.AddListener(TestRemoveItem);
            clearItemsButton.onClick.AddListener(TestClearItems);
            
            Log("StorageServiceTester ready.");
        }

        private async void TestSetItem()
        {
            var key = keyInput.text;
            var value = valueInput.text;
            if (string.IsNullOrEmpty(key))
            {
                Log("Key cannot be empty for SetItem.");
                return;
            }
            
            Log($"Calling SetItem with key='{key}', value='{value}'...");
            try
            {
                var request = new SetItemRequest { Key = key, Value = value };
                await _storageServiceClient.SetItem(request);
                Log("SetItem success.");
            }
            catch (Exception e)
            {
                Log($"SetItem exception: {e.Message}");
            }
        }

        private async void TestGetItem()
        {
            var key = keyInput.text;
            if (string.IsNullOrEmpty(key))
            {
                Log("Key cannot be empty for GetItem.");
                return;
            }

            Log($"Calling GetItem with key='{key}'...");
            try
            {
                var request = new GetItemRequest { Key = key };
                var response = await _storageServiceClient.GetItem(request);
                Log($"GetItem success: value='{response.Value}'");
            }
            catch (Exception e)
            {
                Log($"GetItem exception: {e.Message}");
            }
        }

        private async void TestRemoveItem()
        {
            var key = keyInput.text;
            if (string.IsNullOrEmpty(key))
            {
                Log("Key cannot be empty for RemoveItem.");
                return;
            }

            Log($"Calling RemoveItem with key='{key}'...");
            try
            {
                var request = new RemoveItemRequest { Key = key };
                await _storageServiceClient.RemoveItem(request);
                Log("RemoveItem success.");
            }
            catch (Exception e)
            {
                Log($"RemoveItem exception: {e.Message}");
            }
        }

        private async void TestClearItems()
        {
            Log("Calling ClearItems...");
            try
            {
                await _storageServiceClient.ClearItems(new ClearItemsRequest());
                Log("ClearItems success.");
            }
            catch (Exception e)
            {
                Log($"ClearItems exception: {e.Message}");
            }
        }

        private void Log(string message)
        {
            Debug.Log($"[StorageServiceTester] {message}");
            if (logText != null)
            {
                logText.text += $"> {message}\n";
            }
        }
    }
}
