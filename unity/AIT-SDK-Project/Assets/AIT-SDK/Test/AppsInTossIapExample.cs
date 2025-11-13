using System.Collections.Generic;
using AIT.AIT_SDK.Bridge;
using Ait.Iap;
using Cysharp.Threading.Tasks;
using UnityEngine;

namespace AIT.AIT_SDK.Test
{
    public class AppsInTossIapExample : MonoBehaviour
    {
        [SerializeField] string featuredSpotId = "remove_ads_button";

        public async void RefreshStore()
        {
            var iap = AppsInTossIapUseCase.Instance;
            if (iap == null)
            {
                Debug.LogError("AppsInTossIapUseCase is missing in the scene.");
                return;
            }

            var catalog = await iap.GetRemoteCatalogAsync();
            RenderStore(catalog);
        }

        public async void BuyFeaturedSpot()
        {
            var iap = AppsInTossIapUseCase.Instance;
            if (iap == null)
            {
                Debug.LogError("AppsInTossIapUseCase is missing in the scene.");
                return;
            }

            var curated = await iap.GetCuratedProductAsync(featuredSpotId);
            if (curated == null)
            {
                Debug.LogWarning($"[AppsInTossIapExample] Curated spot {featuredSpotId} is not available.");
                return;
            }

            var result = await iap.PurchaseCuratedSpotAsync(featuredSpotId);
            Debug.Log($"[AppsInTossIapExample] Purchase {result.Sku} finished with {result.Status}");
        }

        void RenderStore(IReadOnlyList<IapProductListItem> catalog)
        {
            foreach (var item in catalog)
            {
                Debug.Log($"[AppsInTossIapExample] Store item {item.DisplayName} - {item.DisplayAmount}");
            }
        }
    }
}
