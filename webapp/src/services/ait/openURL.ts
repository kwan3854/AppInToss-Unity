import { openURL as aitOpenURL } from "@apps-in-toss/web-framework";
import type { AitService, UnityContextType, UnityCallbackConfig } from "./types";

/**
 * OpenURL Service
 * - Opens a URL in the device's default browser or associated app
 * - Unity event: "AIT_OpenURL"
 * - Payload format: "url|requestId"
 */
export const openURLService: AitService = {
  eventName: "AIT_OpenURL",

  handler: async (
    payload: string | number,
    context: UnityContextType,
    callbackConfig: UnityCallbackConfig
  ) => {
    // Parse payload: "url|requestId"
    const [url, requestId] = String(payload).split('|');

    // Validate payload
    if (!url || !requestId) {
      console.error(
        `[${openURLService.eventName}] Invalid payload. Expected format: 'url|requestId'. Received:`,
        payload
      );
      return;
    }

    try {
      // Call AIT SDK's openURL function
      await aitOpenURL(url);

      // Send success callback to Unity
      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.successMethod,
        requestId
      );

      console.log(`[${openURLService.eventName}] Successfully opened URL: ${url}`);

    } catch (error) {
      // Send failure callback to Unity
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[${openURLService.eventName}] Failed to open URL ${url}:`, errorMessage);

      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.failureMethod,
        `${requestId}|${errorMessage}`
      );
    }
  },
};

