# React WebApp Template for AppInToss Unity

Unity WebGL을 임베드하고 AIT SDK와 통합된 React 웹앱 템플릿입니다.

## 📋 요구사항

- Node.js 18+
- npm 또는 yarn

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

→ `http://localhost:5173` 접속

### 프로덕션 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

### AIT 배포

```bash
npm run deploy
```

## 📁 프로젝트 구조

```
webapp/
├── src/
│   ├── hooks/
│   │   └── useAitBridge.ts          # Unity ↔ React 브릿지 훅
│   │
│   ├── services/
│   │   └── ait/
│   │       ├── types.ts             # 공통 타입 정의
│   │       ├── index.ts             # 서비스 레지스트리
│   │       ├── openURL.ts           # OpenURL 서비스
│   │       ├── _template.ts         # 서비스 템플릿
│   │       └── README.md            # 서비스 가이드
│   │
│   ├── App.tsx                       # Unity 로더 & Safe Area
│   ├── App.css
│   ├── main.tsx
│   └── index.css
│
├── public/
│   └── unity-build/                  # Unity WebGL 빌드 파일 위치
│       ├── [빌드명].loader.js
│       ├── [빌드명].data
│       ├── [빌드명].framework.js
│       └── [빌드명].wasm
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── granite.config.ts                 # AIT 설정
```

## 🔧 Unity 빌드 연결

### 1. Unity WebGL 빌드

Unity에서 WebGL로 빌드하고 출력을 `public/unity-build/`로 설정

### 2. 빌드 파일 경로 설정

`src/App.tsx` 파일에서 빌드 파일 이름 수정:

```typescript
const { unityProvider, ...unityContext } = useUnityContext({
  loaderUrl: "unity-build/YOUR_BUILD_NAME.loader.js",      // 수정
  dataUrl: "unity-build/YOUR_BUILD_NAME.data",              // 수정
  frameworkUrl: "unity-build/YOUR_BUILD_NAME.framework.js", // 수정
  codeUrl: "unity-build/YOUR_BUILD_NAME.wasm",              // 수정
});
```

## 🎨 Safe Area 처리

`App.tsx`는 자동으로 Safe Area를 처리합니다:

```typescript
const insets = getSafeAreaInsets(); // AIT SDK에서 가져옴

<div style={{
  paddingTop: `${insets.top}px`,      // 상단 노치
  paddingBottom: `${insets.bottom}px`, // 하단 홈 인디케이터
}}>
  <Unity unityProvider={unityProvider} />
</div>
```

## 🔌 브릿지 사용법

### Unity에서 React로 이벤트 발생

Unity (C#):
```csharp
var openURLService = AitSdkBridge.Instance.GetService<OpenURLService>();
openURLService.OpenURL("https://google.com", 
    onSuccess: () => Debug.Log("성공"),
    onFailure: (error) => Debug.LogError(error)
);
```

React가 자동으로 수신하고 AIT SDK 호출 → Unity로 콜백 전송

## 📦 새 AIT 서비스 추가

### 1. 서비스 파일 생성

`src/services/ait/payment.ts`:

```typescript
import { requestPayment } from "@apps-in-toss/web-framework";
import type { AitService, UnityContextType, UnityCallbackConfig } from "./types";

export const paymentService: AitService = {
  eventName: "AIT_Payment",
  
  handler: async (payload, context, callbackConfig) => {
    const { productId, requestId } = JSON.parse(String(payload));
    
    try {
      const result = await requestPayment(productId);
      
      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.successMethod,
        JSON.stringify({ requestId, data: result })
      );
    } catch (error) {
      context.sendMessage(
        callbackConfig.gameObjectName,
        callbackConfig.failureMethod,
        JSON.stringify({ requestId, error: error.message })
      );
    }
  },
};
```

### 2. 서비스 등록

`src/services/ait/index.ts`:

```typescript
export { paymentService } from "./payment";

export const aitServices: AitService[] = [
  openURLService,
  paymentService, // 추가!
];
```

끝! 브릿지가 자동으로 등록하고 라우팅합니다.

## 🔍 디버깅

### 브라우저 콘솔

개발자 도구(F12)에서 브릿지 로그 확인:

```
[AIT Bridge] Registered 2 service(s): AIT_OpenURL, AIT_Payment
[AIT_OpenURL] Successfully opened URL: https://google.com
```

### Unity 콘솔

Unity Editor의 Console 창에서 로그 확인:

```
[AitSdkBridge] Initialized with 2 service(s)
[OpenURLService] Requesting to open URL: https://google.com
[OpenURLService] Successfully opened URL: https://google.com
```

## 📚 더 알아보기

- **AIT SDK 문서**: [Apps in Toss 문서](https://developers.toss.im)
- **react-unity-webgl**: [GitHub](https://github.com/jeffreylanters/react-unity-webgl)
- **서비스 구현 가이드**: `src/services/ait/README.md`
- **전체 아키텍처**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## 🛠️ 기술 스택

- **React** 19.1.1
- **TypeScript** 5.9.3
- **Vite** 7.1.7
- **react-unity-webgl** 10.1.6
- **@apps-in-toss/web-framework** 1.4.5

## ⚙️ 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (HMR 지원) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | ESLint 실행 |
| `npm run deploy` | AIT 배포 |

## 🐛 문제 해결

### Unity가 로드되지 않음

1. 빌드 파일 경로가 정확한지 확인
2. `public/unity-build/` 폴더에 파일이 있는지 확인
3. 브라우저 콘솔에서 404 에러 확인

### 브릿지 통신이 안됨

1. Unity Scene에 `AitSdkBridge` GameObject가 있는지 확인
2. GameObject 이름이 정확히 "AitSdkBridge"인지 확인
3. Unity와 React의 `eventName`이 일치하는지 확인

### Safe Area가 적용 안됨

1. `getSafeAreaInsets()`가 올바른 값을 반환하는지 확인
2. Toss 앱 환경에서 테스트 (로컬에서는 기본값)
