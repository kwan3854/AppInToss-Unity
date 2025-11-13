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

        private async void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            await Initialize();
        }

        /// <summary>
        /// Returns a task that completes when the safe area initialization is finished.
        /// </summary>
        public async UniTask WaitUntilInitialized()
        {
            await UniTask.WaitUntil(() => IsInitialized);
        }

        private async UniTask Initialize()
        {
            try
            {
#if UNITY_WEBGL && !UNITY_EDITOR
                // Call RPC to get safe area insets (already in device pixels)
                var insets = await AitRpcBridge.Instance.DeviceServiceClient.GetSafeAreaInsets();

                InsetsDevicePixels = new Rect(insets.Left, insets.Bottom, insets.Right, insets.Top);

                IsInitialized = true;
#else
                // In editor/standalone we calculate insets from Unity's Screen.safeArea.
                // Screen.safeArea is already in pixel coordinates and represents the safe rect,
                // so we need to convert that rect into edge insets (left/bottom/right/top).
                var safeArea = Screen.safeArea;
                var screenWidth = Screen.width;
                var screenHeight = Screen.height;

                var left = safeArea.xMin;
                var bottom = safeArea.yMin;
                var right = Mathf.Max(0f, screenWidth - safeArea.xMax);
                var top = Mathf.Max(0f, screenHeight - safeArea.yMax);

                InsetsDevicePixels = new Rect(left, bottom, right, top);

                IsInitialized = true;
#endif
                Debug.Log($"[SafeAreaManager] Initialized. Insets (Device Pixels): {InsetsDevicePixels}");

                await UniTask.CompletedTask;
            }
            catch (Exception e)
            {
                Debug.LogError($"[SafeAreaManager] Failed to initialize: {e.Message}");
            }
        }
    }
}
