using AIT.AIT_SDK.Bridge;
using Cysharp.Threading.Tasks;
using UnityEngine;

namespace AIT.AIT_SDK.Test
{
    public class AppsInTossAdExample : MonoBehaviour
    {
        public void ShowRewarded()
        {
            RunRewardedFlow().Forget();
        }

        public void ShowInterstitial()
        {
            RunInterstitialFlow().Forget();
        }

        async UniTaskVoid RunRewardedFlow()
        {
            var useCase = AppsInTossAdUseCase.Instance;
            if (useCase == null)
            {
                Debug.LogError("AppsInTossAdUseCase is missing in the scene.");
                return;
            }

            var result = await useCase.ShowRewardedAsync();
            if (result.IsRewardGranted)
            {
                Debug.Log("[AppsInTossAdExample] Grant player reward.");
            }
            else
            {
                Debug.LogWarning("[AppsInTossAdExample] Reward not granted.");
            }
        }

        async UniTaskVoid RunInterstitialFlow()
        {
            var useCase = AppsInTossAdUseCase.Instance;
            if (useCase == null)
            {
                Debug.LogError("AppsInTossAdUseCase is missing in the scene.");
                return;
            }

            var result = await useCase.ShowInterstitialAsync();
            Debug.Log($"[AppsInTossAdExample] Interstitial finished with {result.Status}");
        }
    }
}
