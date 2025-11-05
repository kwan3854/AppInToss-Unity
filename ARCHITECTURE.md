# AppInToss Unity - 전체 아키텍처

React ↔ Unity 브릿지를 통한 AIT SDK 통합 아키텍처

## 📊 전체 구조

```
AppInTossUnity/
├── webapp/                        # React + Vite 웹앱
│   ├── src/
│   │   ├── hooks/
│   │   │   └── useAitBridge.ts   # 브릿지 훅 (서비스 등록/라우팅)
│   │   ├── services/
│   │   │   └── ait/
│   │   │       ├── types.ts       # 공통 타입 정의
│   │   │       ├── index.ts       # 서비스 레지스트리
│   │   │       ├── openURL.ts     # OpenURL 서비스
│   │   │       ├── _template.ts   # 서비스 템플릿
│   │   │       └── README.md      # React 측 문서
│   │   └── App.tsx                # Unity WebGL 컴포넌트
│   └── public/
│       └── unity-build/           # Unity WebGL 빌드 출력
│
└── unity-code/                     # Unity C# 스크립트
    ├── Bridge/
    │   ├── AitSdkBridge.cs        # Singleton 브릿지 (서비스 관리)
    │   └── IAitService.cs         # 서비스 인터페이스
    ├── Services/
    │   └── OpenURLService.cs      # OpenURL 서비스
    ├── Test/
    │   └── AitServiceTester.cs    # 테스트 UI
    ├── README.md                   # Unity 측 문서
    └── SETUP.md                    # Unity 설정 가이드
```

## 🔄 통신 흐름

### 1. OpenURL 요청 (Unity → React → AIT SDK)

```
┌─────────────────┐
│  Unity (C#)     │
│  Game Code      │
└────────┬────────┘
         │ 1. openURLService.OpenURL("https://google.com")
         ▼
┌─────────────────┐
│ OpenURLService  │ (Services/OpenURLService.cs)
└────────┬────────┘
         │ 2. Generate requestId
         │ 3. Store callback
         ▼
┌─────────────────┐
│  AitSdkBridge   │ (Bridge/AitSdkBridge.cs)
└────────┬────────┘
         │ 4. dispatchReactUnityEvent("AIT_OpenURL", "url|requestId")
         ▼
┌─────────────────┐
│  React Bridge   │ (hooks/useAitBridge.ts)
│  useAitBridge   │
└────────┬────────┘
         │ 5. Route to openURLService
         ▼
┌─────────────────┐
│ openURLService  │ (services/ait/openURL.ts)
└────────┬────────┘
         │ 6. Parse payload
         │ 7. await openURL(url)
         ▼
┌─────────────────┐
│   AIT SDK       │ (@apps-in-toss/web-framework)
│   openURL()     │
└────────┬────────┘
         │ 8. Opens URL in browser
         └─────────────────────────────┐
                                       │
         ┌─────────────────────────────┘
         │ Success/Failure
         ▼
┌─────────────────┐
│ openURLService  │ (services/ait/openURL.ts)
└────────┬────────┘
         │ 9. sendMessage("AitSdkBridge", "OnSuccess", requestId)
         ▼
┌─────────────────┐
│  AitSdkBridge   │ (Bridge/AitSdkBridge.cs)
│  OnSuccess()    │
└────────┬────────┘
         │ 10. Route callback to service
         ▼
┌─────────────────┐
│ OpenURLService  │ (Services/OpenURLService.cs)
│ OnSuccess()     │
└────────┬────────┘
         │ 11. Execute callback
         ▼
┌─────────────────┐
│  Unity (C#)     │
│  Game Code      │
│  Callback       │
└─────────────────┘
```

## 🏗️ 아키텍처 패턴

### React 측: DI (Dependency Injection) 패턴

```typescript
// 1. 서비스 인터페이스 정의
interface AitService {
  eventName: string;
  handler: (payload, context, config) => void;
}

// 2. 서비스 구현
const openURLService: AitService = {
  eventName: "AIT_OpenURL",
  handler: async (payload, context, config) => { ... }
};

// 3. 서비스 등록
export const aitServices = [
  openURLService,
  // ... 추가 서비스들
];

// 4. 브릿지가 자동 등록
useAitBridge(unityContext);
```

