# AIT Unity SDK (Toss 연동 템플릿)

[![GitHub Actions Status](https://github.com/kwanjoong/AppInToss-Unity/actions/workflows/generate-protobuf.yml/badge.svg)](https://github.com/kwanjoong/AppInToss-Unity/actions/workflows/generate-protobuf.yml)

## 📌 개요

이 프로젝트는 Unity WebGL 빌드를 토스 앱 내 웹뷰에서 실행되는 React 웹앱에 통합하기 위한 템플릿 및 가이드입니다. `app-webview-rpc`를 기반으로 Protobuf를 사용하여 Unity(C#)와 React(TypeScript) 간의 타입-세이프(type-safe)한 양방향 통신을 구현하는 방법을 제시합니다.

이 저장소는 별도의 npm 패키지로 제공될 계획은 없으며, 전체를 클론하여 사용하거나 필요한 부분을 참고하여 사용하는 것을 권장합니다.

## ✨ 주요 기술

- **Unity (C#)**: 게임 클라이언트
- **React (TypeScript)**: 웹 프론트엔드 및 토스 앱 브릿지 연동
- **Protobuf**: Unity-React 간 통신을 위한 스키마 정의
- **WebView-RPC**: Protobuf 기반의 RPC 프레임워크
- **GitHub Actions**: Protobuf 파일 변경 시 C# 및 TypeScript 코드를 자동 생성

## 🚀 시작하기

### 1. 웹앱 설정 (React)

1.  **프로젝트 가져오기**
    이 저장소 전체를 클론하거나, `webapp` 서브 폴더만 복사하여 기존 React 프로젝트에 통합할 수 있습니다.

    ```bash
    # webapp 폴더로 이동
    cd webapp
    # 의존성 설치
    npm install
    ```

2.  **설정 파일 수정**
    `webapp/granite.config.ts` 파일을 열어 자신의 토스 앱 설정에 맞게 `appId`, `displayName` 등을 수정합니다.

3.  **[선택] UI 커스터마이징**
    필요에 따라 `webapp/src/App.tsx` 파일을 수정하여 원하는 UI와 기능을 구성할 수 있습니다.

4.  **Unity 빌드 결과물 연동**
    -   Unity에서 WebGL 빌드를 완료합니다.
    -   빌드 결과물 4개 (`.data`, `.framework`, `.loader`, `.wasm`) 파일을 `webapp/public/assets/` 폴더에 복사합니다.
    -   `webapp/src/App.tsx` 파일 내에서 Unity 빌드 파일명이 올바르게 지정되었는지 확인하고, 다를 경우 수정합니다.

### 2. Unity SDK 설정

1.  **NuGetForUnity 설치**
    Unity 프로젝트에서 `GlitchEnzo/NuGetForUnity`를 Unity Package Manager를 통해 설치합니다.
    -   Package Manager > "Add package from git URL..." 선택
    -   `https://github.com/GlitchEnzo/NuGetForUnity.git?path=/src` 입력

2.  **Google.Protobuf 설치**
    -   NuGetForUnity 설치 후 상단 메뉴 `NuGet` > `Manage NuGet Packages`를 엽니다.
    -   `Google.Protobuf`를 검색하여 최신 버전을 설치합니다.

3.  **AIT-SDK 패키지 설치**
    -   `OpenUPM-CLI`가 설치되어 있어야 합니다. (`npm install -g openupm-cli`)
    -   프로젝트 루트에서 다음 명령어를 실행합니다. (의존성을 자동으로 해결해줍니다.)
    ```bash
    openupm add com.kwanjoong.ait-sdk
    ```

4.  **AitSdkBridge 설정**
    -   Unity의 시작 씬(Scene)의 최상위(root)에 `AitSdkBridge`라는 이름으로 빈 게임 오브젝트를 생성합니다. (이름이 정확해야 합니다.)
    -   생성된 게임 오브젝트에 `AitRpcBridge` 컴포넌트를 부착합니다.
    -   이 오브젝트는 게임 시작 시 자동으로 `DontDestroyOnLoad`로 전환되어 게임 세션 동안 RPC 통신을 관리합니다.

## 📚 SDK 사용법

모든 RPC 서비스는 `AitRpcBridge` 싱글톤을 통해 접근할 수 있습니다.

```csharp
// AitRpcBridge는 싱글톤 인스턴스를 제공합니다.
var iapService = AitRpcBridge.Instance.IapService;
var adService = AitRpcBridge.Instance.AdService;
// ...etc
```

### DeviceService (기기 정보)

**Safe Area (안전 영역) 적용**

`SafeAreaManager`가 게임 시작 시 자동으로 기기의 Safe Area 값을 가져와 캐싱합니다. 실제 UI에 적용하려면, Safe Area를 적용할 UI Panel 게임 오브젝트에 `SafeAreaPanel` 컴포넌트를 부착하기만 하면 됩니다.

1.  **매니저 설정**: 시작 씬의 `AitSdkBridge` 또는 다른 매니저 오브젝트에 `SafeAreaManager` 컴포넌트를 부착합니다.
2.  **패널 적용**: 안전 영역을 적용할 모든 UI Panel에 `SafeAreaPanel` 컴포넌트를 부착합니다.

### StorageService (영구 저장소)

토스 앱 내에서 Key-Value 기반으로 데이터를 영구적으로 저장하고 불러옵니다.

```csharp
using AitBridge.RPC;
using AIT.AIT_SDK.ExtensionMethods; // 확장 메서드 using 필수!
using Cysharp.Threading.Tasks;

// 데이터 저장
await AitRpcBridge.Instance.StorageService.SetItem(new () { Key = "BestScore", Value = "100" });

// 데이터 불러오기
var response = await AitRpcBridge.Instance.StorageService.GetItem(new () { Key = "BestScore" });
string score = response.Value; // "100"

// 데이터 삭제
await AitRpcBridge.Instance.StorageService.RemoveItem(new () { Key = "BestScore" });

// 전체 데이터 삭제
await AitRpcBridge.Instance.StorageService.ClearItems();
```

### IAPService (인앱 결제)

`CreateOrderAsStream` 확장 메서드를 통해 결제 과정을 `await foreach`로 간결하게 처리할 수 있습니다.

```csharp
using Ait.Iap;
using AitBridge.RPC;
using AIT.AIT_SDK.ExtensionMethods; // 확장 메서드 using 필수!
using Cysharp.Threading.Tasks;

public class IapTest : MonoBehaviour
{
    public async UniTask TestPurchase(string sku)
    {
        var request = new CreateOneTimePurchaseOrderRequest { Sku = sku };

        try
        {
            await foreach (var ev in AitRpcBridge.Instance.IapService.CreateOrderAsStream(request))
            {
                switch (ev.EventCase)
                {
                    case PurchaseEvent.EventOneofCase.Success:
                        Debug.Log($"Purchase Success! Order ID: {ev.Success.OrderId}");
                        // 여기서 게임 아이템 지급 처리
                        break;
                    
                    case PurchaseEvent.EventOneofCase.Error:
                        Debug.LogError($"Purchase Error! Code: {ev.Error.ErrorCode}, Msg: {ev.Error.ErrorMessage}");
                        break;
                }
            }
            Debug.Log("Purchase flow finished.");
        }
        catch (Exception e)
        {
            Debug.LogError($"Purchase stream failed: {e.Message}");
        }
    }
}
```

### AdService (광고)

광고 로드 및 표시 과정을 `...AsStream` 확장 메서드를 통해 이벤트 스트림으로 받을 수 있습니다.

```csharp
using Ait.Ad;
using AitBridge.RPC;
using AIT.AIT_SDK.ExtensionMethods; // 확장 메서드 using 필수!
using Cysharp.Threading.Tasks;

public class AdTest : MonoBehaviour
{
    public async UniTask TestShowAd(string adGroupId)
    {
        var request = new ShowAdRequest { AdGroupId = adGroupId };

        try
        {
            await foreach (var ev in AitRpcBridge.Instance.AdService.ShowAdAsStream(request))
            {
                switch (ev.EventCase)
                {
                    case ShowAdEvent.EventOneofCase.UserEarnedReward:
                        Debug.Log($"User Earned Reward! Type: {ev.UserEarnedReward.UnitType}, Amount: {ev.UserEarnedReward.UnitAmount}");
                        // 리워드 지급 로직
                        break;

                    case ShowAdEvent.EventOneofCase.Dismissed:
                        Debug.Log("Ad was dismissed.");
                        break;

                    case ShowAdEvent.EventOneofCase.FailedToShow:
                        Debug.Log("Ad failed to show.");
                        break;
                }
            }
            Debug.Log("Ad flow finished.");
        }
        catch (Exception e)
        {
            Debug.LogError($"ShowAdAsStream failed: {e.Message}");
        }
    }
}
```

## 💰 수익화 구성 (Ads & IAP)

### 1. AppsInTossMonetizationConfig (ScriptableObject)

`Assets/AppsInTossMonetizationConfig.asset`은 광고 그룹 ID와 커스텀 IAP 노출을 한 곳에서 관리하는 중앙 설정입니다.

- **Ad Group IDs**
  - `Interstitial Ad Group Id`: 모든 중간 광고가 사용할 Toss `adGroupId`.
  - `Rewarded Ad Group Id`: 모든 보상형 광고의 `adGroupId`.
- **Curated IAP Spots** (Spot 리스트는 원하는 만큼 추가 가능)
  - `Spot ID`: 게임 코드가 참조하는 로컬 식별자 (`remove_ads_button`, `gem_shop_featured` 등).
  - `Product ID`: Toss 대시보드에서 발급 받은 SKU. 결제 요청 시 이 값이 전달됩니다.
  - `Icon`: Toss에서 내려주는 이미지 대신 클라이언트가 쓰고 싶은 스프라이트.
  - `Title Override`: 노출명 커스터마이징 (미입력 시 Toss `display_name` 사용).
  - `Subtitle`: 보조 설명(“광고 제거”, “베스트 밸류” 등).
  - `Call To Action Override`: 버튼 라벨 지정 (“구매”, “충전하기” 등).
  - `Highlight Color`: 카드/뱃지에 사용할 포인트 색상.
- **Playback Behavior Toggles**
  - `Pause Time During Ads`, `Mute Audio During Ads`: 광고 재생 동안 `Time.timeScale`과 오디오를 어떻게 처리할지 선택.
  - `Pause Time When Host Hidden`, `Mute Audio When Host Hidden`: 사용자가 홈 버튼·잠금 등으로 WebView 화면을 벗어났을 때의 처리.

### 2. AppsInTossAdUseCase (통합 광고 진입점)

```csharp
var adResult = await AppsInTossAdUseCase.Instance.ShowRewardedAsync();
if (adResult.IsRewardGranted)
{
    GrantRewardToPlayer();
}
```

- `ShowInterstitialAsync`, `ShowRewardedAsync` 두 메서드만 노출됩니다.
- 어떤 `adGroupId`를 쓸지, 광고 중에 시간을 멈출지/음소거할지는 ScriptableObject 설정을 그대로 따릅니다.
- 내부적으로 `AppsInTossPlaybackPause`를 사용해 `Time.timeScale`과 `AudioListener.pause`를 안전하게 참조 카운트 방식으로 관리하므로, 다른 시스템과 충돌하지 않습니다.

### 3. AppsInTossIapUseCase (리모트 카탈로그 + 커스텀 노출)

```csharp
// 1) 상점 전체 목록 (리모트 카탈로그)
var catalog = await AppsInTossIapUseCase.Instance.GetRemoteCatalogAsync();

// 2) 특정 Spot (예: remove_ads 버튼)
var curated = await AppsInTossIapUseCase.Instance.GetCuratedProductAsync("remove_ads_button");
if (curated != null)
{
    RenderCustomCard(curated.Value);
}

// 3) 구매
var result = await AppsInTossIapUseCase.Instance.PurchaseCuratedSpotAsync("remove_ads_button");
```

- **리모트 카탈로그**: Toss에서 내려주는 상품 리스트/이미지/가격을 그대로 UI에 뿌릴 때 사용합니다.
- **Curated Spot**: 특정 UI 위치(예: 홈 화면 광고 제거 버튼)에 대해, 현지화·강조 색상 등을 커스터마이징하면서도 실제 결제는 Toss SKU와 1:1로 연결됩니다.
- **결제 흐름**: `PurchaseCuratedSpotAsync`가 주문 생성 → 이벤트 폴링 → 성공/실패 반환까지 전부 처리하며, `PurchaseCompleted` 이벤트로도 결과를 수신할 수 있습니다.

### 4. WebView 가시성 & 자동 재생 제어

토스 정책상 WebView가 화면에 보이지 않는 동안에는 게임이 자동으로 멈추고 소리가 나지 않아야 합니다. 이를 위해 React/Unity 양쪽에 훅을 추가했습니다.

```tsx
// webapp/src/App.tsx
useEffect(() => {
  const notify = (state: "hidden" | "visible") =>
    unityContext.sendMessage?.("AitRpcBridge", "OnHostVisibilityChanged", state);
  const handleVisibility = () => notify(document.hidden ? "hidden" : "visible");
  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("blur", () => notify("hidden"));
  window.addEventListener("focus", () => notify("visible"));
  handleVisibility(); // 초기 상태 전달
  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("blur", () => notify("hidden"));
    window.removeEventListener("focus", () => notify("visible"));
  };
}, [unityContext]);
```

Unity의 `AitRpcBridge.OnHostVisibilityChanged`는 위 ScriptableObject 설정에 따라 `AppsInTossPlaybackPause`를 호출하여 `Time.timeScale`과 오디오 상태를 자동으로 관리합니다.

### 5. Safe Area 모킹

`SafeAreaManager`는 WebGL (실 디바이스)에서는 Toss RPC로 안전 영역을 받고, Unity 에디터/Standalone에서는 `Screen.safeArea`를 이용해 인셋을 계산합니다. 별도의 모킹 설정 없이도 에디터에서 UI를 맞출 수 있습니다.

### ShareService (공유 및 리워드)

공유하기 기능을 호출하고, 그 결과를 단일 응답으로 받습니다.

```csharp
using Ait.Share;
using AitBridge.RPC;
using Cysharp.Threading.Tasks;

public class ShareTest : MonoBehaviour
{
    public async UniTask TestShare(string moduleId)
    {
        var request = new ShowContactsViralRequest { ModuleId = moduleId };
        try
        {
            var response = await AitRpcBridge.Instance.ShareService.ShowContactsViral(request);
            
            switch (response.EventCase)
            {
                case ShowContactsViralResponse.EventOneofCase.Reward:
                    Debug.Log($"Share Reward! Amount: {response.Reward.RewardAmount}, Unit: {response.Reward.RewardUnit}");
                    break;
                case ShowContactsViralResponse.EventOneofCase.Close:
                    Debug.Log($"Share Closed! Reason: {response.Close.CloseReason}, Sent Count: {response.Close.SentRewardsCount}");
                    break;
                case ShowContactsViralResponse.EventOneofCase.Error:
                    Debug.LogError($"Share Error: {response.Error.Message}");
                    break;
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"ShowContactsViral RPC failed: {e.Message}");
        }
    }
}
```

## 📐 아키텍처

이 프로젝트는 Protobuf를 이용한 코드 생성 기반의 RPC 아키텍처를 사용합니다.

1.  `proto/` 폴더 내의 `.proto` 파일에 서비스와 메시지를 정의합니다.
2.  변경사항을 Git에 Push하면, GitHub Action이 `.github/workflows/generate-protobuf.yml` 워크플로우를 실행합니다.
3.  워크플로우는 `protoc-gen-webviewrpc` 코드 생성기를 사용하여 Unity용 C# 코드와 React용 TypeScript 코드를 자동으로 생성하고, `generated-code` 브랜치에 커밋합니다.
4.  개발자는 `generated-code` 브랜치의 변경사항을 자신의 개발 브랜치로 가져와(`pull` 또는 `cherry-pick`) 구현을 계속합니다.

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면, 이슈를 생성하거나 Pull Request를 보내주세요.

## 📜 라이선스

이 프로젝트는 [MIT License](LICENSE.txt)를 따릅니다.
