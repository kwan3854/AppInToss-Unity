import { GoogleAdMob } from "@apps-in-toss/web-framework";
import { AdServiceBase } from "../../generated/AdService/ait_ad_AdServiceBase";
import type {
  LoadAdRequest,
  LoadAdResponse,
  ShowAdRequest,
  ShowAdResponse,
} from "../../generated/AdService/AdService";

export class AdServiceImpl extends AdServiceBase {
  async *LoadAd(request: LoadAdRequest): AsyncGenerator<LoadAdResponse, any, undefined> {
    if (!GoogleAdMob.loadAppsInTossAdMob.isSupported()) {
      console.error("[AdService] loadAppsInTossAdMob is not supported in this environment.");
      // We can't yield an error message here as the proto doesn't define a top-level error field.
      // The client will simply receive an empty stream.
      return;
    }

    const adGroupId = request.ad_group_id;
    console.log(`[AdService] Loading Ad for adGroupId: ${adGroupId}`);

    // This is a generator, so we need a way to yield values from a callback.
    // We'll use a "controller" pattern with a promise that resolves when the ad flow is done.
    let resolve: (value: unknown) => void;
    const done = new Promise((r) => (resolve = r));

    const cleanup = GoogleAdMob.loadAppsInTossAdMob({
      options: {
        adGroupId: adGroupId,
      },
      onEvent: (event) => {
        console.log(`[AdService] LoadAd event: ${event.type}`, event);
        switch (event.type) {
          case "loaded":
            // The 'data' field in the event is the ResponseInfo.
            // The generator will yield this value to the Unity client.
            this.controller.yield({
              loaded: {
                data: {
                  response_id: event.data.responseId,
                  loaded_ad_network_info: event.data.loadedAdNetworkInfo ? {
                    ad_source_id: event.data.loadedAdNetworkInfo.adSourceId,
                    ad_source_name: event.data.loadedAdNetworkInfo.adSourceName,
                    ad_source_instance_id: event.data.loadedAdNetworkInfo.adSourceInstanceId,
                    ad_source_instance_name: event.data.loadedAdNetworkInfo.adSourceInstanceName,
                    ad_network_class_name: event.data.loadedAdNetworkInfo.adNetworkClassName ?? "",
                  } : undefined,
                  ad_network_info_array: event.data.adNetworkInfoArray.map(info => ({
                    ad_source_id: info.adSourceId,
                    ad_source_name: info.adSourceName,
                    ad_source_instance_id: info.adSourceInstanceId,
                    ad_source_instance_name: info.adSourceInstanceName,
                    ad_network_class_name: info.adNetworkClassName ?? "",
                  })),
                },
              },
            });
            break;
          case "clicked":
            this.controller.yield({ clicked: {} });
            break;
          case "dismissed":
            this.controller.yield({ dismissed: {} });
            resolve(undefined); // End of stream
            break;
          case "failedToShow":
            this.controller.yield({ failed_to_show: {} });
            resolve(undefined); // End of stream
            break;
          case "impression":
            this.controller.yield({ impression: {} });
            break;
          case "show":
            this.controller.yield({ show: {} });
            break;
        }
      },
      onError: (error) => {
        console.error("[AdService] Failed to load ad:", error);
        resolve(undefined); // End of stream on error
      },
    });

    // The `app-webview-rpc` library provides the controller to the generator.
    // We yield values via this.controller.yield()
    // When the stream is over (e.g., ad dismissed, error), we resolve the promise.
    await done;

    // Cleanup the Toss SDK listener
    if (typeof cleanup === 'function') {
      cleanup();
    }
  }

  async *ShowAd(request: ShowAdRequest): AsyncGenerator<ShowAdResponse, any, undefined> {
    if (!GoogleAdMob.showAppsInTossAdMob.isSupported()) {
      console.error("[AdService] showAppsInTossAdMob is not supported in this environment.");
      return;
    }

    const adGroupId = request.ad_group_id;
    console.log(`[AdService] Showing Ad for adGroupId: ${adGroupId}`);

    let resolve: (value: unknown) => void;
    const done = new Promise((r) => (resolve = r));

    const cleanup = GoogleAdMob.showAppsInTossAdMob({
      options: {
        adGroupId: adGroupId,
      },
      onEvent: (event) => {
        console.log(`[AdService] ShowAd event: ${event.type}`, event);
        switch (event.type) {
          case "requested":
            this.controller.yield({ requested: {} });
            break;
          case "clicked":
            this.controller.yield({ clicked: {} });
            break;
          case "dismissed":
            this.controller.yield({ dismissed: {} });
            resolve(undefined); // End of stream
            break;
          case "failedToShow":
            this.controller.yield({ failed_to_show: {} });
            resolve(undefined); // End of stream
            break;
          case "impression":
            this.controller.yield({ impression: {} });
            break;
          case "show":
            this.controller.yield({ show: {} });
            break;
          case "userEarnedReward":
            this.controller.yield({
              user_earned_reward: {
                unit_type: event.data.unitType,
                unit_amount: event.data.unitAmount,
              },
            });
            break;
        }
      },
      onError: (error) => {
        console.error("[AdService] Failed to show ad:", error);
        resolve(undefined); // End of stream on error
      },
    });

    await done;

    if (typeof cleanup === 'function') {
      cleanup();
    }
  }
}
