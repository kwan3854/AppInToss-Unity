/**
 * WebView RPC Hook
 * 
 * Sets up WebView RPC server with all AIT services.
 * This replaces the old useAitBridge hook with RPC-based communication.
 */

import { useEffect, useRef } from "react";
import { WebViewRpcServer } from "app-webview-rpc";
import { ReactUnityBridge } from "../bridge/ReactUnityBridge";
import { OpenURLService } from "../generated/OpenURLService/ait_openurl_OpenURLServiceBase";
import { OpenURLServiceImpl } from "../services/ait-rpc/OpenURLServiceImpl";
import type { UnityContextType } from "../services/ait/types";

/**
 * WebView RPC Hook
 * 
 * Sets up RPC server that handles Unity requests using AIT SDK
 * 
 * @param unityContext - Unity context from useUnityContext (excluding unityProvider)
 * @param gameObjectName - Name of Unity GameObject (default: "AitRpcBridge")
 */
export const useWebViewRpc = (
  unityContext: UnityContextType,
  isLoaded: boolean, // New argument
  gameObjectName: string = "AitRpcBridge"
) => {
  const rpcServerRef = useRef<WebViewRpcServer | null>(null);

  useEffect(() => {
    if (isLoaded) { // Only run when loaded
      // Create bridge
      const bridge = new ReactUnityBridge(unityContext, gameObjectName);

      // Create RPC server
      const rpcServer = new WebViewRpcServer(bridge);

      // Register all AIT services
      const openURLServiceDef = OpenURLService.bindService(new OpenURLServiceImpl());
      rpcServer.services.push(openURLServiceDef);

      // Add more services here as you implement them:
      // const paymentServiceDef = PaymentService.bindService(new PaymentServiceImpl());
      // rpcServer.services.push(paymentServiceDef);

      // Start the server
      rpcServer.start();
      rpcServerRef.current = rpcServer;

      console.log(`[WebView RPC] Server started with ${rpcServer.services.length} service(s)`);
      console.log(`[WebView RPC] Listening on GameObject: ${gameObjectName}`);
    }

    // Cleanup on unmount
    return () => {
      if (rpcServerRef.current) {
        // WebView RPC Server doesn't have a stop method in v2.0
        // Just clear the reference
        rpcServerRef.current = null;
        console.log("[WebView RPC] Server stopped");
      }
    };
  }, [unityContext, isLoaded, gameObjectName]);

  return rpcServerRef.current;
};

