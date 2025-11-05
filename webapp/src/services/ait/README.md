# AIT Services Architecture

This directory contains all AIT SDK bridge services for Unity ↔ React communication.

## Architecture Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Unity     │  Event  │  useAitBridge│ Routes  │ AIT Service │
│   (C#)      │────────▶│   (Bridge)   │────────▶│  (Handler)  │
│             │◀────────│              │◀────────│             │
└─────────────┘Callback └──────────────┘ Response└─────────────┘
```

### Components

1. **useAitBridge Hook** (`/hooks/useAitBridge.ts`)
   - Pure bridge that only handles service registration
   - Automatically registers all services from `aitServices` array
   - Routes Unity events to appropriate service handlers

2. **Services** (`/services/ait/*.ts`)
   - Each file implements one AIT SDK feature
   - Self-contained logic for handling Unity ↔ AIT communication
   - Easy to test and maintain independently

3. **Types** (`/services/ait/types.ts`)
   - Shared type definitions and interfaces
   - `AitService` interface that all services must implement
   - Unity callback configuration

## Adding a New Service

### Step 1: Create a Service File

Create a new file in `/services/ait/` (e.g., `payment.ts`):

```typescript
import { /* AIT SDK function */ } from "@apps-in-toss/web-framework";
import type { AitService, UnityContextType, UnityCallbackConfig } from "./types";

/**
 * Payment Service
 * - Handles in-app payment through AIT SDK
 * - Unity event: "AIT_Payment"
 * - Payload format: "productId|requestId"
 */
export const paymentService: AitService = {
  eventName: "AIT_Payment",

  handler: async (
    payload: string | number,
    context: UnityContextType,
    callbackConfig: UnityCallbackConfig
  ) => {
    // 1. Parse payload
    const [productId, requestId] = String(payload).split('|');

    // 2. Validate payload
    if (!productId || !requestId) {
      console.error(`[AIT_Payment] Invalid payload:`, payload);
      return;
    }

    try {
      // 3. Call AIT SDK function
      const result = await aitPaymentFunction(productId);

      // 4. Send success callback to Unity
      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.successMethod,
        `${requestId}|${JSON.stringify(result)}`
      );

    } catch (error) {
      // 5. Send failure callback to Unity
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[AIT_Payment] Error:`, errorMessage);

      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.failureMethod,
        `${requestId}|${errorMessage}`
      );
    }
  },
};
```

### Step 2: Register the Service

Add your service to `/services/ait/index.ts`:

```typescript
export { paymentService } from "./payment";

import { openURLService } from "./openURL";
import { paymentService } from "./payment"; // Add this

export const aitServices: AitService[] = [
  openURLService,
  paymentService, // Add this
];
```

That's it! The bridge will automatically register your service.

## Unity Integration

### C# Side (Unity)

1. **Create a GameObject** named `AitSdkBridge` in your scene
2. **Attach a script** with the following methods:

```csharp
using UnityEngine;
using System.Runtime.InteropServices;

public class AitSdkBridge : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void dispatchReactUnityEvent(string eventName, string payload);

    // Call this to trigger openURL
    public void OpenURL(string url)
    {
        string requestId = System.Guid.NewGuid().ToString();
        string payload = $"{url}|{requestId}";
        
#if UNITY_WEBGL && !UNITY_EDITOR
        dispatchReactUnityEvent("AIT_OpenURL", payload);
#endif
    }

    // React will call this on success
    public void OnSuccess(string requestId)
    {
        Debug.Log($"Success: {requestId}");
    }

    // React will call this on failure
    public void OnFailure(string data)
    {
        string[] parts = data.Split('|');
        string requestId = parts[0];
        string errorMessage = parts.Length > 1 ? parts[1] : "Unknown error";
        
        Debug.LogError($"Failure: {requestId} - {errorMessage}");
    }
}
```

## Service Contract

### Payload Format

Most services use the format: `data|requestId`

- **data**: The actual parameter(s) for the AIT SDK function
- **requestId**: A unique identifier for tracking the request/response

### Callback Format

**Success**: `requestId` or `requestId|resultData`
**Failure**: `requestId|errorMessage`

## Example: Complete Flow

1. **Unity calls React**:
   ```csharp
   dispatchReactUnityEvent("AIT_OpenURL", "https://google.com|abc123");
   ```

2. **Bridge routes to service**:
   - `useAitBridge` receives event `AIT_OpenURL`
   - Routes to `openURLService.handler`

3. **Service processes**:
   - Parses payload: `url = "https://google.com"`, `requestId = "abc123"`
   - Calls AIT SDK: `await openURL(url)`

4. **Service responds to Unity**:
   - Success: `sendMessage("AitSdkBridge", "OnSuccess", "abc123")`
   - Failure: `sendMessage("AitSdkBridge", "OnFailure", "abc123|Network error")`

## Benefits of This Architecture

✅ **Scalability**: Add dozens of services without modifying the bridge
✅ **Maintainability**: Each service is isolated and testable
✅ **Type Safety**: TypeScript ensures correct implementation
✅ **Auto-registration**: No manual wiring needed
✅ **Clean Separation**: Bridge logic separate from business logic

