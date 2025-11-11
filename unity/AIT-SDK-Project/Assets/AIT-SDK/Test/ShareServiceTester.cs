using UnityEngine;
using UnityEngine.UI;
using Cysharp.Threading.Tasks;
using Ait.Share;
using AitBridge.RPC;
using System;

namespace AIT.Test
{
    /// <summary>
    /// Tests the ShareService by calling the ShowContactsViral RPC.
    /// </summary>
    public class ShareServiceTester : MonoBehaviour
    {
        [Tooltip("The Module ID for the contacts viral feature from the Toss console.")]
        public string moduleId = "YOUR_MODULE_ID_HERE";

        [Tooltip("Button to trigger the ShowContactsViral RPC.")]
        public Button showContactsViralButton;

        [Tooltip("Text field to log the response from the RPC call.")]
        public Text logText;

        void Start()
        {
            if (showContactsViralButton == null)
            {
                Debug.LogError("[ShareServiceTester] ShowContactsViralButton is not assigned.", this);
                return;
            }
            if (logText == null)
            {
                Debug.LogError("[ShareServiceTester] LogText is not assigned.", this);
                return;
            }
            showContactsViralButton.onClick.AddListener(OnShowContactsViralClicked);
        }

        private void OnShowContactsViralClicked()
        {
            if (string.IsNullOrEmpty(moduleId) || moduleId == "YOUR_MODULE_ID_HERE")
            {
                logText.text = "Please enter a valid Module ID in the inspector.";
                Debug.LogError("[ShareServiceTester] Module ID is not set.");
                return;
            }
            ShowContactsViralFlow().Forget();
        }

        private async UniTaskVoid ShowContactsViralFlow()
        {
            logText.text = $"Calling ShowContactsViral with Module ID: {moduleId}";
            var request = new ShowContactsViralRequest { ModuleId = moduleId };

            try
            {
                // This is now a unary RPC call, not a stream.
                var response = await AitRpcBridge.Instance.ShareServiceClient.ShowContactsViral(request);

                logText.text += "\nResponse received:";

                switch (response.EventCase)
                {
                    case ShowContactsViralResponse.EventOneofCase.Reward:
                        var reward = response.Reward;
                        var log = $"[Reward] Amount: {reward.RewardAmount}, Unit: {reward.RewardUnit}";
                        Debug.Log(log);
                        logText.text += $"\n{log}";
                        break;

                    case ShowContactsViralResponse.EventOneofCase.Close:
                        var close = response.Close;
                        var closeLog = $"[Close] Reason: {close.CloseReason}, Sent Count: {close.SentRewardsCount}";
                        Debug.Log(closeLog);
                        logText.text += $"\n{closeLog}";
                        break;

                    case ShowContactsViralResponse.EventOneofCase.Error:
                        var error = response.Error;
                        var errorLog = $"[Error] Message: {error.Message}";
                        Debug.LogError(errorLog);
                        logText.text += $"\n{errorLog}";
                        break;
                    
                    case ShowContactsViralResponse.EventOneofCase.None:
                        var noneLog = "[None] No event was set in the response.";
                        Debug.Log(noneLog);
                        logText.text += $"\n{noneLog}";
                        break;
                }
            }
            catch (Exception e)
            {
                Debug.LogError($"[ShareServiceTester] RPC failed: {e.Message}");
                logText.text += $"\nRPC failed: {e.Message}";
            }
        }
    }
}
