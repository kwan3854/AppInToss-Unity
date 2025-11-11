using Cysharp.Threading.Tasks;
using System;
using Ait.Device;
using AitBridge.RPC;
using UnityEngine;
using UnityEngine.UI;

namespace AIT.Device
{
    public class SafeAreaManager : MonoBehaviour
    {
        private RectTransform _panel;
        private Canvas _canvas;

        private void Awake()
        {
            _panel = GetComponent<RectTransform>();
            _canvas = GetComponentInParent<Canvas>();

            if (_panel == null)
            {
                Debug.LogError("[SafeAreaManager] RectTransform component not found on this GameObject.");
                return;
            }
            if (_canvas == null)
            {
                Debug.LogError("[SafeAreaManager] Canvas component not found in parent hierarchy.");
                return;
            }

            ApplySafeArea().Forget();
        }

        private async UniTaskVoid ApplySafeArea()
        {
            try
            {
                // Call RPC to get safe area insets from web app
                var insets = await AitRpcBridge.Instance.DeviceServiceClient.GetSafeAreaInsets(new GetSafeAreaInsetsRequest { Dummy = true });

                // Convert CSS pixels to device pixels
                float devicePixelRatio = Screen.dpi / 96f; // Standard DPI is 96
                if (devicePixelRatio == 0) devicePixelRatio = 1; // Fallback if DPI is not available

                float leftPx = insets.Left * devicePixelRatio;
                float rightPx = insets.Right * devicePixelRatio;
                float topPx = insets.Top * devicePixelRatio;
                float bottomPx = insets.Bottom * devicePixelRatio;

                // Convert device pixels to Unity UI Canvas units
                float canvasScaleFactor = _canvas.scaleFactor;

                float leftCanvas = leftPx / canvasScaleFactor;
                float rightCanvas = rightPx / canvasScaleFactor;
                float topCanvas = topPx / canvasScaleFactor;
                float bottomCanvas = bottomPx / canvasScaleFactor;

                // Apply to RectTransform
                _panel.offsetMin = new Vector2(leftCanvas, bottomCanvas);
                _panel.offsetMax = new Vector2(-rightCanvas, -topCanvas);

                Debug.Log($"[SafeAreaManager] Applied Safe Area: Left={leftCanvas}, Right={rightCanvas}, Top={topCanvas}, Bottom={bottomCanvas}");
            }
            catch (Exception e)
            {
                Debug.LogError($"[SafeAreaManager] Failed to apply safe area: {e.Message}");
            }
        }
    }
}