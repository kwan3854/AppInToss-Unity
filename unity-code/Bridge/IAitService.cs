using System;

namespace AitBridge
{
    /// <summary>
    /// Interface for all AIT SDK bridge services
    /// Each AIT SDK feature should implement this interface
    /// </summary>
    public interface IAitService
    {
        /// <summary>
        /// Event name that will be dispatched to React
        /// Must match the eventName in the corresponding React service
        /// </summary>
        string EventName { get; }

        /// <summary>
        /// Initialize the service
        /// Called when the bridge is initialized
        /// </summary>
        void Initialize(AitSdkBridge bridge);

        /// <summary>
        /// Handle success callback from React
        /// </summary>
        /// <param name="requestId">Request identifier</param>
        /// <param name="data">Optional success data</param>
        void OnSuccess(string requestId, string data = null);

        /// <summary>
        /// Handle failure callback from React
        /// </summary>
        /// <param name="requestId">Request identifier</param>
        /// <param name="errorMessage">Error message from React</param>
        void OnFailure(string requestId, string errorMessage);
    }
}

