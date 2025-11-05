# AppInToss Unity Template

**Unity WebGL + React 통합 템플릿**

Unity WebGL을 React 웹앱에 임베드하고, AIT (Apps in Toss) SDK와 통합하여 Toss 앱 환경에서 Unity 게임/앱을 실행할 수 있게 하는 템플릿 프로젝트입니다.

## 🎯 주요 기능

- ✅ **Unity WebGL ↔ React 브릿지**: 양방향 통신 시스템
- ✅ **AIT SDK 통합**: Toss 앱의 네이티브 기능 사용 (openURL, payment 등)
- ✅ **서비스 기반 아키텍처**: 확장 가능한 모듈형 구조
- ✅ **타입 안전성**: TypeScript + C# 강타입 시스템
- ✅ **Safe Area 지원**: 노치/홈 인디케이터 대응

## 📁 프로젝트 구조

```
AppInTossUnity/
├── webapp/              # React 웹앱 (템플릿)
│   ├── src/
│   │   ├── hooks/       # React 훅 (브릿지)
│   │   ├── services/    # AIT SDK 서비스
│   │   └── App.tsx      # Unity 로더
│   └── public/
│       └── unity-build/ # Unity WebGL 빌드 출력
│
├── unity/               # Unity 샘플 프로젝트 (사용자 생성)
│   └── Assets/
│       └── Scripts/     # C# 브릿지 & 서비스
│
├── unity-code/          # Unity 코드 템플릿 (복사용)
│   ├── Bridge/          # 브릿지 시스템
│   ├── Services/        # 서비스 구현
│   └── Test/            # 테스트 UI
│
└── ARCHITECTURE.md      # 아키텍처 문서
```

## 🚀 빠른 시작

### 1. React 웹앱 실행

```bash
cd webapp
npm install
npm run dev
```

→ `http://localhost:5173` 접속

### 2. Unity 프로젝트 설정

1. Unity Hub에서 새 프로젝트 생성 (`unity/` 폴더)
2. `unity-code/` 폴더 내용을 `unity/Assets/Scripts/`로 복사
3. Scene에 `AitSdkBridge` GameObject 생성
4. WebGL로 빌드 → `webapp/public/unity-build/`

자세한 설정은 [`unity-code/SETUP.md`](./unity-code/SETUP.md) 참고

### 3. 통합 테스트

1. Unity WebGL 빌드
2. `webapp/src/App.tsx`에서 빌드 파일 경로 수정
3. `npm run dev` 실행
4. 브라우저에서 Unity 로드 및 통신 테스트

## 📚 문서

- **전체 아키텍처**: [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- **React 가이드**: [`webapp/README.md`](./webapp/README.md)
- **Unity 가이드**: [`unity-code/README.md`](./unity-code/README.md)
- **Unity 설정**: [`unity-code/SETUP.md`](./unity-code/SETUP.md)

## 🏗️ 아키텍처 개요

### React ↔ Unity 통신 흐름

```
Unity (C#)                React (TypeScript)
    │                           │
    │  1. Service Call          │
    ├──────────────────────────>│
    │  dispatchReactUnityEvent  │
    │                           │
    │  2. AIT SDK Call          │
    │                      ┌────┤
    │                      │ AIT│ openURL, payment, etc.
    │                      └────┤
    │                           │
    │  3. Callback              │
    │<──────────────────────────┤
    │  SendMessage              │
```

### 서비스 기반 설계

- **React 측**: `services/ait/` - 각 AIT SDK 기능을 독립 서비스로 구현
- **Unity 측**: `Services/` - 각 기능별 C# 서비스 클래스
- **브릿지**: 순수 라우팅 역할, 비즈니스 로직 없음

## 🔧 새 서비스 추가하기

### React 측 (3단계)

1. `webapp/src/services/ait/payment.ts` 생성
2. `AitService` 인터페이스 구현
3. `services/ait/index.ts`의 `aitServices` 배열에 추가

### Unity 측 (3단계)

1. `unity/Assets/Scripts/Services/PaymentService.cs` 생성
2. `IAitService` 인터페이스 구현
3. `AitSdkBridge.cs`의 `Awake()`에서 `RegisterService()` 호출

→ 완료! 브릿지가 자동으로 통신 처리

## 🎮 현재 구현된 서비스

| 서비스 | Event Name | 설명 |
|--------|------------|------|
| OpenURL | `AIT_OpenURL` | URL을 브라우저에서 열기 |

## 🚧 향후 추가 예정

- [ ] Payment Service (인앱 결제)
- [ ] Share Service (공유하기)
- [ ] User Info Service (사용자 정보)
- [ ] Analytics Service (분석)
- [ ] Notification Service (알림)
- [ ] WebView RPC 통합 (Protobuf 기반)

## 🛠️ 기술 스택

### React 웹앱
- React 19 + TypeScript
- Vite (빌드 도구)
- react-unity-webgl (Unity 통합)
- @apps-in-toss/web-framework (AIT SDK)

### Unity
- Unity 2021.3+ (LTS)
- WebGL Platform
- C# (.NET Standard 2.1)

## 📝 라이선스

MIT License

## 🤝 기여

이슈와 PR을 환영합니다!

1. Fork this repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📮 문의

프로젝트 관련 문의사항은 Issues를 통해 남겨주세요.

