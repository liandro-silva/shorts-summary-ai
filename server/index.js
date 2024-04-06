import cors from "cors";
import express from "express";
import { downloadVideo } from "./download-video.js";
import { convert } from "./convert-video.js";
import { transcribe } from "./transcribe-video.js";
import { summarize } from "./summarize-video.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/summary/:id", async (req, res) => {
  try {
    await downloadVideo(req.params.id);
    const audioConverted = await convert();
    const result = await transcribe(audioConverted);

    return res.json({ result });
  } catch (error) {
    console.log(error);
    return res.json({ error });
  }
});

app.post("/summary", async (request, response) => {
  try {
    const result = await summarize(request.body.text);

    return response.json({ result });
  } catch (error) {
    console.log(error);
    return response.json({ error });
  }
});

app.listen(3333, () => {
  console.log("Server is running on port 3333");
});
