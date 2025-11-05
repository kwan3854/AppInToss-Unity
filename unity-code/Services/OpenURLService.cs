using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace AitBridge.Services
{
    /// <summary>
    /// OpenURL Service
    /// Opens a URL in the device's default browser or associated app
    /// 
    /// Usage:
    ///     var openURLService = AitSdkBridge.Instance.GetService<OpenURLService>();
    ///     openURLService.OpenURL("https://google.com", onSuccess, onFailure);
    /// </summary>
    public class OpenURLService : IAitService
    {
        private AitSdkBridge _bridge;
        
        // Pending requests with their callbacks
        private Dictionary<string, OpenURLRequest> _requests = new Dictionary<string, OpenURLRequest>();

        public string EventName => "AIT_OpenURL";

        private class OpenURLRequest
        {
            public string Url;
            public Action OnSuccess;
            public Action<string> OnFailure;
        }

        public void Initialize(AitSdkBridge bridge)
        {
            _bridge = bridge;
        }

        /// <summary>
        /// Open a URL in the device's default browser
        /// </summary>
        /// <param name="url">URL to open</param>
        /// <param name="onSuccess">Callback when URL is opened successfully</param>
        /// <param name="onFailure">Callback when URL opening fails (receives error message)</param>
        public void OpenURL(string url, Action onSuccess = null, Action<string> onFailure = null)
        {
            if (string.IsNullOrEmpty(url))
            {
                Debug.LogError("[OpenURLService] URL cannot be null or empty");
                onFailure?.Invoke("URL cannot be null or empty");
                return;
            }

            // Generate unique request ID
            var requestId = Guid.NewGuid().ToString();

            // Store the request with callbacks
            _requests[requestId] = new OpenURLRequest
            {
                Url = url,
                OnSuccess = onSuccess,
                OnFailure = onFailure
            };

            // Build payload: "url|requestId"
            var payload = $"{url}|{requestId}";

            // Dispatch event to React
            _bridge.DispatchEvent(EventName, payload, this, requestId);

            Debug.Log($"[OpenURLService] Requesting to open URL: {url}");
        }

        public void OnSuccess(string requestId, string data = null)
        {
            if (_requests.TryGetValue(requestId, out var request))
            {
                Debug.Log($"[OpenURLService] Successfully opened URL: {request.Url}");
                request.OnSuccess?.Invoke();
                _requests.Remove(requestId);
            }
        }

        public void OnFailure(string requestId, string errorMessage)
        {
            if (_requests.TryGetValue(requestId, out var request))
            {
                Debug.LogError($"[OpenURLService] Failed to open URL: {request.Url} | Error: {errorMessage}");
                request.OnFailure?.Invoke(errorMessage);
                _requests.Remove(requestId);
            }
        }
    }
}

