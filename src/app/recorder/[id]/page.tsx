"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { Data, useDataContext } from "@/contexts/script";
import Tab from "@/components/Tab";
import Script from "@/components/Script";
import Summary from "@/components/Summary";

const RecordingDetailPage = () => {
  const params = useParams();
  const id = params.id;

  const { get, update } = useDataContext();
  const [data, setData] = useState<Data | null>(null);
  const [focusedTab, setFocusedTab] = useState<"script" | "summary">("script");

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

  const onPressScriptTab = useCallback(() => {
    setFocusedTab("script");
  }, []);
  const onPressSummaryTab = useCallback(() => {
    setFocusedTab("summary");
    onPressSummarize();
  }, []);

  const [isSummarizing, setIsSummarizing] = useState(false);
  const onPressSummarize = () => {
    const text = data?.text;

    if (!text || typeof id !== "string") {
      return;
    }

    setFocusedTab("summary");
    setIsSummarizing(true);

    try {
      fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result?.summary) {
            update({ id, summary: result.summary });
          } else {
            throw new Error("Summary is empty");
          }
        });
    } catch (error) {
      console.log("🚀 ~ onPressSummarize ~ error:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <Header title={"음성 기록"} />

      <div className="flex">
        <Tab
          title={"음성 기록"}
          focused={focusedTab === "script"}
          onClick={onPressScriptTab}
        />
        <Tab
          title={"요약"}
          focused={focusedTab === "summary"}
          onClick={onPressSummaryTab}
        />
      </div>

      <div className="flex-1 overflow-y-scroll overscroll-none">
        {focusedTab === "script" && !!data?.scripts && (
          <Script scripts={data.scripts} onPressSummarize={onPressSummarize} />
        )}

        {focusedTab === "summary" && (
          <Summary text={data?.summary} loading={isSummarizing} />
        )}
      </div>
    </div>
  );
};

export default RecordingDetailPage;
