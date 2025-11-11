using Cysharp.Threading.Tasks;
using System;
using Ait.Device;
using AitBridge.RPC;
using UnityEngine;

namespace AIT.Device
{
    /// <summary>
    /// Manages fetching and caching the raw device pixel safe area insets from the web environment.
    /// This class is a singleton and should be placed on a persistent object in your initial scene.
    /// </summary>
    public class SafeAreaManager : MonoBehaviour
    {
        public static SafeAreaManager Instance { get; private set; }

        /// <summary>
        /// The safe area insets in raw device pixels. (x=left, y=bottom, width=right, height=top)
        /// </summary>
        public Rect InsetsDevicePixels { get; private set; }

        /// <summary>
        /// Returns true if the safe area values have been successfully fetched and cached.
        /// </summary>
        public bool IsInitialized { get; private set; }

        private UniTask _initializationTask;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            _initializationTask = Initialize();
        }

        /// <summary>
        /// Returns a task that completes when the safe area initialization is finished.
        /// </summary>
        public async UniTask WaitUntilInitialized()
        {
            await _initializationTask;
        }

        private async UniTask Initialize()
        {
            try
            {
                // Call RPC to get safe area insets (already in device pixels)
                var insets = await AitRpcBridge.Instance.DeviceServiceClient.GetSafeAreaInsets(new GetSafeAreaInsetsRequest { Dummy = true });

                InsetsDevicePixels = new Rect(insets.Left, insets.Bottom, insets.Right, insets.Top);

                IsInitialized = true;
                Debug.Log($"[SafeAreaManager] Initialized. Insets (Device Pixels): {InsetsDevicePixels}");
            }
            catch (Exception e)
            {
                Debug.LogError($"[SafeAreaManager] Failed to initialize: {e.Message}");
            }
        }
    }
}