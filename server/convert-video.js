import fs from "fs";
import wav from "node-wav";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

const filePath = "./tmp/audio.mp4";
const outputPath = filePath.replace(".mp4", ".wav");

export const convert = () =>
  new Promise((resolve, reject) => {
    console.log("Converting video...");

    ffmpeg.setFfmpegPath(ffmpegStatic);
    ffmpeg()
      .input(filePath)
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => {
        const file = fs.readFileSync(outputPath);
        const fileDecoded = wav.decode(file);
        console.log("🚀 ~ .on ~ fileDecoded:", fileDecoded);

        const audioData = fileDecoded.channelData[0];
        console.log("🚀 ~ .on ~ audioData:", audioData);
        const floatArray = new Float32Array(audioData);

        console.log("Video converted!");

        resolve(floatArray);
        fs.unlinkSync(outputPath);
      })
      .on("error", (error) => {
        console.log("Erro ao converter", error);
        reject(error);
      })
      .save(outputPath);
  });
