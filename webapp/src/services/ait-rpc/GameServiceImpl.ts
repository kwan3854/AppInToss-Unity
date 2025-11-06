import {
  GameServiceBase,
  GetUserKeyForGameRequest,
  GetUserKeyForGameResponse,
  GrantPromotionRewardRequest,
  GrantPromotionRewardResponse,
  OpenGameCenterLeaderboardRequest,
  OpenGameCenterLeaderboardResponse,
  SubmitGameCenterLeaderboardScoreRequest,
  SubmitGameCenterLeaderboardScoreResponse
} from '../../generated/GameService/ait_game_GameServiceBase';
import {
  getUserKeyForGame,
  grantPromotionRewardForGame,
  openGameCenterLeaderboard,
  submitGameCenterLeaderBoardScore
} from '@apps-in-toss/web-framework';

export class GameServiceImpl extends GameServiceBase {
  async getUserKeyForGame(request: GetUserKeyForGameRequest): Promise<GetUserKeyForGameResponse> {
    const result = await getUserKeyForGame();

    if (!result) {
      return {
        result: {
          oneofKind: 'error',
          error: {
            type: 'UNDEFINED_VERSION',
            message: '지원하지 않는 앱 버전이에요.'
          }
        }
      };
    }

    if (result === 'INVALID_CATEGORY') {
      return {
        result: {
          oneofKind: 'error',
          error: {
            type: 'INVALID_CATEGORY',
            message: '게임 카테고리가 아닌 미니앱이에요.'
          }
        }
      };
    }

    if (result === 'ERROR') {
      return {
        result: {
          oneofKind: 'error',
          error: {
            type: 'ERROR',
            message: '사용자 키 조회 중 오류가 발생했어요.'
          }
        }
      };
    }

    return {
      result: {
        oneofKind: 'success',
        success: {
          type: result.type,
          hash: result.hash
        }
      }
    };
  }

  async grantPromotionReward(request: GrantPromotionRewardRequest): Promise<GrantPromotionRewardResponse> {
    const result = await grantPromotionRewardForGame({
      params: {
        promotionCode: request.promotionCode,
        amount: request.amount
      }
    });

    if (!result) {
      return {
        result: {
          oneofKind: 'error',
          error: {
            errorCode: 'UNDEFINED_VERSION',
            message: '지원하지 않는 앱 버전이에요.'
          }
        }
      };
    }

    if (result === 'ERROR') {
      return {
        result: {
          oneofKind: 'error',
          error: {
            errorCode: 'UNKNOWN_ERROR',
            message: '포인트 지급 중 알 수 없는 오류가 발생했어요.'
          }
        }
      };
    }

    if ('key' in result) {
      return {
        result: {
          oneofKind: 'success',
          success: {
            key: result.key
          }
        }
      };
    }

    return {
      result: {
        oneofKind: 'error',
        error: {
          errorCode: result.errorCode,
          message: result.message
        }
      }
    };
  }

  async openGameCenterLeaderboard(request: OpenGameCenterLeaderboardRequest): Promise<OpenGameCenterLeaderboardResponse> {
    await openGameCenterLeaderboard();
    return {};
  }

  async submitGameCenterLeaderboardScore(request: SubmitGameCenterLeaderboardScoreRequest): Promise<SubmitGameCenterLeaderboardScoreResponse> {
    const result = await submitGameCenterLeaderBoardScore({ score: request.score });

    if (!result) {
      return { statusCode: 'UNDEFINED_VERSION' };
    }

    return { statusCode: result.statusCode };
  }
}
