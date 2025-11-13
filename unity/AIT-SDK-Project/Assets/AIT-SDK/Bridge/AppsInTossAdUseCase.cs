using System;
using System.Threading;
using AIT.AIT_SDK.Config;
using AIT.AIT_SDK.ExtensionMethods;
using Ait;
using AitBridge.RPC;
using Cysharp.Threading.Tasks;
using UnityEngine;

namespace AIT.AIT_SDK.Bridge
{
    public enum AppsInTossAdPlacement
    {
        Interstitial,
        Rewarded
    }

    public enum AppsInTossAdStatus
    {
        Completed,
        FailedToShow,
        Cancelled
    }

    public readonly struct AppsInTossAdResult
    {
        public AppsInTossAdPlacement Placement { get; }
        public string AdGroupId { get; }
        public AppsInTossAdStatus Status { get; }
        public bool RewardEarned { get; }
        public bool IsSuccess => Status == AppsInTossAdStatus.Completed;
        public bool IsRewardGranted => RewardEarned && IsSuccess;

        public AppsInTossAdResult(AppsInTossAdPlacement placement, string adGroupId, AppsInTossAdStatus status, bool rewardEarned)
        {
            Placement = placement;
            AdGroupId = adGroupId;
            Status = status;
            RewardEarned = rewardEarned;
        }
    }

    /// <summary>
    /// Central ad use case that pauses gameplay/audio while AppsInToss ads play and looks up ad IDs from config.
    /// </summary>
    public sealed class AppsInTossAdUseCase : MonoBehaviour
    {
        public static AppsInTossAdUseCase Instance { get; private set; }

        [SerializeField] bool dontDestroyOnLoad = true;
        [SerializeField] AppsInTossMonetizationConfig monetizationConfig;

        CancellationTokenSource _activeAdCts;

        public bool IsAdPlaying => _activeAdCts != null;

        public event Action<AppsInTossAdPlacement> AdStarted;
        public event Action<AppsInTossAdResult> AdFinished;

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;

            if (dontDestroyOnLoad)
            {
                DontDestroyOnLoad(gameObject);
            }

            if (monetizationConfig == null)
            {
                Debug.LogError("[AppsInTossAdUseCase] Monetization config is not assigned.");
            }
        }

        public UniTask<AppsInTossAdResult> ShowInterstitialAsync(CancellationToken cancellationToken = default)
        {
            return ShowAdAsync(AppsInTossAdPlacement.Interstitial, cancellationToken);
        }

        public UniTask<AppsInTossAdResult> ShowRewardedAsync(CancellationToken cancellationToken = default)
        {
            return ShowAdAsync(AppsInTossAdPlacement.Rewarded, cancellationToken);
        }

        UniTask<AppsInTossAdResult> ShowAdAsync(AppsInTossAdPlacement placement, CancellationToken cancellationToken)
        {
            var adGroupId = ResolveAdGroupId(placement);
            if (string.IsNullOrWhiteSpace(adGroupId))
            {
                throw new InvalidOperationException($"Ad group ID is not configured for placement {placement}.");
            }
            if (AitRpcBridge.Instance == null || AitRpcBridge.Instance.AdService == null)
            {
                throw new InvalidOperationException("AdService is not ready.");
            }
            if (IsAdPlaying)
            {
                throw new InvalidOperationException("Another ad is currently being shown.");
            }

            var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            _activeAdCts = linkedCts;

            AdStarted?.Invoke(placement);
            return RunAdFlowAsync(placement, adGroupId, linkedCts);
        }

        string ResolveAdGroupId(AppsInTossAdPlacement placement)
        {
            if (monetizationConfig == null)
            {
                return string.Empty;
            }

            return placement switch
            {
                AppsInTossAdPlacement.Interstitial => monetizationConfig.InterstitialAdGroupId,
                AppsInTossAdPlacement.Rewarded => monetizationConfig.RewardedAdGroupId,
                _ => string.Empty,
            };
        }

        async UniTask<AppsInTossAdResult> RunAdFlowAsync(AppsInTossAdPlacement placement, string adGroupId, CancellationTokenSource cts)
        {
            var token = cts.Token;
            var adService = AitRpcBridge.Instance.AdService;
            var request = new ShowAdRequest { AdGroupId = adGroupId };
            var rewardEarned = false;
            var channels = ResolveAdPauseChannels();
            AppsInTossPlaybackPause.PauseHandle pauseHandle = null;

            try
            {
                pauseHandle = AppsInTossPlaybackPause.Acquire(channels, $"Ad:{placement}");

                await foreach (var ev in adService.ShowAdAsStream(request, token))
                {
                    if (ev.UserEarnedReward != null)
                    {
                        rewardEarned = true;
                    }

                    if (ev.Dismissed != null)
                    {
                        return Complete(placement, adGroupId, AppsInTossAdStatus.Completed, rewardEarned);
                    }

                    if (ev.FailedToShow != null)
                    {
                        return Complete(placement, adGroupId, AppsInTossAdStatus.FailedToShow, rewardEarned);
                    }
                }

                if (token.IsCancellationRequested)
                {
                    return Complete(placement, adGroupId, AppsInTossAdStatus.Cancelled, rewardEarned);
                }

                return Complete(placement, adGroupId, AppsInTossAdStatus.Completed, rewardEarned);
            }
            catch (OperationCanceledException)
            {
                return Complete(placement, adGroupId, AppsInTossAdStatus.Cancelled, rewardEarned);
            }
            catch (Exception ex)
            {
                Debug.LogError($"[AppsInTossAdUseCase] Failed to show ad {adGroupId}: {ex}");
                return Complete(placement, adGroupId, AppsInTossAdStatus.FailedToShow, rewardEarned);
            }
            finally
            {
                pauseHandle?.Dispose();

                cts.Dispose();
                if (_activeAdCts == cts)
                {
                    _activeAdCts = null;
                }
            }
        }

        AppsInTossAdResult Complete(AppsInTossAdPlacement placement, string adGroupId, AppsInTossAdStatus status, bool rewardEarned)
        {
            var result = new AppsInTossAdResult(placement, adGroupId, status, rewardEarned);
            AdFinished?.Invoke(result);
            return result;
        }

        AppsInTossPlaybackPause.PauseChannels ResolveAdPauseChannels()
        {
            var channels = AppsInTossPlaybackPause.PauseChannels.None;

            if (monetizationConfig == null)
            {
                return AppsInTossPlaybackPause.PauseChannels.All;
            }

            if (monetizationConfig.PauseTimeDuringAds)
            {
                channels |= AppsInTossPlaybackPause.PauseChannels.Time;
            }

            if (monetizationConfig.MuteAudioDuringAds)
            {
                channels |= AppsInTossPlaybackPause.PauseChannels.Audio;
            }

            return channels;
        }
    }
}
