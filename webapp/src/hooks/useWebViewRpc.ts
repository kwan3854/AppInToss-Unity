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
import { GameService } from "../generated/GameService/ait_game_GameServiceBase";
import { GameServiceImpl } from "../services/ait-rpc/GameServiceImpl";
import { AdService } from "../generated/AdService/ait_ad_AdServiceBase";
import { AdServiceImpl } from "../services/ait-rpc/AdServiceImpl";
import { IapService } from '../generated/IapService/ait_iap_IapServiceBase'; // Added
import { IapServiceImpl } from '../services/ait-rpc/IapServiceImpl'; // Added
import { StorageService } from '../generated/StorageService/ait_storage_StorageServiceBase'; // Added
import { StorageServiceImpl } from '../services/ait-rpc/StorageServiceImpl'; // Added
import type { UnityContextType } from "../services/ait/types";

/**
 * Custom hook to manage the WebView RPC server
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

      const gameServiceDef = GameService.bindService(new GameServiceImpl());
      rpcServer.services.push(gameServiceDef);

      const adServiceDef = AdService.bindService(new AdServiceImpl());
      rpcServer.services.push(adServiceDef);

      const iapServiceDef = IapService.bindService(new IapServiceImpl()); // Added
      rpcServer.services.push(iapServiceDef); // Added

      const storageServiceDef = StorageService.bindService(new StorageServiceImpl()); // Added
      rpcServer.services.push(storageServiceDef); // Added

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