### Unity 측: Service Locator 패턴

```csharp
// 1. 서비스 인터페이스 정의
interface IAitService {
  string EventName { get; }
  void OnSuccess(string requestId, string data);
  void OnFailure(string requestId, string error);
}

// 2. 서비스 구현
class OpenURLService : IAitService {
  public string EventName => "AIT_OpenURL";
  public void OpenURL(string url, Action onSuccess, ...) { ... }
}

// 3. 싱글톤 브릿지에 등록
AitSdkBridge.Instance.RegisterService(new OpenURLService());

// 4. 서비스 사용
var service = AitSdkBridge.Instance.GetService<OpenURLService>();
service.OpenURL("https://google.com");
```

## 📋 서비스 계약 (Contract)

모든 서비스는 다음 규칙을 따릅니다:

### Payload 형식

```
"param1|param2|...|requestId"
```

- **앞부분**: 서비스별 파라미터 (|로 구분)
- **마지막**: 고유한 requestId (콜백 라우팅용)

### 콜백 형식

**성공**:
```
"requestId"                    // 데이터 없음
"requestId|resultData"         // 데이터 포함
```

**실패**:
```
"requestId|errorMessage"
```

### Unity GameObject

- **이름**: `AitSdkBridge` (정확히!)
- **메서드**:
  - `OnSuccess(string payload)`
  - `OnFailure(string payload)`

## 🎯 장점

### ✅ 확장성
- **React**: `aitServices` 배열에 추가만
- **Unity**: `RegisterService()` 한 줄만

### ✅ 유지보수성
- 각 기능이 독립적인 파일/클래스
- 브릿지는 순수하게 통신만 담당
- 비즈니스 로직과 통신 로직 분리

### ✅ 타입 안전성
- TypeScript와 C# 인터페이스로 계약 강제
- 컴파일 타임에 오류 검출

### ✅ 테스트 용이성
- 각 서비스를 독립적으로 테스트 가능
- Mock 서비스 쉽게 구현 가능

### ✅ 일관성
- React와 Unity가 동일한 패턴 사용
- 대칭적인 구조로 이해하기 쉬움

## 🔧 새 서비스 추가 프로세스

### 1단계: React 서비스 생성
```bash
webapp/src/services/ait/payment.ts
```

### 2단계: Unity 서비스 생성
```bash
unity-code/Services/PaymentService.cs
```

### 3단계: 등록
```typescript
// React: services/ait/index.ts
export const aitServices = [
  openURLService,
  paymentService, // 추가
];
```

```csharp
// Unity: Bridge/AitSdkBridge.cs
RegisterService(new Services.OpenURLService());
RegisterService(new Services.PaymentService()); // 추가
```

### 4단계: 사용
```csharp
// Unity
var payment = AitSdkBridge.Instance.GetService<PaymentService>();
payment.RequestPayment("product_123", onSuccess, onFailure);
```

## 📚 문서

- **React 측**: `webapp/src/services/ait/README.md`
- **Unity 측**: `unity-code/README.md`
- **Unity 설정**: `unity-code/SETUP.md`
- **전체 아키텍처**: `ARCHITECTURE.md` (이 파일)

## 🧪 테스트 환경

### 개발 모드
```bash
cd webapp
npm run dev
```

- Unity Editor: 시뮬레이션 모드
- WebGL Build: 실제 통신

### 프로덕션 빌드
```bash
cd webapp
npm run build
ait deploy
```

## 🎮 현재 구현된 서비스

| 서비스 | Event Name | React 파일 | Unity 파일 | 상태 |
|--------|------------|-----------|-----------|------|
| OpenURL | `AIT_OpenURL` | `openURL.ts` | `OpenURLService.cs` | ✅ 완료 |

## 🚀 향후 추가 예정 서비스

| 서비스 | Event Name | 설명 |
|--------|------------|------|
| Payment | `AIT_Payment` | 인앱 결제 |
| Share | `AIT_Share` | 공유하기 |
| Biometric | `AIT_Biometric` | 생체 인증 |
| Notification | `AIT_Notification` | 알림 |
| Storage | `AIT_Storage` | 로컬 저장소 |

각 서비스는 템플릿을 복사하여 쉽게 추가할 수 있습니다!

