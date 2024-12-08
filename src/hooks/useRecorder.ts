import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useTimer from "./useTimer";
import { fetchTranscription } from "@/api/transcription";
import { useDataContext } from "@/contexts/script";
import useMsgFromRnHandler from "./useMsgFromRnHandler";
import { hasReactNativeWebview, postMsgToRn } from "@/utils/webView";

type MicStatus = "idle" | "recording" | "paused";

const FILE_EXT = "webm";

const useRecorder = () => {
  const router = useRouter();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkRef = useRef<Blob[]>([]);

  const [micStatus, setMicStatus] = useState<MicStatus>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [photos, setPhotos] = useState<string[]>([]);

  const { create } = useDataContext();
  const { timeInSec, setTimeInSec, startTimer, stopTimer } = useTimer();

  const onStartRecording = () => {
    setTimeInSec(0);
    setAudioUrl(null);
    startTimer();
    setMicStatus("recording");
  };

  const transcribeAudio = async (url: string, ext: string = FILE_EXT) => {
    try {
      const res = await fetchTranscription({ url, ext });
      if (res) {
        const id = `${Date.now()}`;
        create({
          id,
          text: res.transcription.text,
          scripts: res.transcription.segments.map((segment) => ({
            start: segment.start,
            end: segment.end,
            text: segment.text.trim(),
          })),
          photos,
        });
        router.push(`/recorder/${id}`);
      }
    } catch (error) {
      console.log("🚀 ~ transcribeAudio ~ error:", error);
      alert("음성 파일 변환에 실패했습니다.");
    }
  };

  const onStopRecording = (url: string, ext?: string) => {
    setAudioUrl(url);
    stopTimer();
    setMicStatus("idle");
    transcribeAudio(url, ext);
  };

  const onPressRecord = () => {
    if (hasReactNativeWebview) {
      postMsgToRn({ type: "startRecording" });
      return;
    }

    window.navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: `audio/${FILE_EXT}`,
        });

        mediaRecorderRef.current = mediaRecorder;

        // mediaRecorder.start = () => {
        //   console.log(mediaRecorder.state);
        //   onStartRecording();
        // };

        mediaRecorder.ondataavailable = (event) => {
          chunkRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunkRef.current, {
            type: chunkRef.current[0].type,
          });
          const url = URL.createObjectURL(blob);
          chunkRef.current = [];
          onStopRecording(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        /**
         * mediaRecorder.start()는 녹음을 시작하는 내장 메서드입니다.
         * 이를 오버라이드하면서 기본 녹음 동작이 실행되지 않았습니다.
         */
        mediaRecorder.start();
        onStartRecording();
      });
  };

  const onPressPause = () => {
    if (hasReactNativeWebview) {
      postMsgToRn({ type: "pauseRecording" });
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.pause();
    }
    setMicStatus("paused");
    stopTimer();
  };

  const onPressResume = () => {
    if (hasReactNativeWebview) {
      postMsgToRn({ type: "resumeRecording" });
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "paused"
    ) {
      mediaRecorderRef.current.resume();
    }
    setMicStatus("recording");
    startTimer();
  };

  const onPressSave = () => {
    if (hasReactNativeWebview) {
      postMsgToRn({ type: "stopRecording" });
      return;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setMicStatus("idle");
    stopTimer();
  };

  const onClickMic = () => {
    switch (micStatus) {
      case "idle": {
        onPressRecord();
        break;
      }
      case "recording": {
        onPressPause();
        break;
      }
      case "paused": {
        onPressResume();
        break;
      }
      default: {
        break;
      }
    }
  };

  useMsgFromRnHandler({
    onStartRecording,
    onStopRecording: (url, etx) => {
      onStopRecording(url, etx);
    },
    onPause: () => {
      setMicStatus("paused");
      stopTimer();
    },
    onResume: () => {
      setMicStatus("recording");
      startTimer();
    },
    onTakePhoto: (photo) => {
      setPhotos((prev) => prev.concat(photo));
    },
  });

  return {
    micStatus,
    audioUrl,
    timeInSec,
    onClickMic,
    onPressPause,
    onPressResume,
    onPressSave,
  };
};

export default useRecorder;
