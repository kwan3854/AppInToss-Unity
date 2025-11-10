import { getSafeAreaInsets } from "@apps-in-toss/web-framework";
import { DeviceServiceBase } from "../../generated/DeviceService/ait_device_DeviceServiceBase";
import type {
  GetSafeAreaInsetsRequest,
  GetSafeAreaInsetsResponse,
} from "../../generated/DeviceService/DeviceService";

export class DeviceServiceImpl extends DeviceServiceBase {
  async GetSafeAreaInsets(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: GetSafeAreaInsetsRequest
  ): Promise<GetSafeAreaInsetsResponse> {
    const insets = getSafeAreaInsets();
    const ratio = window.devicePixelRatio || 1;

    console.log(`[DeviceService] Safe Area Insets (CSS):`, insets);
    console.log(`[DeviceService] Device Pixel Ratio:`, ratio);

    const response: GetSafeAreaInsetsResponse = {
      top: (insets.top ?? 0) * ratio,
      bottom: (insets.bottom ?? 0) * ratio,
      left: (insets.left ?? 0) * ratio,
      right: (insets.right ?? 0) * ratio,
    };

    console.log(`[DeviceService] Safe Area Insets (Device Pixels):`, response);

    return response;
  }
}
