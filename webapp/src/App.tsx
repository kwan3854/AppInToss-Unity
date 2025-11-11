import { Unity, useUnityContext } from "react-unity-webgl";
// WebView RPC hook for Unity ↔ React communication
import { useWebViewRpc } from "./hooks/useWebViewRpc";
import { useEffect, useState } from "react";
import { setScreenAwakeMode } from "@apps-in-toss/web-framework";

function App() {
  // 3. useUnityContext에서 provider와 *나머지 컨텍스트*를 분리합니다.
  const { 
    unityProvider, 
    isLoaded,
    loadingProgression,
    ...unityContext // (sendMessage, addEventListener 등)
  } = useUnityContext({
    // (Unity 빌드가 완료되면) 적절한 파일 경로와 이름으로 수정하세요.
    loaderUrl: "assets/AIT-SDK-Test.loader.js",
    dataUrl: "  assets/AIT-SDK-Test.data.unityweb",
    frameworkUrl: "assets/AIT-SDK-Test.framework.js.unityweb",
    codeUrl: "assets/AIT-SDK-Test.wasm.unityweb",
  });

  // We'll use a state to store the device pixel ratio.
  const [devicePixelRatio, setDevicePixelRatio] = useState(
    window.devicePixelRatio
  );

  useEffect(
    function () {
      // A function which will update the device pixel ratio of the Unity
      // Application to match the device pixel ratio of the browser.
      const updateDevicePixelRatio = function () {
        setDevicePixelRatio(window.devicePixelRatio);
      };
      // A media matcher which watches for changes in the device pixel ratio.
      const mediaMatcher = window.matchMedia(
        `screen and (resolution: ${devicePixelRatio}dppx)`
      );
      // Adding an event listener to the media matcher which will update the
      // device pixel ratio of the Unity Application when the device pixel
      // ratio changes.
      mediaMatcher.addEventListener("change", updateDevicePixelRatio);
      return function () {
        // Removing the event listener when the component unmounts.
        mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
      };
    },
    [devicePixelRatio]
  );

  // We'll round the loading progression to a whole number to represent the
  // percentage of the Unity Application that has loaded.
  const loadingPercentage = Math.round(loadingProgression * 100);

  // Initialize WebView RPC server
  // This enables Unity to call AIT SDK functions via RPC
  useWebViewRpc(unityContext, isLoaded, "AitRpcBridge");

  // 화면 항상 켜짐 모드 설정 (게임은 화면이 항상 켜져있어야 함)
  setScreenAwakeMode({ enabled: true });

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      // 'boxSizing'은 패딩 값을 높이에 포함시켜 100vh를 넘지 않게 합니다. (중요)
      boxSizing: 'border-box', 
      // Unity WebGL의 기본 배경색이 흰색일 수 있으므로,
      // 여백(letterbox) 영역의 색상을 검은색 등으로 지정해주는 것이 좋습니다.
      backgroundColor: '#000000',
      position: 'relative',
    }}>
      {isLoaded === false && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontSize: '24px',
        }}>
          <p>Loading... ({loadingPercentage}%)</p>
        </div>
      )}
      <Unity 
        unityProvider={unityProvider} 
        // 부모 div(Safe Area가 적용된)의 100%를 채웁니다.
        style={{ width: '100%', height: '100%' }} 
        devicePixelRatio={devicePixelRatio}
      />
    </div>
  );
}

export default App;