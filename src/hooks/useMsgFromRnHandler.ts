import { useEffect } from "react";
import { MsgType, hasReactNativeWebview } from "@/utils/webView";

/**
 * Rn에서 전달받은 메시지를 처리하는 핸들러
 */

interface CallbackProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPause: () => void;
  onResume: () => void;
  onSave: () => void;
}

const useMsgFromRnHandler = (callback: CallbackProps) => {
  const handlerMsgFromRn = (event: any) => {
    const { type, data } = JSON.parse(event.data);
    console.log("🚀 ~ handlerMsgFromRn :", type, data);

    const { onStartRecording, onStopRecording, onPause, onResume, onSave } =
      callback;

    switch (type as MsgType) {
      case "startRecording": {
        onStartRecording();
        break;
      }
      case "stopRecording": {
        onStopRecording();
        break;
      }
      case "pauseRecording": {
        onPause();
        break;
      }
      case "resumeRecording": {
        onResume();
        break;
      }
      case "saveRecording": {
        onSave();
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    if (hasReactNativeWebview) {
      const listenerType = "message";

      window.addEventListener(listenerType, handlerMsgFromRn);
      document.addEventListener(listenerType, handlerMsgFromRn);

      return () => {
        window.removeEventListener(listenerType, handlerMsgFromRn);
        document.removeEventListener(listenerType, handlerMsgFromRn);
      };
    }
  }, [hasReactNativeWebview]);
};

export default useMsgFromRnHandler;
