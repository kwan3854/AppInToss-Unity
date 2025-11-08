using System;
using System.Threading.Tasks;
using Ait;
using AitBridge.RPC;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace AIT.AIT_SDK.Test
{
    public class AdServiceTester : MonoBehaviour
    {
        [Header("Ad Config")]
        [SerializeField] private string adGroupId = "YOUR_AD_GROUP_ID"; // Replace with your actual Ad Group ID

        [Header("UI")]
        [SerializeField] private Button loadAdButton;
        [SerializeField] private Button showAdButton;
        [SerializeField] private Text logText;

        private AdServiceClient _adServiceClient;
        private string _loadOperationId;
        private bool _isAdLoaded = false;

        void Start()
        {
            // Get the RPC client instance
            _adServiceClient = AitRpcBridge.Instance.AdService;

            // Add button listeners
            loadAdButton.onClick.AddListener(TestLoadAd);
            showAdButton.onClick.AddListener(TestShowAd);
            
            // Initially, the show button should be disabled
            showAdButton.interactable = false;
            
            Log("AdServiceTester ready.");
            Log($"Using Ad Group ID: {adGroupId}");
        }

        private async void TestLoadAd()
        {
            Log("--- Starting Ad Load ---");
            loadAdButton.interactable = false;
            _isAdLoaded = false;

            try
            {
                var request = new LoadAdRequest { AdGroupId = adGroupId };
                var response = await _adServiceClient.LoadAd(request);

                if (string.IsNullOrEmpty(response.OperationId))
                {
                    Log("Failed to start LoadAd operation. Received empty operation ID.");
                    loadAdButton.interactable = true;
                    return;
                }

                _loadOperationId = response.OperationId;
                Log($"LoadAd operation started. Operation ID: {_loadOperationId}");
                Log("Polling for load events...");

                // Start polling
                await PollLoadEvents(_loadOperationId);
            }
            catch (Exception e)
            {
                Log($"LoadAd exception: {e.Message}");
                loadAdButton.interactable = true;
            }
        }

        private async UniTask PollLoadEvents(string operationId)
        {
            bool isFinished = false;
            while (!isFinished)
            {
                try
                {
                    var pollRequest = new PollLoadAdEventsRequest { OperationId = operationId };
                    var pollResponse = await _adServiceClient.PollLoadAdEvents(pollRequest);

                    foreach (var evt in pollResponse.Events)
                    {
                        Log($"PollLoad: Received event '{evt.EventCase}'");
                        if (evt.EventCase == LoadAdEvent.EventOneofCase.Loaded)
                        {
                            _isAdLoaded = true;
                            Log("Ad is loaded and ready to show!");
                        }
                    }

                    isFinished = pollResponse.IsFinished;

                    if (isFinished)
                    {
                        Log("Polling finished for LoadAd.");
                        break;
                    }
                }
                catch (Exception e)
                {
                    Log($"Polling exception: {e.Message}");
                    break; // Stop polling on error
                }
                
                // Wait for a bit before the next poll
                await Task.Delay(500); 
            }
            
            // Re-enable buttons after polling is done
            loadAdButton.interactable = true;
            showAdButton.interactable = _isAdLoaded;
        }

        private async void TestShowAd()
        {
            if (!_isAdLoaded)
            {
                Log("Cannot show ad. Ad not loaded yet.");
                return;
            }
            
            Log("--- Starting Ad Show ---");
            showAdButton.interactable = false;

            try
            {
                var request = new ShowAdRequest { AdGroupId = adGroupId };
                var response = await _adServiceClient.ShowAd(request);

                if (string.IsNullOrEmpty(response.OperationId))
                {
                    Log("Failed to start ShowAd operation. Received empty operation ID.");
                    showAdButton.interactable = true;
                    return;
                }

                Log($"ShowAd operation started. Operation ID: {response.OperationId}");
                Log("Polling for show events...");

                // Start polling for show events
                await PollShowEvents(response.OperationId);
            }
            catch (Exception e)
            {
                Log($"ShowAd exception: {e.Message}");
                showAdButton.interactable = true;
            }
        }

        private async UniTask PollShowEvents(string operationId)
        {
            bool isFinished = false;
            while (!isFinished)
            {
                try
                {
                    var pollRequest = new PollShowAdEventsRequest { OperationId = operationId };
                    var pollResponse = await _adServiceClient.PollShowAdEvents(pollRequest);

                    foreach (var evt in pollResponse.Events)
                    {
                        Log($"PollShow: Received event '{evt.EventCase}'");
                        if (evt.EventCase == ShowAdEvent.EventOneofCase.UserEarnedReward)
                        {
                            Log($"User earned reward! Type: {evt.UserEarnedReward.UnitType}, Amount: {evt.UserEarnedReward.UnitAmount}");
                        }
                    }

                    isFinished = pollResponse.IsFinished;

                    if (isFinished)
                    {
                        Log("Polling finished for ShowAd.");
                        break;
                    }
                }
                catch (Exception e)
                {
                    Log($"Polling exception: {e.Message}");
                    break;
                }
                
                await Task.Delay(500);
            }
            
            // Reset state after ad is shown and flow is finished
            _isAdLoaded = false;
            showAdButton.interactable = false;
        }

        private void Log(string message)
        {
            Debug.Log($"[AdServiceTester] {message}");
            if (logText != null)
            {
                logText.text += $"> {message}\n";
                // Optional: Auto-scroll to bottom
                var scrollRect = logText.GetComponentInParent<ScrollRect>();
                if (scrollRect != null)
                {
                    scrollRect.normalizedPosition = new Vector2(0, 0);
                }
            }
        }
    }
}
