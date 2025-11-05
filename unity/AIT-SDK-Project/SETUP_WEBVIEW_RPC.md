# WebView RPC Setup Guide

Unity에서 WebView RPC를 사용하기 위한 설정 가이드입니다.

## 📦 필수 패키지 설치

### 1. Protobuf for Unity

**NuGet for Unity 사용:**

1. Unity Package Manager에서 NuGet for Unity 설치:
   ```
   Window → Package Manager → Add package from git URL...
   https://github.com/GlitchEnzo/NuGetForUnity.git?path=/src/NuGetForUnity
   ```

2. NuGet for Unity 열기:
   ```
   NuGet → Manage NuGet Packages
   ```

3. Protobuf 검색 및 설치:
   ```
   Search: Google.Protobuf
   Version: 3.28.3 또는 최신
   Install
   ```

### 2. UniTask

WebView RPC는 async/await을 위해 UniTask를 사용합니다.

```
Window → Package Manager → Add package from git URL...
https://github.com/Cysharp/UniTask.git?path=src/UniTask/Assets/Plugins/UniTask
```

### 3. WebView RPC

이미 `Packages/manifest.json`에 추가되어 있습니다:

```json
{
  "dependencies": {
    "com.kwanjoong.webviewrpc": "https://github.com/kwan3854/Unity-WebViewRpc.git?path=/Packages/WebviewRpc"
  }
}
```

Unity Editor가 자동으로 패키지를 다운로드합니다.

## 🎮 Scene 설정

### 1. AitRpcBridge GameObject 생성

1. Hierarchy에서 우클릭 → Create Empty
2. 이름을 정확히 **"AitRpcBridge"**로 설정 ⚠️
3. `AitRpcBridge.cs` 스크립트 부착

### 2. 테스트 UI 설정 (선택사항)

1. Hierarchy에서 우클릭 → UI → Canvas
2. Canvas에 우클릭 → UI → Button (3개 생성)
   - Button 1: "Open Google"
   - Button 2: "Open GitHub"  
   - Button 3: "Open Unity"
3. Canvas에 우클릭 → UI → Text
   - Text: "Status"
4. Canvas에 `OpenURLTester.cs` 스크립트 부착
5. Inspector에서 버튼과 텍스트 연결

## ✅ 확인 사항

### 컴파일 에러가 없는지 확인

다음 네임스페이스가 인식되는지 확인:
```csharp
using AitBridge.Generated;      // Protobuf 생성 코드
using WebViewRPC;                 // WebView RPC 라이브러리
using Cysharp.Threading.Tasks;   // UniTask
using Google.Protobuf;            // Protobuf 라이브러리
```

### AitRpcBridge GameObject 확인

Hierarchy에서 "AitRpcBridge" GameObject가:
- ✅ 정확한 이름
- ✅ AitRpcBridge.cs 스크립트 부착
- ✅ Console에 초기화 로그:
  ```
  [AitRpcBridge] Initialized successfully
  [AitRpcBridge] Available services: OpenURL
  ```

## 🚀 사용 방법

```csharp
using AitBridge.RPC;
using AitBridge.Generated;

public class MyScript : MonoBehaviour
{
    async void OpenWebsite()
    {
        try
        {
            // Create request
            var request = new OpenURLRequest { Url = "https://google.com" };
            
            // Call RPC service
            var response = await AitRpcBridge.Instance.OpenURLService.OpenURL(request);
            
            // Check response
            if (response.Success)
            {
                Debug.Log("URL opened successfully!");
            }
            else
            {
                Debug.LogError($"Failed: {response.ErrorMessage}");
            }
        }
        catch (Exception e)
        {
            Debug.LogError($"Exception: {e.Message}");
        }
    }
}
```

## 🐛 문제 해결

### "WebViewRPC namespace not found"

→ Packages/manifest.json에 WebView RPC가 추가되었는지 확인
→ Unity Editor 재시작

### "Google.Protobuf namespace not found"

→ NuGet for Unity 설치 후 Google.Protobuf 패키지 설치
→ Assets/Packages/ 폴더에 Google.Protobuf.*.nupkg 확인

### "Cysharp.Threading.Tasks namespace not found"

→ UniTask 패키지 설치:
```
https://github.com/Cysharp/UniTask.git?path=src/UniTask/Assets/Plugins/UniTask
```

### "AitBridge.Generated namespace not found"

→ 생성된 코드 파일이 있는지 확인: `Assets/AIT-SDK/Generated/`
→ Unity Editor에서 Refresh (Cmd/Ctrl + R)


