using Ait.Game;
using Cysharp.Threading.Tasks;

namespace AIT.AIT_SDK.ExtensionMethods
{
    public static class GameServiceClientExtensions
    {
        public static UniTask<GetUserKeyForGameResponse> GetUserKeyForGame(this GameServiceClient client)
        {
            return client.GetUserKeyForGame(new GetUserKeyForGameRequest { Dummy = true });
        }

        public static UniTask<OpenGameCenterLeaderboardResponse> OpenGameCenterLeaderboard(this GameServiceClient client)
        {
            return client.OpenGameCenterLeaderboard(new OpenGameCenterLeaderboardRequest { Dummy = true });
        }
    }
}
