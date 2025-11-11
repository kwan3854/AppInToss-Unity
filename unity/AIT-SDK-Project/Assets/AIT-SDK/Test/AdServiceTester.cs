using System;
using System.Collections;
using Ait;
using AitBridge.RPC;
using AIT.AIT_SDK.ExtensionMethods; // Added
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

            Log($"Calling LoadAd and polling events for AdGroupId: {adGroupId}...");
            try
            {
                var request = new LoadAdRequest { AdGroupId = adGroupId };
                await foreach (var ev in _adServiceClient.LoadAdAsStream(request))
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
                Log("Finished polling LoadAd events.");
            }
            catch (Exception e)
            {
                Log($"LoadAdAsStream exception: {e.Message}");
            }
        }

        private async void TestShowAd()
        {
            var adGroupId = adGroupIdInput.text;
            if (string.IsNullOrEmpty(adGroupId))
            {
                Log("Ad Group ID is required to show an ad.");
                return;
            }

            Log($"Calling ShowAd and polling events for AdGroupId: {adGroupId}...");
            try
            {
                var request = new ShowAdRequest { AdGroupId = adGroupId };
                await foreach (var ev in _adServiceClient.ShowAdAsStream(request))
                {
                    Log($"  - Polled ShowAd Event: {ev.EventCase}");
                    if (ev.EventCase == ShowAdEvent.EventOneofCase.UserEarnedReward)
                    {
                        Log($"    User Earned Reward! Type: {ev.UserEarnedReward.UnitType}, Amount: {ev.UserEarnedReward.UnitAmount}");
                    }
                    else if (ev.EventCase == ShowAdEvent.EventOneofCase.FailedToShow)
                    {
                        Log($"    Ad failed to show.");
                    }
                    else
                    {
                        Log($"    Event data: {ev}");
                    }
                }
                Log("Finished polling ShowAd events.");
            }
            catch (Exception e)
            {
                Log($"ShowAdAsStream exception: {e.Message}");
            }
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