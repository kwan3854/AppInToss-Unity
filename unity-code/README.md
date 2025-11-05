# Unity AIT Bridge - Service Architecture

Unity 측 AIT SDK 브릿지 코드입니다. React 측과 동일한 서비스 패턴을 사용합니다.

## 📁 파일 구조

```
unity-code/
├── Bridge/
│   ├── AitSdkBridge.cs          # Singleton MonoBehaviour (브릿지 관리)
│   └── IAitService.cs           # 서비스 인터페이스
├── Services/
│   └── OpenURLService.cs        # OpenURL 서비스 구현
├── Test/
│   └── AitServiceTester.cs      # 테스트 UI (Canvas에 부착)
└── README.md                     # 이 파일
```

## 🎮 Unity 프로젝트 설정

### 1. 필수 GameObject 생성

Scene에 다음 GameObject를 생성하세요:

```
Hierarchy:
├── AitSdkBridge (빈 GameObject)
│   └── [AitSdkBridge.cs 스크립트 부착]
└── Canvas (UI Canvas)
    └── [AitServiceTester.cs 스크립트 부착] (테스트용)
```

### 2. 스크립트 임포트

1. `unity-code/` 폴더의 모든 `.cs` 파일을 Unity 프로젝트의 `Assets/Scripts/` 폴더로 복사
2. Unity가 자동으로 컴파일할 때까지 대기

### 3. AitSdkBridge GameObject 설정

1. Hierarchy에서 **빈 GameObject 생성** (`우클릭 > Create Empty`)
2. 이름을 **"AitSdkBridge"**로 변경 (정확히 이 이름이어야 함)
3. `AitSdkBridge.cs` 스크립트를 부착
4. Scene을 저장하고 빌드에 포함

### 4. 테스트 UI 설정 (선택사항)

1. Canvas 생성 (`우클릭 > UI > Canvas`)
2. Canvas에 `AitServiceTester.cs` 스크립트 부착
3. Play 모드에서 버튼들이 자동 생성됨

## 🔧 사용 방법

### OpenURL 서비스 사용 예제

```csharp
using AitBridge;
using AitBridge.Services;

public class MyGameScript : MonoBehaviour
{
    private void OpenWebsite()
    {
        // Get the OpenURL service
        var openURLService = AitSdkBridge.Instance.GetService<OpenURLService>();
        
        // Open a URL
        openURLService.OpenURL(
            "https://google.com",
            onSuccess: () => {
                Debug.Log("URL opened successfully!");
            },
            onFailure: (error) => {
                Debug.LogError($"Failed to open URL: {error}");
            }
        );
    }
}
```

### 간단한 사용 (콜백 없이)

```csharp
var openURLService = AitSdkBridge.Instance.GetService<OpenURLService>();
openURLService.OpenURL("https://google.com");
```

## 🆕 새 서비스 추가하기

React 측과 동일하게, 3단계만 거치면 됩니다:

### Step 1: 서비스 클래스 생성

`Services/PaymentService.cs` 예제:

```csharp
using System;
using System.Collections.Generic;
using UnityEngine;

namespace AitBridge.Services
{
    public class PaymentService : IAitService
    {
        private AitSdkBridge _bridge;
        private Dictionary<string, PaymentRequest> _requests = new Dictionary<string, PaymentRequest>();

        public string EventName => "AIT_Payment";

        private class PaymentRequest
        {
            public string ProductId;
            public Action<string> OnSuccess; // result data
            public Action<string> OnFailure;
        }

        public void Initialize(AitSdkBridge bridge)
        {
            _bridge = bridge;
        }

        public void RequestPayment(string productId, Action<string> onSuccess = null, Action<string> onFailure = null)
        {
            var requestId = Guid.NewGuid().ToString();
            
            _requests[requestId] = new PaymentRequest
            {
                ProductId = productId,
                OnSuccess = onSuccess,
                OnFailure = onFailure
            };

            var payload = $"{productId}|{requestId}";
            _bridge.DispatchEvent(EventName, payload, this, requestId);
        }

        public void OnSuccess(string requestId, string data = null)
        {
            if (_requests.TryGetValue(requestId, out var request))
            {
                Debug.Log($"[PaymentService] Payment successful: {data}");
                request.OnSuccess?.Invoke(data);
                _requests.Remove(requestId);
            }
        }

        public void OnFailure(string requestId, string errorMessage)
        {
            if (_requests.TryGetValue(requestId, out var request))
            {
                Debug.LogError($"[PaymentService] Payment failed: {errorMessage}");
                request.OnFailure?.Invoke(errorMessage);
                _requests.Remove(requestId);
            }
        }
    }
}
```

