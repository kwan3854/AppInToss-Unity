import {
  GameServiceBase,
} from '../../generated/GameService/ait_game_GameServiceBase';
import type {
  GetUserKeyForGameResponse,
  GrantPromotionRewardRequest,
  GrantPromotionRewardResponse,
  OpenGameCenterLeaderboardResponse,
  SubmitGameCenterLeaderboardScoreRequest,
  SubmitGameCenterLeaderboardScoreResponse
} from '../../generated/GameService/GameService';
import {
  getUserKeyForGame,
  grantPromotionRewardForGame,
  openGameCenterLeaderboard,
  submitGameCenterLeaderBoardScore
} from '@apps-in-toss/web-framework';

export class GameServiceImpl extends GameServiceBase {
  async GetUserKeyForGame(): Promise<GetUserKeyForGameResponse> {
    const result = await getUserKeyForGame();

    if (!result) {
      return {
        error: {
          type: 'UNDEFINED_VERSION',
          message: '지원하지 않는 앱 버전이에요.'
        }
      };
    }

    if (result === 'INVALID_CATEGORY') {
      return {
        error: {
          type: 'INVALID_CATEGORY',
          message: '게임 카테고리가 아닌 미니앱이에요.'
        }
      };
    }

    if (result === 'ERROR') {
      return {
        error: {
          type: 'ERROR',
          message: '사용자 키 조회 중 오류가 발생했어요.'
        }
      };
    }

    return {
      success: {
        type: result.type,
        hash: result.hash
      }
    };
  }

  async GrantPromotionReward(request: GrantPromotionRewardRequest): Promise<GrantPromotionRewardResponse> {
    if (request.promotion_code === undefined || request.amount === undefined) {
      return {
        error: {
          error_code: 'INVALID_ARGUMENT',
          message: 'promotion_code and amount are required.'
        }
      };
    }

    const result = await grantPromotionRewardForGame({
      params: {
        promotionCode: request.promotion_code,
        amount: request.amount
      }
    });

    if (!result) {
      return {
        error: {
          error_code: 'UNDEFINED_VERSION',
          message: '지원하지 않는 앱 버전이에요.'
        }
      };
    }

    if (result === 'ERROR') {
      return {
        error: {
          error_code: 'UNKNOWN_ERROR',
          message: '포인트 지급 중 알 수 없는 오류가 발생했어요.'
        }
      };
    }

    if ('key' in result) {
      return {
        success: {
          key: result.key
        }
      };
    }

    return {
      error: {
        error_code: result.errorCode,
        message: result.message
      }
    };
  }

  async OpenGameCenterLeaderboard(): Promise<OpenGameCenterLeaderboardResponse> {
    await openGameCenterLeaderboard();
    return {};
  }

  async SubmitGameCenterLeaderboardScore(request: SubmitGameCenterLeaderboardScoreRequest): Promise<SubmitGameCenterLeaderboardScoreResponse> {
    if (request.score === undefined) {
      return { status_code: 'INVALID_ARGUMENT' };
    }
    const result = await submitGameCenterLeaderBoardScore({ score: request.score });

    if (!result) {
      return { status_code: 'UNDEFINED_VERSION' };
    }

    return { status_code: result.statusCode };
  }
}