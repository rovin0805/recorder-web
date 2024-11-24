type ReturnData = {
  transcription: {
    text: string;
    segments: { start: number; end: number; text: string }[];
  };
};

export const fetchTranscription = async ({
  url,
  ext,
}: {
  url: string;
  ext: string;
}) => {
  try {
    const res = await fetch(url);
    const audioBlob = await res.blob();

    const formData = new FormData();
    formData.append("file", audioBlob, `recording.${ext}`);

    const transRes = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
    const data = (await transRes.json()) as ReturnData;

    return data;
  } catch (error) {}
};
