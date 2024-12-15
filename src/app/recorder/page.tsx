"use client";

import Header from "@/components/Header";
import Button from "@/components/Button";
import ToastMsg from "@/components/ToastMsg";
import useRecorderPhoto from "@/hooks/useRecorderPhoto";
import useToast from "@/hooks/useToastMsg";
import { formatTime } from "@/utils/formatStr";
import { hasReactNativeWebview, postMsgToRn } from "@/utils/webView";

export default function RecorderPage() {
  const {
    micStatus,
    audioUrl,
    timeInSec,
    onClickMic,
    onPressPause,
    onPressResume,
    onPressSave,
  } = useRecorderPhoto();

  const { isToastVisible, showToastMsg } = useToast();

  const renderMicIcon = () => {
    switch (micStatus) {
      case "paused": {
        return (
          <span className="material-icons text-white text-[70px]">pause</span>
        );
      }
      case "recording":
      case "idle": {
        return (
          <span
            className={`material-icons ${
              micStatus === "idle" ? "text-white" : "text-green-400"
            } text-[70px]`}
          >
            mic
          </span>
        );
      }
      default: {
        return (
          <span className="material-icons text-white text-[70px]">report</span>
        );
      }
    }
  };

  const onPressCamera = () => {
    postMsgToRn({ type: "openCamera" });
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <Header
        title="녹음하기"
        renderRight={() => {
          if (!hasReactNativeWebview) {
            return <></>;
          }
          return (
            <button className="mr-[16px]" onClick={onPressCamera}>
              <span className="material-icons text-[#8E8E93] text-[30px]">
                photo_camera
              </span>
            </button>
          );
        }}
      />

      <div className="flex flex-1 flex-col justify-center items-center">
        <button
          className="bg-black rounded-full w-[120px] h-[120px]"
          onClick={onClickMic}
        >
          {renderMicIcon()}
        </button>

        {audioUrl && (
          <audio controls className="mt-3">
            <source src={audioUrl} type="audio/webm" />
          </audio>
        )}

        <span className="text-xl my-8">{formatTime(timeInSec)}</span>

        <div>
          {micStatus === "recording" && (
            <Button
              iconName="pause"
              text="일시정지"
              onClick={onPressPause}
              buttonStyle="mb-4"
            />
          )}

          {micStatus === "paused" && (
            <Button
              iconName="play_arrow"
              text="계속하기"
              onClick={onPressResume}
              buttonStyle="mb-4"
            />
          )}

          {micStatus !== "idle" && (
            <Button
              iconName="check"
              text="저장하기"
              onClick={() => {
                onPressSave();
                showToastMsg();
              }}
              buttonStyle="bg-green-400"
            />
          )}
        </div>
      </div>

      <ToastMsg
        message="저장이 완료되었습니다."
        type="success"
        isVisible={isToastVisible}
      />
    </div>
  );
}
