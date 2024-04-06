import { server } from "./server";

const appContainer = document.querySelector("#app");

const form = appContainer.querySelector("form");
const input = appContainer.querySelector("#url");
const title = appContainer.querySelector("#summary-title");
const content = appContainer.querySelector("#summary-content");
const helper = appContainer.querySelector("#helper-text");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const videoURL = input.value;

  if (isValidURL(videoURL)) {
    let videoId = sanitizeURL(videoURL);

    title.classList.add("loading");
    content.classList.add("loading");

    const transcription = await server.get(`/summary/${videoId}`);

    const summary = await server.post("/summary", {
      text: transcription.data.result,
    });

    title.classList.remove("loading");
    content.classList.remove("loading");
    title.textContent = "Summary";
    content.textContent = summary.data.result;
  } else {
    title.classList.remove("loading");
    content.classList.remove("loading");
    title.textContent = null;
    content.textContent = null;
  }
});

input.addEventListener("change", (event) => {
  if (event.target.value === "") {
    return (input.value = "");
  }
});

function isValidURL(videoURL) {
  if (!videoURL.includes("shorts")) {
    helper.textContent =
      "This video is not a youtube shorts video, please check the URL";
    input.style.outline = "2px solid var(--alert)";
    form.style.paddingBottom = "16px";

    return false;
  } else {
    helper.textContent = null;
    input.style.outline = null;
    form.style.paddingBottom = null;

    return true;
  }
}

function sanitizeURL(videoURL) {
  const [_, params] = videoURL.split("/shorts/");

  if (videoURL.includes("?")) {
    let videoId;
    return (videoId = params.split("?")[0]);
  } else {
    return params;
  }
}