### Step 2: 브릿지에 서비스 등록

`Bridge/AitSdkBridge.cs`의 `Awake()` 메서드에 추가:

```csharp
private void Awake()
{
    // ... 기존 코드 ...
    
    RegisterService(new Services.OpenURLService());
    RegisterService(new Services.PaymentService()); // 이 줄 추가!
}
```

### Step 3: 사용하기

```csharp
var paymentService = AitSdkBridge.Instance.GetService<PaymentService>();
paymentService.RequestPayment("product_123", 
    onSuccess: (result) => Debug.Log($"Payment done: {result}"),
    onFailure: (error) => Debug.LogError($"Payment failed: {error}")
);
```

## 🔄 React ↔ Unity 통신 흐름

```
┌──────────────┐                           ┌──────────────┐
│   Unity      │                           │    React     │
│   C#         │                           │  TypeScript  │
└──────────────┘                           └──────────────┘
      │                                            │
      │  1. openURLService.OpenURL("url")         │
      │─────────────────────────────────────────▶ │
      │                                            │
      │  2. dispatchReactUnityEvent()              │
      │     ("AIT_OpenURL", "url|requestId")      │
      │─────────────────────────────────────────▶ │
      │                                            │
      │                      3. openURLService.handler()
      │                         calls openURL(url)│
      │                                            │
      │  4. SendMessage("AitSdkBridge",            │
      │     "OnSuccess", "requestId")              │
      │ ◀─────────────────────────────────────────│
      │                                            │
      │  5. OnSuccess routes to service            │
      │     service.OnSuccess(requestId)           │
      │                                            │
```

## 🎯 아키텍처 장점

✅ **확장성**: 서비스 추가가 간단 (파일 하나 + 한 줄 등록)
✅ **유지보수성**: 각 기능이 독립적인 클래스로 분리
✅ **타입 안전성**: 인터페이스로 계약 강제
✅ **자동 라우팅**: 브릿지가 자동으로 콜백 라우팅
✅ **깔끔한 코드**: 브릿지는 관리만, 비즈니스 로직 분리
✅ **React와 대칭**: 양측이 동일한 패턴 사용

## ⚠️ 주의사항

1. **GameObject 이름**: `AitSdkBridge` 정확히 이 이름이어야 함 (React에서 SendMessage 호출 시 사용)
2. **WebGL 빌드**: `dispatchReactUnityEvent`는 WebGL에서만 작동
3. **DontDestroyOnLoad**: AitSdkBridge는 씬 전환 시에도 유지됨
4. **Editor 테스트**: Editor에서는 시뮬레이션 모드로 즉시 성공 반환

## 🧪 테스트

1. **Play 모드에서**: `AitServiceTester`가 에디터 시뮬레이션으로 작동
2. **WebGL 빌드에서**: 실제 React 브릿지와 통신하여 작동

테스터 UI 버튼:
- **Open Google**: Google 페이지 열기
- **Open GitHub**: GitHub 페이지 열기
- **Open Unity**: Unity 페이지 열기
- **Test Invalid URL**: 잘못된 URL로 에러 테스트

## 📞 React 측 대응 파일

- Unity: `AitSdkBridge.cs` ↔ React: `useAitBridge.ts`
- Unity: `IAitService.cs` ↔ React: `AitService` interface
- Unity: `OpenURLService.cs` ↔ React: `openURLService.ts`

