# Protocol Buffers for AIT Services

이 디렉토리는 Unity ↔ React 간 AIT SDK 서비스 통신을 위한 Protocol Buffer 정의를 포함합니다.

## 🎯 개요

WebView RPC를 사용하여 Unity와 React 간의 타입 안전한 통신을 구현합니다.

- **Unity**: C# 코드 자동 생성 → `unity/AIT-SDK-Project/Assets/Scripts/Generated/`
- **React**: JavaScript 코드 자동 생성 → `webapp/src/generated/`

## 📁 구조

```
proto/
├── README.md                      # 이 파일
├── protoc-gen-webviewrpc         # 코드 생성기 (macOS 실행 파일)
├── common.proto                   # 공통 타입 정의 (선택사항)
├── ait_openurl.proto             # OpenURL 서비스 정의
└── ait_payment.proto             # Payment 서비스 정의 (예시)
```

## 🚀 시작하기

### 1. protoc-gen-webviewrpc 설치

[Unity WebView RPC](https://github.com/kwan3854/Unity-WebViewRpc) 저장소에서 다운로드:

```bash
# macOS
curl -L -o proto/protoc-gen-webviewrpc https://github.com/kwan3854/Unity-WebViewRpc/releases/latest/download/protoc-gen-webviewrpc
chmod +x proto/protoc-gen-webviewrpc

# Windows
# protoc-gen-webviewrpc.exe를 다운로드하여 proto/ 폴더에 배치
```

### 2. Proto 파일 작성

예시: `ait_openurl.proto`

```protobuf
syntax = "proto3";

package ait;

option csharp_namespace = "AitBridge.Generated";

// Request 메시지
message OpenURLRequest {
  string url = 1;
}

// Response 메시지
message OpenURLResponse {
  bool success = 1;
}

// 서비스 정의
service OpenURLService {
  rpc OpenURL(OpenURLRequest) returns (OpenURLResponse);
}
```

### 3. 코드 생성 (로컬)

```bash
# 필요한 도구 설치
brew install protobuf
npm install -g pbjs

# 수동 생성
protoc \
  -Iproto \
  --csharp_out=unity/AIT-SDK-Project/Assets/Scripts/Generated/ \
  --plugin=protoc-gen-webviewrpc=proto/protoc-gen-webviewrpc \
  --webviewrpc_out=cs_client,cs_server:unity/AIT-SDK-Project/Assets/Scripts/Generated/ \
  proto/ait_openurl.proto

npx pbjs proto/ait_openurl.proto --es6 webapp/src/generated/OpenURLService.js
```

### 4. 자동 생성 (GitHub Actions)

`.proto` 파일을 수정하고 커밋하면 자동으로 코드가 생성됩니다:

```bash
git add proto/ait_openurl.proto
git commit -m "feat: add OpenURL proto definition"
git push
```

GitHub Actions가 자동으로:
1. C# 코드 생성 → `unity/AIT-SDK-Project/Assets/Scripts/Generated/`
2. JavaScript 코드 생성 → `webapp/src/generated/`
3. Unity .meta 파일 생성
4. 자동 커밋 및 푸시

## 📝 Proto 파일 작성 가이드

### 기본 구조

```protobuf
syntax = "proto3";

package ait;

option csharp_namespace = "AitBridge.Generated";

// Request
message [ServiceName]Request {
  // 필드 정의
  string param1 = 1;
  int32 param2 = 2;
}

// Response
message [ServiceName]Response {
  // 필드 정의
  bool success = 1;
  string data = 2;
}

// Service
service [ServiceName] {
  rpc [MethodName]([ServiceName]Request) returns ([ServiceName]Response);
}
```

### 네이밍 규칙

- **파일명**: `ait_[기능명].proto` (예: `ait_payment.proto`)
- **서비스명**: PascalCase (예: `PaymentService`)
- **메시지명**: PascalCase (예: `PaymentRequest`)
- **필드명**: snake_case (예: `product_id`)

### 타입 매핑

| Proto Type | C# Type | JavaScript Type |
|------------|---------|-----------------|
| `string` | `string` | `string` |
| `int32` | `int` | `number` |
| `int64` | `long` | `number` |
| `bool` | `bool` | `boolean` |
| `double` | `double` | `number` |
| `bytes` | `ByteString` | `Uint8Array` |
| `repeated` | `List<T>` | `Array<T>` |

## 🔧 사용 예시

### Unity (C#)

```csharp
using AitBridge.Generated;
using WebViewRPC;

public class MyScript : MonoBehaviour
{
    private WebViewRpcClient rpcClient;
    private OpenURLServiceClient openURLClient;
    
    void Start()
    {
        var bridge = new ReactUnityWebGLBridge();
        rpcClient = new WebViewRpcClient(bridge);
        openURLClient = new OpenURLServiceClient(rpcClient);
    }
    
    async void OpenWebsite()
    {
        var request = new OpenURLRequest { Url = "https://google.com" };
        var response = await openURLClient.OpenURL(request);
        
        if (response.Success)
        {
            Debug.Log("URL opened successfully!");
        }
    }
}
```

### React (JavaScript)

```typescript
import { ReactUnityBridge } from './bridge';
import { WebViewRpcServer } from 'app-webview-rpc';
import { OpenURLServiceBase } from './generated/OpenURLService';

// 서비스 구현
class OpenURLServiceImpl extends OpenURLServiceBase {
  async OpenURL(request) {
    try {
      await openURL(request.url); // AIT SDK
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

// 서버 시작
const bridge = new ReactUnityBridge(unityContext);
const rpcServer = new WebViewRpcServer(bridge);
const service = OpenURLService.bindService(new OpenURLServiceImpl());
rpcServer.services.push(service);
rpcServer.start();
```

## 🐛 문제 해결

### protoc-gen-webviewrpc 권한 오류

```bash
chmod +x proto/protoc-gen-webviewrpc
```

### GitHub Actions가 실행되지 않음

- `.proto` 파일을 수정했는지 확인
- `main`, `development`, `feature/**` 브랜치인지 확인
- Actions 탭에서 로그 확인

### Unity에서 생성된 코드가 인식 안됨

- Unity Editor에서 Refresh (Cmd/Ctrl + R)
- `.meta` 파일이 생성되었는지 확인
- `Assets/Scripts/Generated/` 폴더 확인

## 📚 참고 문서

- [Unity WebView RPC](https://github.com/kwan3854/Unity-WebViewRpc)
- [Protocol Buffers](https://developers.google.com/protocol-buffers)
- [gRPC Basics](https://grpc.io/docs/what-is-grpc/introduction/)

