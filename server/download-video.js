import ytdl from "ytdl-core";
import fs from "fs";

export const downloadVideo = (id) => {
  const url = `https://www.youtube.com/shorts/${id}`;
  console.log(`${id}`);

  new Promise((resolve, reject) => {
    ytdl(url, {
      quality: "lowestaudio",
      filter: "audioonly",
    })
      .on("info", (info) => {
        const seconds = parseInt(info.formats[0].approxDurationMs / 1000, 10);
        if (seconds > 60) {
          throw new Error(
            "This video is higher than 60 seconds and cannot be transcripted because this application accepts only short video formats"
          );
        }
      })
      .on("end", () => {
        console.log(`This video has been downloaded`);
        resolve();
      })
      .on("error", (error) => {
        console.log("This video has not been downloaded");
        reject(error);
      })
      .pipe(fs.createWriteStream(`./tmp/audio.mp4`));
  });
};
