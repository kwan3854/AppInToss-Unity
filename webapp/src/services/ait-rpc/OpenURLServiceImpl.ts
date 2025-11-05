/**
 * OpenURL Service Implementation (Server)
 * 
 * This service receives OpenURL requests from Unity and calls the AIT SDK.
 */

import { openURL } from "@apps-in-toss/web-framework";
import { OpenURLServiceBase } from "../../generated/ait_openurl_OpenURLServiceBase";

/**
 * OpenURL Service Implementation
 * Inherits from auto-generated OpenURLServiceBase
 */
export class OpenURLServiceImpl extends OpenURLServiceBase {
  /**
   * Handle OpenURL request from Unity
   * @param requestObj - { url: string }
   * @returns Promise<{ success: boolean, error_message?: string }>
   */
  async OpenURL(requestObj: { url: string }) {
    console.log(`[OpenURLService] Received request to open URL: ${requestObj.url}`);

    try {
      // Call AIT SDK's openURL function
      await openURL(requestObj.url);

      console.log(`[OpenURLService] Successfully opened URL: ${requestObj.url}`);

      // Return success response
      return {
        success: true,
        error_message: ""
      };

    } catch (error) {
      // Return failure response
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[OpenURLService] Failed to open URL ${requestObj.url}:`, errorMessage);

      return {
        success: false,
        error_message: errorMessage
      };
    }
  }
}

