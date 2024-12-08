import { useEffect } from "react";
import { MsgType, hasReactNativeWebview } from "@/utils/webView";
import { base64ToBlob } from "@/utils/audio";

/**
 * Rn에서 전달받은 메시지를 처리하는 핸들러
 */

interface CallbackProps {
  onStartRecording: () => void;
  onStopRecording: (url: string, ext?: string) => void;
  onPause: () => void;
  onResume: () => void;
  onTakePhoto: (photos: string[]) => void;
}

const useMsgFromRnHandler = (callback: CallbackProps) => {
  const handlerMsgFromRn = (event: any) => {
    const { type, data } = JSON.parse(event.data);
    console.log("🚀 ~ handlerMsgFromRn :", type, data);

    const {
      onStartRecording,
      onStopRecording,
      onPause,
      onResume,
      onTakePhoto,
    } = callback;

    switch (type as MsgType) {
      case "startRecording": {
        onStartRecording();
        break;
      }
      case "stopRecording": {
        const { audio, mimeType, ext } = data as {
          audio: string;
          mimeType: string;
          ext: string;
        };

        // 1. base64 => blob
        const blob = base64ToBlob(audio, mimeType);
        const url = URL.createObjectURL(blob);

        onStopRecording(url, ext);
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
      case "takePhoto": {
        onTakePhoto([data] as string[]);
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
