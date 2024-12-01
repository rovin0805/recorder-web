import { NextResponse } from "next/server";
import fs from "fs";
import openai from "@/utils/openAi";

export const config = {
  api: {
    bodyParser: false,
  },
};

// /**
//  * Input : audio
//  * Open AI : audio -> text
//  * Output : text
//  */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // 파일을 임시 디렉토리에 저장
    const tempFilePath = `/tmp/${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(tempFilePath, fileBuffer);

    // OpenAI에 파일을 전송하여 텍스트로 변환
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-1",
      language: "ko",
      response_format: "verbose_json",
    });

    // 처리 후 임시 파일 삭제
    fs.unlinkSync(tempFilePath);

    // 결과 반환
    return NextResponse.json({ transcription });
  } catch (error) {
    console.error("⚠️ transcribe POST Error:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

// page router
// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === "POST") {
//     const form = formidable({ keepExtensions: true });
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ error: "Form parsing error" });
//     }

//     const file = files.file?.[0];

//     if (!file) {
//       console.error("⚠️ File not found");
//       return res.status(500).json({ error: "File not found" });
//     }

//     try {
//       const transcription = await openai.audio.transcriptions.create({
//         file: fs.createReadStream(file.filepath),
//         model: "whisper-1",
//         language: "ko",
//         response_format: "verbose_json",
//       });
//       console.log("🚀 ~ form.parse ~ transcription:", transcription);
//       return res.status(200).json({ transcription });
//     } catch (error) {
//       console.error("⚠️ OpenAI error", error);
//       return res.status(500).json({ error: "OpenAI error" });
//     } finally {
//       fs.unlinkSync(file.filepath);
//     }
//   });
// } else {
//   return res.status(405).json({ message: "Method Not Allowed" });
// }
// };

// export default handler;
