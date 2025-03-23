export type MsgType =
  | "startRecording"
  | "pauseRecording"
  | "resumeRecording"
  | "stopRecording"
  | "openCamera"
  | "takePhoto"
  | "loadDatabase"
  | "saveDatabase";

export const postMsgToRn = ({ type, data }: { type: MsgType; data?: any }) => {
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ type, data }));
  }
};

export const hasReactNativeWebview =
  typeof window !== "undefined" && !!window.ReactNativeWebView;
