using Cysharp.Threading.Tasks;
using UnityEngine;

namespace AIT.Device
{
    /// <summary>
    /// Applies safe area offsets to the RectTransform on this GameObject.
    /// It fetches raw pixel data from SafeAreaManager and calculates the final offsets
    /// based on the Canvas it belongs to.
    /// </summary>
    [RequireComponent(typeof(RectTransform))]
    public class SafeAreaPanel : MonoBehaviour
    {
        private Canvas _canvas;
        private RectTransform _rectTransform;

        private void Awake()
        {
            _canvas = GetComponentInParent<Canvas>();
            _rectTransform = GetComponent<RectTransform>();

            if (_canvas == null)
            {
                Debug.LogError("[SafeAreaPanel] Could not find a parent Canvas.", this);
            }
        }

        private void Start()
        {
            if (_canvas == null) return;

            // Check if the manager is already initialized.
            if (SafeAreaManager.Instance != null && SafeAreaManager.Instance.IsInitialized)
            {
                ApplySafeArea();
            }
            else
            {
                // If the manager is not ready, wait for it.
                ApplySafeAreaAsync().Forget();
            }
        }

        private void ApplySafeArea()
        {
            if (SafeAreaManager.Instance == null)
            {
                Debug.LogError("[SafeAreaPanel] SafeAreaManager.Instance is null. Ensure a SafeAreaManager is in your initial scene.", this);
                return;
            }

            Rect insetsPx = SafeAreaManager.Instance.InsetsDevicePixels;

            float canvasScaleFactor = _canvas.scaleFactor;
            if (canvasScaleFactor <= 0)
            {
                Debug.LogWarning("[SafeAreaPanel] Canvas Scale Factor is 0 or negative. Defaulting to 1.", this);
                canvasScaleFactor = 1;
            }

            // Convert device pixels to UI units for this specific canvas
            var offsetMin = new Vector2(insetsPx.x / canvasScaleFactor, insetsPx.y / canvasScaleFactor);
            var offsetMax = new Vector2(-insetsPx.width / canvasScaleFactor, -insetsPx.height / canvasScaleFactor);

            _rectTransform.offsetMin = offsetMin;
            _rectTransform.offsetMax = offsetMax;
        }

        private async UniTaskVoid ApplySafeAreaAsync()
        {
            if (SafeAreaManager.Instance == null)
            {
                Debug.LogError("[SafeAreaPanel] SafeAreaManager.Instance is null. Ensure a SafeAreaManager is in your initial scene.", this);
                return;
            }

            await SafeAreaManager.Instance.WaitUntilInitialized();
            ApplySafeArea();
        }
    }
}