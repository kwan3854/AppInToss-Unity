using System;
using Ait.Game;
using AitBridge.RPC;
using UnityEngine;
using UnityEngine.UI;

namespace AIT.AIT_SDK.Test
{
    public class GameServiceTester : MonoBehaviour
    {
        public Button getUserKeyButton;
        public Button grantRewardButton;
        public Button openLeaderboardButton;
        public Button submitScoreButton;
        public Text logText;

        private GameServiceClient _gameServiceClient;

        void Start()
        {
            // Get the RPC client instance
            _gameServiceClient = AitRpcBridge.Instance.GameService;

            // Add button listeners
            getUserKeyButton.onClick.AddListener(TestGetUserKey);
            grantRewardButton.onClick.AddListener(TestGrantReward);
            openLeaderboardButton.onClick.AddListener(TestOpenLeaderboard);
            submitScoreButton.onClick.AddListener(TestSubmitScore);
            
            Log("GameServiceTester ready.");
        }

        private async void TestGetUserKey()
        {
            Log("Calling GetUserKeyForGame...");
            try
            {
                var response = await _gameServiceClient.GetUserKeyForGame(new GetUserKeyForGameRequest());
                if (response.ResultCase == GetUserKeyForGameResponse.ResultOneofCase.Success)
                {
                    Log($"GetUserKeyForGame success: hash={response.Success.Hash}");
                }
                else
                {
                    Log($"GetUserKeyForGame error: type={response.Error.Type}, msg={response.Error.Message}");
                }
            }
            catch (Exception e)
            {
                Log($"GetUserKeyForGame exception: {e.Message}");
            }
        }

        private async void TestGrantReward()
        {
            Log("Calling GrantPromotionReward...");
            try
            {
                var request = new GrantPromotionRewardRequest
                {
                    PromotionCode = "GAME_EVENT_2024",
                    Amount = 1000
                };
                var response = await _gameServiceClient.GrantPromotionReward(request);
                if (response.ResultCase == GrantPromotionRewardResponse.ResultOneofCase.Success)
                {
                    Log($"GrantPromotionReward success: key={response.Success.Key}");
                }
                else
                {
                    Log($"GrantPromotionReward error: code={response.Error.ErrorCode}, msg={response.Error.Message}");
                }
            }
            catch (Exception e)
            {
                Log($"GrantPromotionReward exception: {e.Message}");
            }
        }

        private async void TestOpenLeaderboard()
        {
            Log("Calling OpenGameCenterLeaderboard...");
            try
            {
                await _gameServiceClient.OpenGameCenterLeaderboard(new OpenGameCenterLeaderboardRequest());
                Log("OpenGameCenterLeaderboard success.");
            }
            catch (Exception e)
            {
                Log($"OpenGameCenterLeaderboard exception: {e.Message}");
            }
        }

        private async void TestSubmitScore()
        {
            Log("Calling SubmitGameCenterLeaderboardScore...");
            try
            {
                var request = new SubmitGameCenterLeaderboardScoreRequest
                {
                    Score = "123.45"
                };
                var response = await _gameServiceClient.SubmitGameCenterLeaderboardScore(request);
                Log($"SubmitGameCenterLeaderboardScore success: statusCode={response.StatusCode}");
            }
            catch (Exception e)
            {
                Log($"SubmitGameCenterLeaderboardScore exception: {e.Message}");
            }
        }

        private void Log(string message)
        {
            Debug.Log($"[GameServiceTester] {message}");
            if (logText != null)
            {
                logText.text += $"> {message}\n";
            }
        }
    }
}