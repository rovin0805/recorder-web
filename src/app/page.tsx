"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();
  const onClickRecorder = () => {
    router.push("/recorder");
  };

  return (
    <div className="h-screen bg-[#f6f6f6] relative">
      <Button
        iconName="mic"
        text="녹음하기"
        onClick={onClickRecorder}
        buttonStyle="absolute bottom-4 right-4"
      />
    </div>
  );
}
