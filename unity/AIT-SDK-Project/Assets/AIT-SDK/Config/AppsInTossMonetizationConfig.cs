using System;
using System.Collections.Generic;
using UnityEngine;

namespace AIT.AIT_SDK.Config
{
    [CreateAssetMenu(menuName = "AIT/AppsInToss Monetization Config", fileName = "AppsInTossMonetizationConfig")]
    public class AppsInTossMonetizationConfig : ScriptableObject
    {
        [Header("Ad Group IDs")]
        [SerializeField] string interstitialAdGroupId = "interstitial.default";
        [SerializeField] string rewardedAdGroupId = "rewarded.default";

        [Header("Curated IAP Spots")]
        [SerializeField] List<CuratedIapSpot> curatedIapSpots = new();

        public string InterstitialAdGroupId => interstitialAdGroupId;
        public string RewardedAdGroupId => rewardedAdGroupId;
        public IReadOnlyList<CuratedIapSpot> CuratedIapSpots => curatedIapSpots;

        public bool TryGetCuratedSpot(string spotId, out CuratedIapSpot spot)
        {
            spot = curatedIapSpots.Find(s => s.SpotId == spotId);
            return spot != null;
        }

        public IEnumerable<string> EnumerateProductIds()
        {
            foreach (var spot in curatedIapSpots)
            {
                if (!string.IsNullOrWhiteSpace(spot.ProductId))
                {
                    yield return spot.ProductId;
                }
            }
        }

        [Serializable]
        public class CuratedIapSpot
        {
            [SerializeField] string spotId;
            [SerializeField] string productId;
            [SerializeField] Sprite icon;
            [SerializeField] string titleOverride;
            [SerializeField] string subtitle;
            [SerializeField] string callToActionOverride;
            [SerializeField] Color highlightColor = Color.white;

            public string SpotId => spotId;
            public string ProductId => productId;
            public Sprite Icon => icon;
            public string TitleOverride => titleOverride;
            public string Subtitle => subtitle;
            public string CallToActionOverride => callToActionOverride;
            public Color HighlightColor => highlightColor;
        }
    }
}
