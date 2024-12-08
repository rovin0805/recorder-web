"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { Data, useDataContext } from "@/contexts/script";

const Photo = () => {
  const { id } = useParams();
  const { get } = useDataContext();
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    if (typeof id === "string") {
      const document = get({ id });
      if (document != null) {
        setData(document);
        return;
      } else {
        console.error("Cannot load data");
      }
    }
  }, [get, id]);

  return (
    <div className="h-screen bg-white flex flex-col">
      <Header title={"사진 기록"} />
      <div className="flex-1 overflow-y-scroll overscroll-none px-[11px] py-[6px]">
        <div className="grid grid-cols-3 gap-[7px]">
          {data?.photos != null &&
            data.photos.map((photo, index) => {
              return (
                <Image
                  className="aspect-square object-cover w-full"
                  key={photo}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  width={0}
                  height={0}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Photo;
