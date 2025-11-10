using System;
using System.Collections;
using Ait;
using AitBridge.RPC;
using Cysharp.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;

namespace AIT.AIT_SDK.Test
{
    public class AdServiceTester : MonoBehaviour
    {
        [Header("UI Elements")]
        public InputField adGroupIdInput;
        public Button loadAdButton;
        public Button showAdButton;
        public Text logText;

        private AdServiceClient _adServiceClient;

        void Start()
        {
            _adServiceClient = AitRpcBridge.Instance.AdService;

            if (_adServiceClient == null)
            {
                Log("AdServiceClient is not available.");
                return;
            }

            loadAdButton.onClick.AddListener(TestLoadAd);
            showAdButton.onClick.AddListener(TestShowAd);

            Log("AdServiceTester ready.");
        }

        private async void TestLoadAd()
        {
            var adGroupId = adGroupIdInput.text;
            if (string.IsNullOrEmpty(adGroupId))
            {
                Log("Ad Group ID is required to load an ad.");
                return;
            }

            Log($"Calling LoadAd with AdGroupId: {adGroupId}...");
            try
            {
                var request = new LoadAdRequest { AdGroupId = adGroupId };
                var response = await _adServiceClient.LoadAd(request);
                if (string.IsNullOrEmpty(response.OperationId))
                {
                    Log("LoadAd failed to start (is it supported?).");
                    return;
                }
                Log($"LoadAd started, operation_id: {response.OperationId}");
                PollLoadAdEvents(response.OperationId).Forget();
            }
            catch (Exception e)
            {
                Log($"LoadAd exception: {e.Message}");
            }
        }

        private async UniTaskVoid PollLoadAdEvents(string operationId)
        {
            Log($"Starting to poll LoadAd events for op: {operationId}");
            var isFinished = false;
            while (!isFinished)
            {
                try
                {
                    var pollRequest = new PollLoadAdEventsRequest { OperationId = operationId };
                    var pollResponse = await _adServiceClient.PollLoadAdEvents(pollRequest);
                    isFinished = pollResponse.IsFinished;

                    foreach (var ev in pollResponse.Events)
                    {
                        Log($"  - Polled LoadAd Event: {ev.EventCase}");
                        if (ev.EventCase == LoadAdEvent.EventOneofCase.Loaded)
                        {
                            Log($"    Ad Loaded! Response ID: {ev.Loaded.Data.ResponseId}");
                        }
                        else
                        {
                            Log($"    Event data: {ev}");
                        }
                    }
                }
                catch (Exception e)
                {
                    Log($"PollLoadAdEvents exception: {e.Message}");
                    isFinished = true; // Stop polling on error
                }
                if (!isFinished)
                {
                    await UniTask.Delay(TimeSpan.FromSeconds(1)); // Poll every second
                }
            }
            Log($"Finished polling LoadAd events for op: {operationId}");
        }

        private async void TestShowAd()
        {
            var adGroupId = adGroupIdInput.text;
            if (string.IsNullOrEmpty(adGroupId))
            {
                Log("Ad Group ID is required to show an ad.");
                return;
            }

            Log($"Calling ShowAd with AdGroupId: {adGroupId}...");
            try
            {
                var request = new ShowAdRequest { AdGroupId = adGroupId };
                var response = await _adServiceClient.ShowAd(request);
                if (string.IsNullOrEmpty(response.OperationId))
                {
                    Log("ShowAd failed to start (is it supported?).");
                    return;
                }
                Log($"ShowAd started, operation_id: {response.OperationId}");
                PollShowAdEvents(response.OperationId).Forget();
            }
            catch (Exception e)
            {
                Log($"ShowAd exception: {e.Message}");
            }
        }

        private async UniTaskVoid PollShowAdEvents(string operationId)
        {
            Log($"Starting to poll ShowAd events for op: {operationId}");
            var isFinished = false;
            while (!isFinished)
            {
                try
                {
                    var pollRequest = new PollShowAdEventsRequest { OperationId = operationId };
                    var pollResponse = await _adServiceClient.PollShowAdEvents(pollRequest);
                    isFinished = pollResponse.IsFinished;

                    foreach (var ev in pollResponse.Events)
                    {
                        Log($"  - Polled ShowAd Event: {ev.EventCase}");
                        if (ev.EventCase == ShowAdEvent.EventOneofCase.UserEarnedReward)
                        {
                            Log($"    User Earned Reward! Type: {ev.UserEarnedReward.UnitType}, Amount: {ev.UserEarnedReward.UnitAmount}");
                        }
                        else
                        {
                             Log($"    Event data: {ev}");
                        }
                    }
                }
                catch (Exception e)
                {
                    Log($"PollShowAdEvents exception: {e.Message}");
                    isFinished = true; // Stop polling on error
                }
                if (!isFinished)
                {
                    await UniTask.Delay(TimeSpan.FromSeconds(1)); // Poll every second
                }
            }
            Log($"Finished polling ShowAd events for op: {operationId}");
        }

        private void Log(string message)
        {
            Debug.Log($"[AdServiceTester] {message}");
            if (logText != null)
            {
                logText.text += $"> {message}\n";
            }
        }
    }
}