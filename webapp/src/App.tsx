import { Unity, useUnityContext } from "react-unity-webgl";
// 앱인토스(AIT) SDK에서 Safe Area 값을 가져오는 함수를 import 합니다.
import { getSafeAreaInsets } from "@apps-in-toss/web-framework";
// 2. 방금 분리한 '브릿지 로직' 훅을 import 합니다.
import { useAitBridge } from "./hooks/useAitBridge";

function App() {
  // 3. useUnityContext에서 provider와 *나머지 컨텍스트*를 분리합니다.
  const { 
    unityProvider, 
    ...unityContext // (sendMessage, addEventListener 등)
  } = useUnityContext({
    // (Unity 빌드가 완료되면) 적절한 파일 경로와 이름으로 수정하세요.
    loaderUrl: "unity-build/mygame.loader.js",
    dataUrl: "unity-build/mygame.data",
    frameworkUrl: "unity-build/mygame.framework.js",
    codeUrl: "unity-build/mygame.wasm",
  });

  // 4. 브릿지 훅을 호출하고, Unity 컨텍스트를 넘겨줍니다.
  // 이 한 줄이 모든 통신(openURL 등)을 활성화시킵니다.
  useAitBridge(unityContext);

  // AIT SDK가 현재 기기의 상단(상태바)과 하단(홈 인디케이터)의
  // 여백(px)을 반환합니다. (예: { top: 44, bottom: 34 })
  const insets = getSafeAreaInsets();

  // --- Safe Area를 고려한 전체 화면 ---
  // 100vh(전체 높이) 크기의 컨테이너를 만들고,
  // AIT SDK가 알려준 'insets' 값을 padding(안쪽 여백)으로 적용합니다.
  // Unity 컴포넌트는 그 안에서 100%를 채웁니다.
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      // 'boxSizing'은 패딩 값을 높이에 포함시켜 100vh를 넘지 않게 합니다. (중요)
      boxSizing: 'border-box', 
      paddingTop: `${insets.top}px`,
      paddingBottom: `${insets.bottom}px`,
      // Unity WebGL의 기본 배경색이 흰색일 수 있으므로,
      // 여백(letterbox) 영역의 색상을 검은색 등으로 지정해주는 것이 좋습니다.
      backgroundColor: '#000000' 
    }}>
      <Unity 
        unityProvider={unityProvider} 
        // 부모 div(Safe Area가 적용된)의 100%를 채웁니다.
        style={{ width: '100%', height: '100%' }} 
      />
    </div>
  );
}

export default App;