import {
  CloseEvent,
  ErrorEvent,
  RewardEvent,
  ShareService,
  ShowContactsViralRequest,
  ShowContactsViralResponse,
} from '../../generated/ShareService/ait_share_ShareServiceBase';
import { contactsViral } from '@apps-in-toss/web-framework';
import { RpcError } from 'app-webview-rpc';

export class ShareServiceImpl extends ShareService {
  async *showContactsViral(
    request: ShowContactsViralRequest,
  ): AsyncGenerator<ShowContactsViralResponse, any, undefined> {
    const moduleId = request.getModuleId();
    if (!moduleId) {
      throw new RpcError('moduleId is required.');
    }

    // Bridge the callback-based API to an async generator
    const eventQueue: any[] = [];
    let resolveNextEvent: ((event?: any) => void) | null = null;
    let isClosed = false;

    const cleanup = contactsViral({
      options: { moduleId: moduleId.trim() },
      onEvent: (event) => {
        if (resolveNextEvent) {
          resolveNextEvent(event);
          resolveNextEvent = null;
        } else {
          eventQueue.push(event);
        }
        if (event.type === 'close') {
          isClosed = true;
        }
      },
      onError: (error) => {
        const errEvent = { type: 'error', data: error };
        if (resolveNextEvent) {
          resolveNextEvent(errEvent);
          resolveNextEvent = null;
        } else {
          eventQueue.push(errEvent);
        }
        isClosed = true;
      },
    });

    try {
      while (!isClosed) {
        let event;
        if (eventQueue.length > 0) {
          event = eventQueue.shift();
        } else {
          const nextEventPromise = new Promise((resolve) => {
            resolveNextEvent = resolve;
          });
          event = await nextEventPromise;
        }

        const response = new ShowContactsViralResponse();

        if (event.type === 'sendViral') {
          const rewardEvent = new RewardEvent();
          rewardEvent.setRewardAmount(event.data.rewardAmount);
          rewardEvent.setRewardUnit(event.data.rewardUnit);
          response.setReward(rewardEvent);
          yield response;
        } else if (event.type === 'close') {
          const closeEvent = new CloseEvent();
          closeEvent.setCloseReason(event.data.closeReason);
          closeEvent.setSentRewardsCount(event.data.sentRewardsCount);
          if (event.data.sentRewardAmount !== undefined) {
            closeEvent.setSentRewardAmount(event.data.sentRewardAmount);
          }
          if (event.data.sendableRewardsCount !== undefined) {
            closeEvent.setSendableRewardsCount(event.data.sendableRewardsCount);
          }
          if (event.data.rewardUnit !== undefined) {
            closeEvent.setRewardUnit(event.data.rewardUnit);
          }
          response.setClose(closeEvent);
          yield response;
        } else if (event.type === 'error') {
          const errorEvent = new ErrorEvent();
          const errorMessage = error instanceof Error ? error.message : String(error);
          errorEvent.setMessage(errorMessage);
          response.setError(errorEvent);
          yield response;
        }
      }
    } finally {
      // Ensure the cleanup function is called when the generator is terminated.
      cleanup();
      console.log('[ShareService] contactsViral cleanup called.');
    }
  }
}
