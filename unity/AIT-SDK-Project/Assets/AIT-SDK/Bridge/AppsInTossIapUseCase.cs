using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using AIT.AIT_SDK.Config;
using Ait.Iap;
using AitBridge.RPC;
using Cysharp.Threading.Tasks;
using UnityEngine;

namespace AIT.AIT_SDK.Bridge
{
    public enum AppsInTossPurchaseStatus
    {
        Success,
        Failed,
        Cancelled
    }

    public readonly struct AppsInTossPurchaseResult
    {
        public string Sku { get; }
        public AppsInTossPurchaseStatus Status { get; }
        public PurchaseSuccessEvent SuccessEvent { get; }
        public PurchaseErrorEvent ErrorEvent { get; }
        public bool IsSuccess => Status == AppsInTossPurchaseStatus.Success;

        public AppsInTossPurchaseResult(string sku, AppsInTossPurchaseStatus status, PurchaseSuccessEvent successEvent, PurchaseErrorEvent errorEvent)
        {
            Sku = sku;
            Status = status;
            SuccessEvent = successEvent;
            ErrorEvent = errorEvent;
        }
    }

    public readonly struct AppsInTossCuratedProduct
    {
        public AppsInTossMonetizationConfig.CuratedIapSpot Spot { get; }
        public IapProductListItem RemoteProduct { get; }

        public string SpotId => Spot?.SpotId;
        public string ProductId => RemoteProduct?.Sku;

        public AppsInTossCuratedProduct(AppsInTossMonetizationConfig.CuratedIapSpot spot, IapProductListItem remoteProduct)
        {
            Spot = spot;
            RemoteProduct = remoteProduct;
        }
    }

    /// <summary>
    /// Central IAP use case that merges the Toss remote catalog with curated placements defined in the monetization config.
    /// </summary>
    public sealed class AppsInTossIapUseCase : MonoBehaviour
    {
        public static AppsInTossIapUseCase Instance { get; private set; }

        [SerializeField] bool dontDestroyOnLoad = true;
        [SerializeField] AppsInTossMonetizationConfig monetizationConfig;
        [SerializeField, Min(5f)] float catalogTtlSeconds = 120f;
        [SerializeField] bool preloadCatalogOnStart = true;

        readonly List<IapProductListItem> _catalog = new();
        float _catalogFetchedAt = -999f;

