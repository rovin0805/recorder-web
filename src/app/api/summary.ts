import { NextApiRequest, NextApiResponse } from "next";
import openai from "@/utils/openAi";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { text } = req.body;
    const data = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `아래 내용을 세 줄 이내로 요약해줘 :\n\n${text}`,
        },
      ],
    });
    const summary = data?.choices?.[0]?.message?.content?.trim();
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("⚠️ Summarize error", error);
    return res.status(500).json({ error: "Summarize error" });
  }
};

export default handler;
