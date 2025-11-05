// Type definitions for auto-generated OpenURL Service

export interface OpenURLRequest {
  url: string;
}

export interface OpenURLResponse {
  success: boolean;
  error_message?: string;
}

export abstract class OpenURLServiceBase {
  abstract OpenURL(requestObj: OpenURLRequest): Promise<OpenURLResponse>;
}

export class OpenURLService {
  static bindService(impl: OpenURLServiceBase): ServiceDefinition;
}

interface ServiceDefinition {
  methodHandlers: {
    [key: string]: (reqBytes: Uint8Array) => Promise<Uint8Array>;
  };
}

