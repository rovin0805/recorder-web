"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Data, useDataContext } from "@/contexts/script";
import Button from "@/components/Button";

export default function Home() {
  const router = useRouter();
  const [recordings, setRecordings] = useState<Data[]>([]);

  const { getAll } = useDataContext();
  useEffect(() => {
    setRecordings(getAll());
  }, [getAll]);

  return (
    <div className="h-screen bg-[#F6F6F9] relative flex">
      <div className="flex flex-col gap-[13px] overflow-y-scroll p-[16px] w-full">
        {recordings.map((recording) => {
          const { id, text, createdAt } = recording;
          const createdAtString = new Date(createdAt).toLocaleString();
          return (
            <div
              key={id}
              className="h-[96px] bg-[#FFFFFF] flex flex-row items-center px-[14px] py-[18px] rounded-[10px]"
              onClick={() => {
                router.push(`/recorder/${id}`);
              }}
            >
              <div className="mr-[14px]">
                <div className="w-[28px] h-[28px] rounded-[14px] bg-[#09CC7F] items-center justify-center flex">
                  <span className="material-icons text-[#FFFFFF] !text-[18px]">
                    mic
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <p className="truncate text-[#636366] text-[14px]">{text}</p>
                <p
                  className="mt-[8px] text-[#848487] text-[13px]"
                  suppressHydrationWarning
                >
                  {createdAtString}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        iconName="mic"
        text="녹음하기"
        onClick={() => {
          router.push("/recorder");
        }}
        buttonStyle="absolute bottom-4 right-4"
      />
    </div>
  );
}
