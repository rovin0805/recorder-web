import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useTimer from "./useTimer";
import { fetchTranscription } from "@/api/transcription";
import { useDataContext } from "@/contexts/script";

type MicStatus = "idle" | "recording" | "paused";

const FILE_EXT = "webm";

const useRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkRef = useRef<Blob[]>([]);

  const [micStatus, setMicStatus] = useState<MicStatus>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const { timeInSec, setTimeInSec, startTimer, stopTimer } = useTimer();

  const onStartRecording = () => {
    setTimeInSec(0);
    setAudioUrl(null);
    startTimer();
    setMicStatus("recording");
  };

  const { create } = useDataContext();
  const router = useRouter();
  const handleScript = async (url: string) => {
    const res = await fetchTranscription({ url, ext: FILE_EXT });
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
      });
      router.push(`/recorder/${id}`);
    }
  };

  const onStopRecording = (url: string) => {
    setAudioUrl(url);
    stopTimer();
    setMicStatus("idle");
    handleScript(url);
  };

  const onPressRecord = () => {
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
        setMicStatus("recording");
      });
  };

  const onPressPause = () => {
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