        public event Action<IReadOnlyList<IapProductListItem>> CatalogUpdated;
        public event Action<AppsInTossPurchaseResult> PurchaseCompleted;

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
                Debug.LogError("[AppsInTossIapUseCase] Monetization config is not assigned.");
            }
        }

        async void Start()
        {
            if (!preloadCatalogOnStart)
            {
                return;
            }

            try
            {
                await EnsureCatalogAsync(false, this.GetCancellationTokenOnDestroy());
            }
            catch (OperationCanceledException)
            {
                // Ignore on exit.
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[AppsInTossIapUseCase] Failed to preload catalog: {ex}");
            }
        }

        public UniTask<IReadOnlyList<IapProductListItem>> GetRemoteCatalogAsync(bool forceRefresh = false, CancellationToken cancellationToken = default)
        {
            return EnsureCatalogAsync(forceRefresh, cancellationToken);
        }

        public async UniTask<AppsInTossCuratedProduct?> GetCuratedProductAsync(string spotId, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(spotId))
            {
                throw new ArgumentException("spotId is required.", nameof(spotId));
            }

            if (monetizationConfig == null || !monetizationConfig.TryGetCuratedSpot(spotId, out var spot) || spot == null || string.IsNullOrWhiteSpace(spot.ProductId))
            {
                return null;
            }

            var catalog = await EnsureCatalogAsync(false, cancellationToken);
            var remoteProduct = catalog.FirstOrDefault(p => p.Sku == spot.ProductId);
            if (remoteProduct == null)
            {
                return null;
            }

            return new AppsInTossCuratedProduct(spot, remoteProduct);
        }

        public UniTask<AppsInTossPurchaseResult> PurchaseCuratedSpotAsync(string spotId, CancellationToken cancellationToken = default)
        {
            if (monetizationConfig == null || !monetizationConfig.TryGetCuratedSpot(spotId, out var spot) || spot == null)
            {
                throw new InvalidOperationException($"Unknown curated spot: {spotId}");
            }

            if (string.IsNullOrWhiteSpace(spot.ProductId))
            {
                throw new InvalidOperationException($"Curated spot {spotId} does not map to a Toss SKU.");
            }

            return PurchaseSkuAsync(spot.ProductId, cancellationToken);
        }

        public UniTask<AppsInTossPurchaseResult> PurchaseSkuAsync(string sku, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(sku))
            {
                throw new ArgumentException("sku is required.", nameof(sku));
            }
            if (AitRpcBridge.Instance == null || AitRpcBridge.Instance.IapService == null)
            {
                throw new InvalidOperationException("IapService is not ready.");
            }

            return RunPurchaseFlowAsync(sku, cancellationToken);
        }

        async UniTask<IReadOnlyList<IapProductListItem>> EnsureCatalogAsync(bool forceRefresh, CancellationToken cancellationToken)
        {
            var timeSinceFetch = Time.realtimeSinceStartup - _catalogFetchedAt;
            if (!forceRefresh && _catalog.Count > 0 && timeSinceFetch < catalogTtlSeconds)
            {
                return _catalog;
            }

            if (AitRpcBridge.Instance == null || AitRpcBridge.Instance.IapService == null)
            {
                throw new InvalidOperationException("IapService is not ready.");
            }

            var response = await AitRpcBridge.Instance.IapService
                .GetProductItemList(new GetProductItemListRequest())
                .AttachExternalCancellation(cancellationToken);

            _catalog.Clear();
            _catalog.AddRange(response.Products);
            _catalogFetchedAt = Time.realtimeSinceStartup;
            CatalogUpdated?.Invoke(_catalog);
            return _catalog;
        }

        async UniTask<AppsInTossPurchaseResult> RunPurchaseFlowAsync(string sku, CancellationToken cancellationToken)
        {
            var iapService = AitRpcBridge.Instance.IapService;

            try
            {
                var createResponse = await iapService
                    .CreateOneTimePurchaseOrder(new CreateOneTimePurchaseOrderRequest { Sku = sku })
                    .AttachExternalCancellation(cancellationToken);

                if (string.IsNullOrWhiteSpace(createResponse.OperationId))
                {
                    throw new InvalidOperationException("CreateOneTimePurchaseOrder returned an empty operation_id.");
                }

                var pollRequest = new PollPurchaseEventsRequest { OperationId = createResponse.OperationId };

                while (true)
                {
                    var pollResponse = await iapService
                        .PollPurchaseEvents(pollRequest)
                        .AttachExternalCancellation(cancellationToken);

                    foreach (var ev in pollResponse.Events)
                    {
                        if (ev.Success != null)
                        {
                            return CompletePurchase(new AppsInTossPurchaseResult(sku, AppsInTossPurchaseStatus.Success, ev.Success, null));
                        }

                        if (ev.Error != null)
                        {
                            return CompletePurchase(new AppsInTossPurchaseResult(sku, AppsInTossPurchaseStatus.Failed, null, ev.Error));
                        }
                    }

                    if (pollResponse.IsFinished)
                    {
                        return CompletePurchase(new AppsInTossPurchaseResult(
                            sku,
                            AppsInTossPurchaseStatus.Failed,
                            null,
                            new PurchaseErrorEvent { ErrorCode = "EMPTY_RESULT", ErrorMessage = "Purchase finished without success event." }));
                    }

                    await UniTask.Delay(TimeSpan.FromMilliseconds(500), cancellationToken: cancellationToken);
                }
            }
            catch (OperationCanceledException)
            {
                return CompletePurchase(new AppsInTossPurchaseResult(sku, AppsInTossPurchaseStatus.Cancelled, null, null));
            }
            catch (Exception ex)
            {
                Debug.LogError($"[AppsInTossIapUseCase] Purchase failed for {sku}: {ex}");
                return CompletePurchase(new AppsInTossPurchaseResult(
                    sku,
                    AppsInTossPurchaseStatus.Failed,
                    null,
                    new PurchaseErrorEvent { ErrorCode = "EXCEPTION", ErrorMessage = ex.Message }));
            }
        }

        AppsInTossPurchaseResult CompletePurchase(AppsInTossPurchaseResult result)
        {
            PurchaseCompleted?.Invoke(result);
            return result;
        }
    }
}
