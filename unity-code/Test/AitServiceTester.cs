using UnityEngine;
using UnityEngine.UI;
using AitBridge;
using AitBridge.Services;

namespace AitBridge.Test
{
    /// <summary>
    /// Test UI for AIT Services
    /// Attach this to a Canvas to test the OpenURL service
    /// 
    /// This script creates a simple test UI with buttons to test various URLs
    /// </summary>
    public class AitServiceTester : MonoBehaviour
    {
        [Header("Test URLs")]
        [SerializeField] private string testUrl1 = "https://google.com";
        [SerializeField] private string testUrl2 = "https://github.com";
        [SerializeField] private string testUrl3 = "https://unity.com";
        [SerializeField] private string invalidUrl = "not-a-valid-url";

        [Header("UI Elements (Auto-created if null)")]
        [SerializeField] private Button openGoogleButton;
        [SerializeField] private Button openGithubButton;
        [SerializeField] private Button openUnityButton;
        [SerializeField] private Button testInvalidButton;
        [SerializeField] private Text statusText;

        private OpenURLService _openURLService;
        private Canvas _canvas;

        private void Start()
        {
            // Get the OpenURL service from the bridge
            _openURLService = AitSdkBridge.Instance?.GetService<OpenURLService>();

            if (_openURLService == null)
            {
                Debug.LogError("[AitServiceTester] OpenURLService not found. Make sure AitSdkBridge is in the scene.");
                return;
            }

            // Create UI if not assigned
            SetupUI();

            UpdateStatus("Ready. Click a button to test OpenURL service.");
        }

        private void SetupUI()
        {
            // Get or create Canvas
            _canvas = GetComponent<Canvas>();
            if (_canvas == null)
            {
                _canvas = gameObject.AddComponent<Canvas>();
                _canvas.renderMode = RenderMode.ScreenSpaceOverlay;
                gameObject.AddComponent<CanvasScaler>();
                gameObject.AddComponent<GraphicRaycaster>();
            }

            // Create a vertical layout group for buttons
            var panel = new GameObject("TestPanel");
            panel.transform.SetParent(transform, false);
            
            var rectTransform = panel.AddComponent<RectTransform>();
            rectTransform.anchorMin = new Vector2(0.5f, 0.5f);
            rectTransform.anchorMax = new Vector2(0.5f, 0.5f);
            rectTransform.sizeDelta = new Vector2(400, 500);
            
            var layoutGroup = panel.AddComponent<VerticalLayoutGroup>();
            layoutGroup.spacing = 10;
            layoutGroup.padding = new RectOffset(20, 20, 20, 20);
            layoutGroup.childControlWidth = true;
            layoutGroup.childControlHeight = false;
            layoutGroup.childForceExpandWidth = true;
            layoutGroup.childForceExpandHeight = false;

            // Create status text
            if (statusText == null)
            {
                statusText = CreateText(panel.transform, "Status: Initializing...", 100);
            }

            // Create buttons if not assigned
            if (openGoogleButton == null)
            {
                openGoogleButton = CreateButton(panel.transform, "Open Google", () => TestOpenURL(testUrl1));
            }

            if (openGithubButton == null)
            {
                openGithubButton = CreateButton(panel.transform, "Open GitHub", () => TestOpenURL(testUrl2));
            }

            if (openUnityButton == null)
            {
                openUnityButton = CreateButton(panel.transform, "Open Unity", () => TestOpenURL(testUrl3));
            }

            if (testInvalidButton == null)
            {
                testInvalidButton = CreateButton(panel.transform, "Test Invalid URL", () => TestOpenURL(invalidUrl));
            }
        }

        private Button CreateButton(Transform parent, string label, UnityEngine.Events.UnityAction onClick)
        {
            var buttonObj = new GameObject(label);
            buttonObj.transform.SetParent(parent, false);

            var rectTransform = buttonObj.AddComponent<RectTransform>();
            rectTransform.sizeDelta = new Vector2(0, 60);

            var image = buttonObj.AddComponent<Image>();
            image.color = new Color(0.2f, 0.3f, 0.8f);

            var button = buttonObj.AddComponent<Button>();
            button.targetGraphic = image;
            button.onClick.AddListener(onClick);

            var textObj = new GameObject("Text");
            textObj.transform.SetParent(buttonObj.transform, false);

            var textRect = textObj.AddComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.sizeDelta = Vector2.zero;

            var text = textObj.AddComponent<Text>();
            text.text = label;
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.fontSize = 24;
            text.alignment = TextAnchor.MiddleCenter;
            text.color = Color.white;

            return button;
        }

        private Text CreateText(Transform parent, string content, float height)
        {
            var textObj = new GameObject("StatusText");
            textObj.transform.SetParent(parent, false);

            var rectTransform = textObj.AddComponent<RectTransform>();
            rectTransform.sizeDelta = new Vector2(0, height);

            var text = textObj.AddComponent<Text>();
            text.text = content;
            text.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            text.fontSize = 18;
            text.alignment = TextAnchor.MiddleLeft;
            text.color = Color.white;

            return text;
        }

        private void TestOpenURL(string url)
        {
            UpdateStatus($"Opening: {url}...");

            _openURLService.OpenURL(
                url,
                onSuccess: () =>
                {
                    UpdateStatus($"✓ Successfully opened: {url}");
                    Debug.Log($"[TEST] Success: {url}");
                },
                onFailure: (error) =>
                {
                    UpdateStatus($"✗ Failed to open: {url}\nError: {error}");
                    Debug.LogError($"[TEST] Failure: {url} | {error}");
                }
            );
        }

        private void UpdateStatus(string message)
        {
            if (statusText != null)
            {
                statusText.text = $"Status:\n{message}";
            }
            Debug.Log($"[AitServiceTester] {message}");
        }
    }
}

