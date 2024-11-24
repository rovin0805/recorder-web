import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import openai from "@/utils/openAi";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Input : audio
 * Open AI : audio -> text
 * Output : text
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const form = formidable({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: "Form parsing error" });
      }

      const file = files.file?.[0];

      if (!file) {
        console.error("⚠️ File not found");
        return res.status(500).json({ error: "File not found" });
      }

      try {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(file.filepath),
          model: "whisper-1",
          language: "ko",
          response_format: "verbose_json",
        });
        console.log("🚀 ~ form.parse ~ transcription:", transcription);
        return res.status(200).json({ transcription });
      } catch (error) {
        console.error("⚠️ OpenAI error", error);
        return res.status(500).json({ error: "OpenAI error" });
      } finally {
        fs.unlinkSync(file.filepath);
      }
    });
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
