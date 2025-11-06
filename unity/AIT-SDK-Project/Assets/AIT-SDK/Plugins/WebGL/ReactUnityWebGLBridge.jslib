mergeInto(LibraryManager.library, {
  dispatchReactUnityEvent: function (eventName, payload) {
    if (window.dispatchReactUnityEvent) {
      window.dispatchReactUnityEvent(UTF8ToString(eventName), UTF8ToString(payload));
    } else {
      console.warn("window.dispatchReactUnityEvent is not defined. Make sure you are running in a react-unity-webgl context.");
    }
  }
});