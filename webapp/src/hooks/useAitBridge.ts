import { useEffect, useCallback } from "react";
import { aitServices, DEFAULT_CALLBACK_CONFIG } from "../services/ait";
import type { UnityContextType, UnityCallbackConfig } from "../services/ait";

/**
 * AIT Bridge Hook
 * 
 * This hook serves as a pure bridge between Unity and AIT SDK services.
 * It automatically registers all services defined in the aitServices array.
 * 
 * Architecture:
 * - This hook only handles service registration and event routing
 * - Each AIT SDK feature is implemented as a separate service
 * - Services are auto-registered from the aitServices array
 * 
 * To add a new AIT SDK feature:
 * 1. Create a new service file in /services/ait/
 * 2. Implement the AitService interface
 * 3. Add the service to aitServices array in /services/ait/index.ts
 * 
 * @param unityContext - Unity context from useUnityContext (excluding unityProvider)
 * @param callbackConfig - Optional Unity callback configuration (defaults to DEFAULT_CALLBACK_CONFIG)
 */
export const useAitBridge = (
  unityContext: UnityContextType,
  callbackConfig: UnityCallbackConfig = DEFAULT_CALLBACK_CONFIG
) => {
  const { addEventListener, removeEventListener } = unityContext;

  // Create memoized handlers for each service
  const serviceHandlers = aitServices.map((service) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handler = useCallback(
      (payload: string | number) => {
        service.handler(payload, unityContext, callbackConfig);
      },
      [service, unityContext, callbackConfig]
    );

    return {
      eventName: service.eventName,
      handler,
    };
  });

  // Register all service event listeners
  useEffect(() => {
    // Ensure Unity context is ready
    if (!addEventListener || !removeEventListener) {
      return;
    }

    // Register all service handlers
    serviceHandlers.forEach(({ eventName, handler }) => {
      addEventListener(eventName, handler);
    });

    // Cleanup: Remove all event listeners on unmount
    return () => {
      serviceHandlers.forEach(({ eventName, handler }) => {
        removeEventListener(eventName, handler);
      });
    };
  }, [addEventListener, removeEventListener, serviceHandlers]);

  // Log registered services (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        `[AIT Bridge] Registered ${aitServices.length} service(s):`,
        aitServices.map((s) => s.eventName).join(", ")
      );
    }
  }, []);
};
