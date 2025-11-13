using System;
using System.Collections.Generic;
using UnityEngine;

namespace AIT.AIT_SDK.Config
{
    /// <summary>
    /// Centralizes ad-group IDs and curated IAP placements so designers can describe how
    /// each Toss SKU should look/behave in the client without duplicating SKUs everywhere.
    /// </summary>
    [CreateAssetMenu(menuName = "AIT/AppsInToss Monetization Config", fileName = "AppsInTossMonetizationConfig")]
    public class AppsInTossMonetizationConfig : ScriptableObject
    {
        [Header("Ad Group IDs")]
        [Tooltip("Toss adGroupId that should be used for every interstitial placement in-game.")]
        [SerializeField] string interstitialAdGroupId = "interstitial.default";

        [Tooltip("Toss adGroupId that should be used for every rewarded placement in-game.")]
        [SerializeField] string rewardedAdGroupId = "rewarded.default";

        [Header("Curated IAP Spots")]
        [Tooltip("Per-placement overrides for how each Toss SKU should be presented in the UI.")]
        [SerializeField] List<CuratedIapSpot> curatedIapSpots = new();

        [Header("Playback Behavior")]
        [Tooltip("If enabled, gameplay Time.timeScale is paused whenever an AppsInToss ad is playing.")]
        [SerializeField] bool pauseTimeDuringAds = true;

        [Tooltip("If enabled, AudioListener.pause is enabled whenever an AppsInToss ad is playing.")]
        [SerializeField] bool muteAudioDuringAds = true;

        [Tooltip("If enabled, gameplay Time.timeScale pauses whenever the host WebView becomes hidden (home button, lock screen).")]
        [SerializeField] bool pauseTimeWhenHostHidden = true;

        [Tooltip("If enabled, AudioListener.pause is enabled whenever the host WebView becomes hidden.")]
        [SerializeField] bool muteAudioWhenHostHidden = true;

        public string InterstitialAdGroupId => interstitialAdGroupId;
        public string RewardedAdGroupId => rewardedAdGroupId;
        public IReadOnlyList<CuratedIapSpot> CuratedIapSpots => curatedIapSpots;
        public bool PauseTimeDuringAds => pauseTimeDuringAds;
        public bool MuteAudioDuringAds => muteAudioDuringAds;
        public bool PauseTimeWhenHostHidden => pauseTimeWhenHostHidden;
        public bool MuteAudioWhenHostHidden => muteAudioWhenHostHidden;

        public bool TryGetCuratedSpot(string spotId, out CuratedIapSpot spot)
        {
            spot = curatedIapSpots.Find(s => s.SpotId == spotId);
            return spot != null;
        }

        /// <summary>
        /// Enumerates every SKU referenced by curated spots so callers can prefetch/validate quickly.
        /// </summary>
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
            [Tooltip("Local identifier used by UI scripts (e.g., \"remove_ads_button\"). Never shown to players.")]
            [SerializeField] string spotId;

            [Tooltip("Toss SKU (productId) this placement should trigger when purchased.")]
            [SerializeField] string productId;

            [Tooltip("Optional sprite baked into the client. Leave empty to rely on Toss' icon URL.")]
            [SerializeField] Sprite icon;

            [Tooltip("Display name override shown in the UI instead of Toss' display_name.")]
            [SerializeField] string titleOverride;

            [Tooltip("Secondary line of text (\"Remove ads forever\", \"Best value\", etc.).")]
            [SerializeField] string subtitle;

            [Tooltip("Button label override (\"Unlock\", \"Recharge now\"). Blank = default CTA.")]
            [SerializeField] string callToActionOverride;

            [Tooltip("Optional accent color for cards/badges that feature this spot.")]
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
