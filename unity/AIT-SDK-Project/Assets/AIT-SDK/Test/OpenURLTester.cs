using System;
using UnityEngine;
using UnityEngine.UI;
using AitBridge.RPC;
using AitBridge.Generated;
using Cysharp.Threading.Tasks;

namespace AitBridge.Test
{
    /// <summary>
    /// Test script for OpenURL RPC service
    /// 
    /// Attach this to a Canvas to test the OpenURL service via WebView RPC
    /// </summary>
    public class OpenURLTester : MonoBehaviour
    {
        [Header("Test URLs")]
        [SerializeField] private string testUrl1 = "https://google.com";
        [SerializeField] private string testUrl2 = "https://github.com";
        [SerializeField] private string testUrl3 = "https://unity.com";

        [Header("UI")]
        [SerializeField] private Button openGoogleButton;
        [SerializeField] private Button openGithubButton;
        [SerializeField] private Button openUnityButton;
        [SerializeField] private Text statusText;

        private void Start()
        {
            SetupUI();
            UpdateStatus("Ready. Click a button to test OpenURL via WebView RPC.");
        }

        private void SetupUI()
        {
            if (openGoogleButton != null)
            {
                openGoogleButton.onClick.AddListener(() => TestOpenURL(testUrl1));
            }

            if (openGithubButton != null)
            {
                openGithubButton.onClick.AddListener(() => TestOpenURL(testUrl2));
            }

            if (openUnityButton != null)
            {
                openUnityButton.onClick.AddListener(() => TestOpenURL(testUrl3));
            }
        }

        private async void TestOpenURL(string url)
        {
            if (AitRpcBridge.Instance == null)
            {
                UpdateStatus("Error: AitRpcBridge not found in scene!");
                Debug.LogError("[OpenURLTester] AitRpcBridge.Instance is null");
                return;
            }

            UpdateStatus($"Opening: {url}...");

            try
            {
                // Create request
                var request = new OpenURLRequest { Url = url };

                // Call RPC service
                var response = await AitRpcBridge.Instance.OpenURLService.OpenURL(request);

                // Check response
                if (response.Success)
                {
                    UpdateStatus($"✓ Successfully opened: {url}");
                    Debug.Log($"[OpenURLTester] Success: {url}");
                }
                else
                {
                    UpdateStatus($"✗ Failed to open: {url}\nError: {response.ErrorMessage}");
                    Debug.LogError($"[OpenURLTester] Failed: {url} | {response.ErrorMessage}");
                }
            }
            catch (Exception e)
            {
                UpdateStatus($"✗ Exception: {e.Message}");
                Debug.LogError($"[OpenURLTester] Exception: {e}");
            }
        }

        private void UpdateStatus(string message)
        {
            if (statusText != null)
            {
                statusText.text = $"Status:\n{message}";
            }
            Debug.Log($"[OpenURLTester] {message}");
        }
    }
}


