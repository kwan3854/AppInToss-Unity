/**
 * Service Template
 * 
 * Copy this file to create a new AIT service.
 * 
 * Steps:
 * 1. Copy this file and rename it (e.g., payment.ts, share.ts)
 * 2. Update the service implementation
 * 3. Add the service to index.ts
 */

import type { AitService, UnityContextType, UnityCallbackConfig } from "./types";
// import { yourAitSdkFunction } from "@apps-in-toss/web-framework";

/**
 * [Service Name] Service
 * - Brief description of what this service does
 * - Unity event: "AIT_[YourFeature]"
 * - Payload format: "[param1]|[param2]|...|requestId"
 */
export const yourServiceName: AitService = {
  // Event name that Unity will dispatch
  eventName: "AIT_YourFeature",

  // Handler function
  handler: async (
    payload: string | number,
    context: UnityContextType,
    callbackConfig: UnityCallbackConfig
  ) => {
    // 1. Parse payload
    // Typical format: "param1|param2|...|requestId"
    const parts = String(payload).split('|');
    const requestId = parts[parts.length - 1]; // Last part is usually requestId
    
    // Extract your parameters
    // const param1 = parts[0];
    // const param2 = parts[1];

    // 2. Validate payload
    if (!requestId /* || !param1 || !param2 */) {
      console.error(
        `[${yourServiceName.eventName}] Invalid payload. Expected format: 'param1|param2|requestId'. Received:`,
        payload
      );
      return;
    }

    try {
      // 3. Call AIT SDK function
      // const result = await yourAitSdkFunction(param1, param2);

      // 4. Send success callback to Unity
      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.successMethod,
        requestId // Or include result: `${requestId}|${JSON.stringify(result)}`
      );

      console.log(`[${yourServiceName.eventName}] Success for requestId: ${requestId}`);

    } catch (error) {
      // 5. Send failure callback to Unity
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[${yourServiceName.eventName}] Failed:`, errorMessage);

      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.failureMethod,
        `${requestId}|${errorMessage}`
      );
    }
  },
};

