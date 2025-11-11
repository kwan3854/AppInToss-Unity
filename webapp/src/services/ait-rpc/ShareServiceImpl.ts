import {
  contactsViral,
  type RewardFromContactsViralEvent,
  type ContactsViralSuccessEvent,
} from '@apps-in-toss/web-framework';
import { ShareServiceBase } from '../../generated/ShareService/ait_share_ShareServiceBase';
import type {
  ShowContactsViralRequest,
  ShowContactsViralResponse,
  RewardEvent,
  CloseEvent,
} from '../../generated/ShareService/ShareService';

export class ShareServiceImpl extends ShareServiceBase {
  async ShowContactsViral(
    request: ShowContactsViralRequest,
  ): Promise<ShowContactsViralResponse> {
    const moduleId = request.module_id;
    if (!moduleId) {
      throw new Error('moduleId is required.');
    }

    return new Promise<ShowContactsViralResponse>((resolve, reject) => {
      try {
        const cleanup = contactsViral({
          options: { moduleId: moduleId.trim() },
          onEvent: (event: RewardFromContactsViralEvent | ContactsViralSuccessEvent) => {
            // As soon as we get the first event, we resolve the promise and clean up.
            cleanup();
            
            const response: ShowContactsViralResponse = {};

            if (event.type === 'sendViral') {
              const rewardEvent: RewardEvent = {
                reward_amount: event.data.rewardAmount,
                reward_unit: event.data.rewardUnit,
              };
              response.reward = rewardEvent;
              resolve(response);
            } else if (event.type === 'close') {
              const closeEvent: CloseEvent = {
                close_reason: event.data.closeReason,
                sent_rewards_count: event.data.sentRewardsCount,
                sent_reward_amount: event.data.sentRewardAmount,
                sendable_rewards_count: event.data.sendableRewardsCount,
                reward_unit: event.data.rewardUnit,
              };
              response.close = closeEvent;
              resolve(response);
            }
          },
          onError: (error: unknown) => {
            cleanup();
            reject(error);
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
