/**
 * Unity Context Type Definition
 * - useUnityContext hook's return type excluding unityProvider
 */
export type UnityContextType = {
  addEventListener: (eventName: string, callback: (payload: string | number | boolean) => void) => void;
  removeEventListener: (eventName:string, callback: (payload: string | number | boolean) => void) => void;
  sendMessage: (gameObjectName: string, methodName: string, parameter?: string | number) => void;
};

/**
 * Unity Callback Configuration
 * - GameObject name and method names for Unity callbacks
 */
export interface UnityCallbackConfig {
  /** Name of the GameObject in Unity scene that will receive callbacks */
  gameObjectName: string;
  /** C# method name for success callback */
  successMethod: string;
  /** C# method name for failure callback */
  failureMethod: string;
}

/**
 * AIT Service Interface
 * - Each AIT SDK feature should implement this interface
 */
export interface AitService {
  /** Event name that Unity will dispatch to trigger this service */
  eventName: string;
  
  /** 
   * Event handler function
   * @param payload - Data sent from Unity
   * @param context - Unity context for sending messages back
   * @param callbackConfig - Configuration for Unity callbacks
   */
  handler: (
    payload: string | number,
    context: UnityContextType,
    callbackConfig: UnityCallbackConfig
  ) => void | Promise<void>;
}

/**
 * Default Unity Callback Configuration
 * - This should match the GameObject and methods in your Unity scene
 */
export const DEFAULT_CALLBACK_CONFIG: UnityCallbackConfig = {
  gameObjectName: "AitSdkBridge",
  successMethod: "OnSuccess",
  failureMethod: "OnFailure",
};

