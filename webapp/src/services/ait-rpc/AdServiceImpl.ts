import { GoogleAdMob } from "@apps-in-toss/web-framework";
import { AdServiceBase } from "../../generated/AdService/ait_ad_AdServiceBase";
import type {
  LoadAdRequest,
  LoadAdResponse,
  PollLoadAdEventsRequest,
  PollLoadAdEventsResponse,
  ShowAdRequest,
  ShowAdResponse,
  PollShowAdEventsRequest,
  PollShowAdEventsResponse,
  LoadAdEvent,
  ShowAdEvent,
} from "../../generated/AdService/AdService";

// --- State Management ---

interface AdOperationState<T> {
  events: T[];
  isFinished: boolean;
}

// Using a simple in-memory store for ad operations.
// Key: operation_id (string), Value: AdOperationState
const adOperationStore = new Map<string, AdOperationState<LoadAdEvent | ShowAdEvent>>();


export class AdServiceImpl extends AdServiceBase {
  // --- LoadAd ---

  async LoadAd(request: LoadAdRequest): Promise<LoadAdResponse> {
    if (!GoogleAdMob.loadAppsInTossAdMob.isSupported()) {
      // This case should ideally be handled by the client checking before calling.
      // Returning an empty operation_id to indicate failure to start.
      console.error("[AdService] loadAppsInTossAdMob is not supported.");
      return { operation_id: "" };
    }

    const operationId = crypto.randomUUID();
    adOperationStore.set(operationId, { events: [], isFinished: false });

    console.log(`[AdService] Starting LoadAd operation: ${operationId} for adGroupId: ${request.ad_group_id}`);

    GoogleAdMob.loadAppsInTossAdMob({
      options: {
        adGroupId: request.ad_group_id,
      },
      onEvent: (event) => {
        const state = adOperationStore.get(operationId) as AdOperationState<LoadAdEvent>;
        if (!state) return;

        console.log(`[AdService] LoadAd event for ${operationId}: ${event.type}`);
        let newEvent: LoadAdEvent | null = null;

        switch (event.type) {
          case "loaded":
            newEvent = {
              loaded: {
                data: {
                  response_id: event.data.responseId ?? "",
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
            };
            break;
          case "clicked": newEvent = { clicked: {} }; break;
          case "impression": newEvent = { impression: {} }; break;
          case "show": newEvent = { show: {} }; break;
          case "dismissed":
            newEvent = { dismissed: {} };
            state.isFinished = true;
            break;
          case "failedToShow":
            newEvent = { failed_to_show: {} };
            state.isFinished = true;
            break;
        }
        if (newEvent) {
          state.events.push(newEvent);
        }
      },
      onError: (error) => {
        console.error(`[AdService] Error in LoadAd operation ${operationId}:`, error);
        const state = adOperationStore.get(operationId);
        if (state) {
          state.isFinished = true;
        }
      },
    });

    return { operation_id: operationId };
  }

  async PollLoadAdEvents(request: PollLoadAdEventsRequest): Promise<PollLoadAdEventsResponse> {
    const state = adOperationStore.get(request.operation_id) as AdOperationState<LoadAdEvent>;

    if (!state) {
      console.warn(`[AdService] Polling for unknown LoadAd operation: ${request.operation_id}`);
      return { events: [], is_finished: true }; // Tell client to stop polling for unknown ops.
    }

    const eventsToReturn = [...state.events];
    state.events = []; // Clear the queue

    if (state.isFinished) {
      // Clean up the store after the client has been notified of completion.
      adOperationStore.delete(request.operation_id);
      console.log(`[AdService] Finished and cleaned up LoadAd operation: ${request.operation_id}`);
    }

    return { events: eventsToReturn, is_finished: state.isFinished };
  }

  // --- ShowAd ---

  async ShowAd(request: ShowAdRequest): Promise<ShowAdResponse> {
    if (!GoogleAdMob.showAppsInTossAdMob.isSupported()) {
      console.error("[AdService] showAppsInTossAdMob is not supported.");
      return { operation_id: "" };
    }

    const operationId = crypto.randomUUID();
    adOperationStore.set(operationId, { events: [], isFinished: false });

    console.log(`[AdService] Starting ShowAd operation: ${operationId} for adGroupId: ${request.ad_group_id}`);

    GoogleAdMob.showAppsInTossAdMob({
      options: {
        adGroupId: request.ad_group_id,
      },
      onEvent: (event) => {
        const state = adOperationStore.get(operationId) as AdOperationState<ShowAdEvent>;
        if (!state) return;

        console.log(`[AdService] ShowAd event for ${operationId}: ${event.type}`);
        let newEvent: ShowAdEvent | null = null;

        switch (event.type) {
          case "requested": newEvent = { requested: {} }; break;
          case "clicked": newEvent = { clicked: {} }; break;
          case "impression": newEvent = { impression: {} }; break;
          case "show": newEvent = { show: {} }; break;
          case "userEarnedReward":
            newEvent = {
              user_earned_reward: {
                unit_type: event.data.unitType,
                unit_amount: event.data.unitAmount,
              },
            };
            break;
          case "dismissed":
            newEvent = { dismissed: {} };
            state.isFinished = true;
            break;
          case "failedToShow":
            newEvent = { failed_to_show: {} };
            state.isFinished = true;
            break;
        }
        if (newEvent) {
          state.events.push(newEvent);
        }
      },
      onError: (error) => {
        console.error(`[AdService] Error in ShowAd operation ${operationId}:`, error);
        const state = adOperationStore.get(operationId);
        if (state) {
          state.isFinished = true;
        }
      },
    });

    return { operation_id: operationId };
  }

  async PollShowAdEvents(request: PollShowAdEventsRequest): Promise<PollShowAdEventsResponse> {
    const state = adOperationStore.get(request.operation_id) as AdOperationState<ShowAdEvent>;

    if (!state) {
      console.warn(`[AdService] Polling for unknown ShowAd operation: ${request.operation_id}`);
      return { events: [], is_finished: true };
    }

    const eventsToReturn = [...state.events];
    state.events = []; // Clear queue

    if (state.isFinished) {
      adOperationStore.delete(request.operation_id);
      console.log(`[AdService] Finished and cleaned up ShowAd operation: ${request.operation_id}`);
    }

    return { events: eventsToReturn, is_finished: state.isFinished };
  }
}