/**
 * React Unity Bridge for WebView RPC
 * 
 * Implements the bridge interface for app-webview-rpc to work with react-unity-webgl.
 * This allows WebView RPC to communicate between Unity WebGL and React.
 */

import type { UnityContextType } from '../services/ait/types';

export class ReactUnityBridge {
  private _onMessageCallback: ((msg: string) => void) | null = null;
  private _unityContext: UnityContextType;
  private _gameObjectName: string;

  /**
   * Create a new bridge
   * @param unityContext - Unity context from useUnityContext (excluding unityProvider)
   * @param gameObjectName - Name of Unity GameObject that will receive messages
   */
  constructor(unityContext: UnityContextType, gameObjectName: string = "AitRpcBridge") {
    this._unityContext = unityContext;
    this._gameObjectName = gameObjectName;

    // Listen for messages from Unity
    // Unity will dispatch events with name "WebViewRPC_Message"
    unityContext.addEventListener("WebViewRPC_Message", (message: string) => {
      const messageStr = String(message);
      if (this._onMessageCallback) {
        this._onMessageCallback(messageStr);
      }
    });
  }

  /**
   * Send a message to Unity (React -> Unity)
   * @param message - Base64-encoded message from WebView RPC
   */
  sendMessage(message: string): void {
    // Send message to Unity GameObject's ReceiveMessageFromWeb method
    this._unityContext.sendMessage(
      this._gameObjectName,
      "ReceiveMessageFromWeb",
      message
    );
  }

  /**
   * Register callback for messages from Unity (Unity -> React)
   * @param callback - Function to call when Unity sends a message
   */
  onMessage(callback: (msg: string) => void): void {
    this._onMessageCallback = callback;
  }
}

