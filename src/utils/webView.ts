export type MsgType =
  | "startRecording"
  | "pauseRecording"
  | "resumeRecording"
  | "stopRecording";

export const postMsgToRn = ({ type, data }: { type: MsgType; data?: any }) => {
  window.ReactNativeWebView?.postMessage(JSON.stringify({ type, data }));
};

export const hasReactNativeWebview =
  window !== undefined && !!window.ReactNativeWebView;
