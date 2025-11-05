using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;

namespace AitBridge
{
    /// <summary>
    /// Singleton MonoBehaviour that manages all AIT SDK bridge services
    /// This is a pure bridge - it only handles service registration and routing
    /// 
    /// Architecture:
    /// - This bridge only handles service registration and callback routing
    /// - Each AIT SDK feature is implemented as a separate service
    /// - Services are auto-registered in the services list
    /// 
    /// To add a new AIT SDK feature:
    /// 1. Create a new service class in /Services/
    /// 2. Implement the IAitService interface
    /// 3. Add the service to the services list in Awake()
    /// </summary>
    public class AitSdkBridge : MonoBehaviour
    {
        // Singleton instance
        private static AitSdkBridge _instance;
        public static AitSdkBridge Instance
        {
            get
            {
                if (_instance == null)
                {
                    Debug.LogError("[AitSdkBridge] Instance is null. Make sure AitSdkBridge is in the scene.");
                }
                return _instance;
            }
        }

        // Registered services
        private Dictionary<string, IAitService> _services = new Dictionary<string, IAitService>();
        
        // Pending requests for callback routing
        private Dictionary<string, IAitService> _pendingRequests = new Dictionary<string, IAitService>();

#if UNITY_WEBGL && !UNITY_EDITOR
        /// <summary>
        /// External JavaScript function to dispatch events to React
        /// </summary>
        [DllImport("__Internal")]
        private static extern void dispatchReactUnityEvent(string eventName, string payload);
#endif

        private void Awake()
        {
            // Singleton pattern
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);

            // Register all services here
            RegisterService(new Services.OpenURLService());
            
            // Add more services as you implement them:
            // RegisterService(new Services.PaymentService());
            // RegisterService(new Services.ShareService());
            // etc.

            Debug.Log($"[AitSdkBridge] Initialized with {_services.Count} service(s)");
        }

        /// <summary>
        /// Register a service to the bridge
        /// </summary>
        private void RegisterService(IAitService service)
        {
            service.Initialize(this);
            _services[service.EventName] = service;
            Debug.Log($"[AitSdkBridge] Registered service: {service.EventName}");
        }

        /// <summary>
        /// Dispatch an event to React
        /// </summary>
        /// <param name="eventName">Event name (must match React service)</param>
        /// <param name="payload">Payload data</param>
        /// <param name="service">Service that initiated the request</param>
        /// <param name="requestId">Request identifier for tracking</param>
        public void DispatchEvent(string eventName, string payload, IAitService service, string requestId)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            // Store the service for callback routing
            _pendingRequests[requestId] = service;
            
            // Dispatch to React
            dispatchReactUnityEvent(eventName, payload);
            Debug.Log($"[AitSdkBridge] Dispatched event: {eventName} | Payload: {payload}");
#else
            Debug.LogWarning($"[AitSdkBridge] WebGL only. Event: {eventName} | Payload: {payload}");
            
            // For testing in Editor, simulate immediate success
            UnityEngine.Object.Destroy(null); // Just to avoid unused variable warning
            if (service != null)
            {
                Debug.Log($"[AitSdkBridge] Simulating success for testing in Editor");
                service.OnSuccess(requestId, "Editor simulation - success");
            }
#endif
        }

        // ============================================================
        // Callbacks from React (called via SendMessage)
        // ============================================================

        /// <summary>
        /// Called by React when an operation succeeds
        /// Format: "requestId" or "requestId|data"
        /// </summary>
        public void OnSuccess(string payload)
        {
            var parts = payload.Split(new[] { '|' }, 2);
            var requestId = parts[0];
            var data = parts.Length > 1 ? parts[1] : null;

            if (_pendingRequests.TryGetValue(requestId, out var service))
            {
                service.OnSuccess(requestId, data);
                _pendingRequests.Remove(requestId);
            }
            else
            {
                Debug.LogWarning($"[AitSdkBridge] OnSuccess called but no pending request found: {requestId}");
            }
        }

        /// <summary>
        /// Called by React when an operation fails
        /// Format: "requestId|errorMessage"
        /// </summary>
        public void OnFailure(string payload)
        {
            var parts = payload.Split(new[] { '|' }, 2);
            var requestId = parts[0];
            var errorMessage = parts.Length > 1 ? parts[1] : "Unknown error";

            if (_pendingRequests.TryGetValue(requestId, out var service))
            {
                service.OnFailure(requestId, errorMessage);
                _pendingRequests.Remove(requestId);
            }
            else
            {
                Debug.LogWarning($"[AitSdkBridge] OnFailure called but no pending request found: {requestId}");
            }
        }

        /// <summary>
        /// Get a registered service by event name
        /// </summary>
        public T GetService<T>() where T : class, IAitService
        {
            foreach (var service in _services.Values)
            {
                if (service is T typedService)
                {
                    return typedService;
                }
            }
            return null;
        }
    }
}

