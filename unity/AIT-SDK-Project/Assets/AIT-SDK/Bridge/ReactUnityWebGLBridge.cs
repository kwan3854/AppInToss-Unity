using System;
using System.Runtime.InteropServices;
using UnityEngine;
using WebViewRPC;

namespace AitBridge.RPC
{
    /// <summary>
    /// Bridge implementation for Unity WebGL to React communication
    /// Implements IWebViewBridge for WebView RPC library
    /// </summary>
    public class ReactUnityWebGLBridge : IWebViewBridge
    {
        public event Action<string> OnMessageReceived;

#if UNITY_WEBGL && !UNITY_EDITOR
        /// <summary>
        /// External JavaScript function to dispatch events to React
        /// This is the same function used by react-unity-webgl internally
        /// </summary>
        [DllImport("__Internal")]
        private static extern void dispatchReactUnityEvent(string eventName, string payload);
#endif

        private const string RPC_EVENT_NAME = "WebViewRPC_Message";

        public ReactUnityWebGLBridge()
        {
            Debug.Log("[ReactUnityWebGLBridge] Bridge initialized");
        }

        /// <summary>
        /// Send a message to React (Unity -> React)
        /// </summary>
        /// <param name="message">Base64-encoded RPC message</param>
        public void SendMessageToWeb(string message)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            dispatchReactUnityEvent(RPC_EVENT_NAME, message);
            Debug.Log($"[ReactUnityWebGLBridge] Sent message to React (length: {message.Length})");
#else
            Debug.LogWarning($"[ReactUnityWebGLBridge] WebGL only. Would send message: {message.Substring(0, Math.Min(50, message.Length))}...");
#endif
        }

        /// <summary>
        /// Called by Unity GameObject when receiving message from React
        /// This method should be called by a MonoBehaviour attached to a GameObject
        /// </summary>
        /// <param name="message">Base64-encoded RPC message from React</param>
        public void ReceiveMessageFromWeb(string message)
        {
            Debug.Log($"[ReactUnityWebGLBridge] Received message from React (length: {message.Length})");
            OnMessageReceived?.Invoke(message);
        }
    }
}

