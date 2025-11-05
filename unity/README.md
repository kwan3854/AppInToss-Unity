# Unity Sample Project

이 폴더는 Unity 샘플 프로젝트를 위한 공간입니다.

## 🎮 Unity 프로젝트 생성

### 1. Unity Hub에서 새 프로젝트 생성

1. Unity Hub 실행
2. **New Project** 클릭
3. **Template**: 3D (Universal Render Pipeline 권장)
4. **Project Name**: 원하는 이름
5. **Location**: 이 폴더(`AppInTossUnity/unity/`)를 선택
6. **Create Project** 클릭

### 2. 브릿지 코드 추가

```bash
# 프로젝트 루트에서
cp -r unity-code/* unity/Assets/Scripts/
```

또는 수동으로:
1. `unity-code/` 폴더의 모든 내용을 복사
2. `unity/Assets/Scripts/` 폴더로 붙여넣기

### 3. Scene 설정

1. **GameObject 생성**
   - Hierarchy 우클릭 → Create Empty
   - 이름을 정확히 **"AitSdkBridge"**로 설정 ⚠️

2. **스크립트 부착**
   - AitSdkBridge GameObject 선택
   - Inspector → Add Component
   - `AitSdkBridge` 스크립트 검색 후 추가

3. **테스트 UI 추가 (선택사항)**
   - Hierarchy 우클릭 → UI → Canvas
   - Canvas 선택 → Add Component
   - `AitServiceTester` 스크립트 추가

### 4. WebGL 빌드 설정

1. **File → Build Settings**
2. **Platform**: WebGL 선택
3. **Switch Platform** 클릭 (처음만)
4. **Build Settings 설정**:
   - Compression Format: Disabled (또는 Gzip)
   - Data Caching: 체크 해제 권장

### 5. 빌드 실행

1. **Build Settings → Build**
2. 출력 폴더: `../webapp/public/unity-build` 선택
3. 빌드 완료 대기

## 📁 예상 프로젝트 구조

```
unity/
├── Assets/
│   ├── Scenes/
│   │   └── MainScene.unity          # 메인 씬
│   │
│   ├── Scripts/                      # unity-code에서 복사
│   │   ├── Bridge/
│   │   │   ├── AitSdkBridge.cs
│   │   │   └── IAitService.cs
│   │   ├── Services/
│   │   │   └── OpenURLService.cs
│   │   └── Test/
│   │       └── AitServiceTester.cs
│   │
│   └── (기타 게임 에셋들)
│
├── Packages/
├── ProjectSettings/
└── README.md                         # 이 파일
```

## 🔌 브릿지 사용법

### 서비스 호출 예시

```csharp
using AitBridge;
using AitBridge.Services;

public class MyGameScript : MonoBehaviour
{
    async void Start()
    {
        // OpenURL 서비스 가져오기
        var openURLService = AitSdkBridge.Instance.GetService<OpenURLService>();
        
        // URL 열기 (Async/Await)
        try
        {
            await openURLService.OpenURL("https://google.com");
            Debug.Log("URL 열기 성공!");
        }
        catch (Exception e)
        {
            Debug.LogError($"URL 열기 실패: {e.Message}");
        }
    }
}
```

### 콜백 방식

```csharp
openURLService.OpenURL(
    "https://google.com",
    onSuccess: () => Debug.Log("성공"),
    onFailure: (error) => Debug.LogError(error)
);
```

## 📦 새 서비스 추가

자세한 내용은 [`../unity-code/README.md`](../unity-code/README.md) 참고

### 간단 요약

1. `Assets/Scripts/Services/PaymentService.cs` 생성
2. `IAitService` 인터페이스 구현
3. `AitSdkBridge.cs`의 `Awake()`에서 등록:
   ```csharp
   RegisterService(new Services.PaymentService());
   ```

## 🧪 테스트

### Editor에서 테스트

1. Play 모드 실행
2. `AitServiceTester` UI 버튼 클릭
3. 콘솔에서 로그 확인 (에디터에서는 시뮬레이션)

### WebGL 빌드로 테스트

1. WebGL로 빌드
2. `../webapp/` 폴더에서:
   ```bash
   npm run dev
   ```
3. 브라우저에서 `http://localhost:5173` 접속
4. Unity 로드 후 실제 브릿지 통신 테스트

## 🔧 WebGL 빌드 최적화

### Build Settings

- **Compression Format**: Gzip (배포 시)
- **Code Optimization**: Runtime Speed
- **Strip Engine Code**: 체크
- **Managed Stripping Level**: Medium

### Player Settings

- **WebGL Template**: Default 또는 Minimal
- **Auto Graphics API**: WebGL 2.0만 사용 권장

## 🐛 문제 해결

### "AitSdkBridge Instance is null" 에러

→ GameObject 이름이 정확히 "AitSdkBridge"인지 확인

### 빌드 파일이 너무 큼

→ Build Settings에서 Development Build 체크 해제
→ Code Optimization: Runtime Speed 설정

### 브라우저에서 로드 안됨

→ `webapp/src/App.tsx`에서 빌드 파일 경로 확인
→ CORS 이슈: 로컬 서버(`npm run dev`) 사용

## 📚 참고 문서

- [Unity WebGL 빌드 가이드](https://docs.unity3d.com/Manual/webgl-building.html)
- [react-unity-webgl](https://github.com/jeffreylanters/react-unity-webgl)
- [브릿지 아키텍처](../ARCHITECTURE.md)
- [Unity 코드 가이드](../unity-code/README.md)

