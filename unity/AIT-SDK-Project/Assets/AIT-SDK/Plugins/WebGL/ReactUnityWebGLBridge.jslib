mergeInto(LibraryManager.library, {
  dispatchReactUnityEvent: function (eventName, payload) {
    if (window.dispatchReactUnityEvent) {
      window.dispatchReactUnityEvent(Pointer_stringify(eventName), Pointer_stringify(payload));
    } else {
      console.warn("window.dispatchReactUnityEvent is not defined. Make sure you are running in a react-unity-webgl context.");
    }
  }
});