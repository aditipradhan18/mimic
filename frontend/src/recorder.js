let screenRecorder = null;
let audioRecorder = null;

let screenChunks = [];
let audioChunks = [];

let screenStream = null;
let audioStream = null;

let recordingStart = null;

export async function startRecording() {
  if (screenRecorder || audioRecorder) {
    throw new Error("Recording is already active.");
  }

  screenChunks = [];
  audioChunks = [];

  recordingStart = Date.now();

  // Ask the user to choose a screen, window, or browser tab.
  screenStream =
    await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: 15,
      },
      audio: false,
    });

  // Ask for microphone access.
  audioStream =
    await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

  const videoMimeType =
    MediaRecorder.isTypeSupported(
      "video/webm;codecs=vp9"
    )
      ? "video/webm;codecs=vp9"
      : "video/webm";

  const audioMimeType =
    MediaRecorder.isTypeSupported(
      "audio/webm;codecs=opus"
    )
      ? "audio/webm;codecs=opus"
      : "audio/webm";

  screenRecorder = new MediaRecorder(
    screenStream,
    {
      mimeType: videoMimeType,
    }
  );

  audioRecorder = new MediaRecorder(
    audioStream,
    {
      mimeType: audioMimeType,
    }
  );

  screenRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      screenChunks.push(event.data);
    }
  };

  audioRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioChunks.push(event.data);
    }
  };

  screenRecorder.start(1000);
  audioRecorder.start(1000);

  // If the user stops screen sharing
  // from the browser's sharing controls.
  screenStream
    .getVideoTracks()[0]
    .addEventListener("ended", () => {
      if (
        screenRecorder?.state === "recording"
      ) {
        stopRecording();
      }
    });

  return {
    startedAt: recordingStart,
  };
}

export function stopRecording() {
  return new Promise((resolve) => {
    if (!screenRecorder || !audioRecorder) {
      resolve(null);
      return;
    }

    const screenRecorderRef =
      screenRecorder;

    const audioRecorderRef =
      audioRecorder;

    const finish = () => {
      const screenBlob = new Blob(
        screenChunks,
        {
          type: "video/webm",
        }
      );

      const audioBlob = new Blob(
        audioChunks,
        {
          type: "audio/webm",
        }
      );

      const result = {
        screenBlob,
        audioBlob,
        duration:
          Date.now() - recordingStart,
      };

      cleanup();

      resolve(result);
    };

    let screenStopped = false;
    let audioStopped = false;

    const checkFinished = () => {
      if (
        screenStopped &&
        audioStopped
      ) {
        finish();
      }
    };

    screenRecorderRef.addEventListener(
      "stop",
      () => {
        screenStopped = true;
        checkFinished();
      },
      {
        once: true,
      }
    );

    audioRecorderRef.addEventListener(
      "stop",
      () => {
        audioStopped = true;
        checkFinished();
      },
      {
        once: true,
      }
    );

    if (
      screenRecorderRef.state !==
      "inactive"
    ) {
      screenRecorderRef.stop();
    } else {
      screenStopped = true;
    }

    if (
      audioRecorderRef.state !==
      "inactive"
    ) {
      audioRecorderRef.stop();
    } else {
      audioStopped = true;
    }

    checkFinished();
  });
}

function cleanup() {
  if (screenStream) {
    screenStream
      .getTracks()
      .forEach((track) => track.stop());
  }

  if (audioStream) {
    audioStream
      .getTracks()
      .forEach((track) => track.stop());
  }

  screenRecorder = null;
  audioRecorder = null;

  screenStream = null;
  audioStream = null;

  recordingStart = null;
}

export function downloadBlob(
  blob,
  filename
) {
  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  link.remove();

  URL.revokeObjectURL(url);
}