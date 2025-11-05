# Unity 빠른 설정 가이드

## 1️⃣ 파일 복사

```bash
# Unity 프로젝트의 Assets/Scripts 폴더로 이동
cd [YourUnityProject]/Assets/Scripts

# unity-code 폴더 내용을 복사
# Bridge/, Services/, Test/ 폴더 전체를 복사
```

또는 Unity Editor에서:
1. `unity-code` 폴더를 Unity의 `Assets` 폴더로 드래그 앤 드롭

## 2️⃣ Scene 설정

### A. AitSdkBridge GameObject 생성

1. Hierarchy에서 **우클릭 > Create Empty**
2. 이름을 **"AitSdkBridge"**로 변경 ⚠️ (정확히!)
3. Inspector에서 **Add Component**
4. `AitSdkBridge` 스크립트 검색 및 추가

### B. 테스트 UI 생성 (선택사항)

1. Hierarchy에서 **우클릭 > UI > Canvas**
2. Canvas 선택
3. Inspector에서 **Add Component**
4. `AitServiceTester` 스크립트 검색 및 추가

## 3️⃣ WebGL 빌드 설정

### A. 플랫폼 변경

1. **File > Build Settings**
2. **WebGL** 선택
3. **Switch Platform** 클릭

### B. 빌드 실행

1. **Build Settings** 창에서
2. 현재 Scene이 **Scenes In Build**에 포함되어 있는지 확인
3. **Build** 클릭
4. 출력 폴더를 **webapp/public/unity-build**로 설정
5. 빌드 완료 대기

## 4️⃣ 빌드 파일 확인

빌드 후 다음 파일들이 생성되어야 합니다:

```
webapp/public/unity-build/
├── [프로젝트명].loader.js
├── [프로젝트명].data
├── [프로젝트명].framework.js
└── [프로젝트명].wasm
```

## 5️⃣ React 설정 업데이트

`webapp/src/App.tsx` 파일에서 빌드 파일 경로 수정:

```typescript
const { unityProvider, ...unityContext } = useUnityContext({
  loaderUrl: "unity-build/[프로젝트명].loader.js",
  dataUrl: "unity-build/[프로젝트명].data",
  frameworkUrl: "unity-build/[프로젝트명].framework.js",
  codeUrl: "unity-build/[프로젝트명].wasm",
});
```

⚠️ `[프로젝트명]` 부분을 실제 파일 이름으로 변경하세요!

## 6️⃣ 테스트

### A. 로컬에서 테스트

```bash
cd webapp
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### B. 테스트 시나리오

1. **Unity 로딩 확인**: 화면에 Unity가 로드되는지 확인
2. **테스트 UI 확인**: 버튼들이 표시되는지 확인
3. **OpenURL 테스트**: 각 버튼 클릭
   - "Open Google" 클릭 → Google 페이지 열림
   - "Open GitHub" 클릭 → GitHub 페이지 열림
   - "Open Unity" 클릭 → Unity 페이지 열림
   - "Test Invalid URL" 클릭 → 에러 메시지 확인

### C. 브라우저 콘솔 확인

F12를 눌러 개발자 도구 열기:

**성공 시 로그:**
```
[AIT Bridge] Registered 1 service(s): AIT_OpenURL
[AitSdkBridge] Dispatched event: AIT_OpenURL | Payload: https://google.com|[requestId]
[AIT_OpenURL] Successfully opened URL: https://google.com
```

**실패 시 로그:**
```
[AIT_OpenURL] Failed to open URL [url]: [error message]
```

## 🔧 문제 해결

### "AitSdkBridge Instance is null" 에러

→ GameObject 이름이 정확히 "AitSdkBridge"인지 확인
→ Scene에 AitSdkBridge GameObject가 있는지 확인

### Unity가 로드되지 않음

→ `App.tsx`의 파일 경로가 정확한지 확인
→ 브라우저 콘솔에서 404 에러 확인
→ `webapp/public/unity-build/` 폴더에 파일이 있는지 확인

### "WebGL only" 경고가 나옴

→ Play 모드가 아닌 WebGL로 빌드했는지 확인
→ Editor에서는 시뮬레이션만 가능

### 버튼을 눌러도 아무 일이 없음

→ 브라우저 팝업 차단 설정 확인
→ 브라우저 콘솔에서 에러 메시지 확인
→ HTTPS에서 테스트하고 있는지 확인 (일부 브라우저는 HTTP에서 openURL 차단)

## ✅ 체크리스트

- [ ] Unity 프로젝트에 스크립트 복사 완료
- [ ] Scene에 "AitSdkBridge" GameObject 생성 및 스크립트 부착
- [ ] (선택) Canvas에 AitServiceTester 부착
- [ ] WebGL로 플랫폼 변경
- [ ] webapp/public/unity-build로 빌드
- [ ] App.tsx에서 빌드 파일 경로 수정
- [ ] npm run dev로 로컬 서버 실행
- [ ] 브라우저에서 테스트

## 🎉 완료!

모든 단계를 완료했다면, Unity와 React 간의 AIT SDK 브릿지가 작동합니다!

추가 서비스를 구현하려면 `README.md`의 "새 서비스 추가하기" 섹션을 참고하세요.

