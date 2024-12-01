import { NextResponse } from "next/server";
import openai from "@/utils/openAi";

export async function POST(req: Request) {
  try {
    // Request에서 JSON 데이터를 받기
    const { text } = await req.json();

    // OpenAI API 호출
    const data = await openai.chat.completions.create({
      model: "gpt-4o", // 모델 이름이 올바른지 확인 필요
      messages: [
        {
          role: "user",
          content: `아래 내용을 세 줄 이내로 요약해줘 :\n\n${text}`,
        },
      ],
    });

    // 요약 결과
    const summary = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("⚠️ Summarize error", error);
    return NextResponse.json({ error: "Summarize error" }, { status: 500 });
  }
}

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   try {
//     const { text } = req.body;
//     const data = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           role: "user",
//           content: `아래 내용을 세 줄 이내로 요약해줘 :\n\n${text}`,
//         },
//       ],
//     });
//     const summary = data?.choices?.[0]?.message?.content?.trim();
//     return res.status(200).json({ summary });
//   } catch (error) {
//     console.error("⚠️ Summarize error", error);
//     return res.status(500).json({ error: "Summarize error" });
//   }
// };

// export default handler;
