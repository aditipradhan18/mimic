import { useState, useEffect, useRef } from "react";
import { startRecording, stopRecording, downloadBlob } from "../../recorder";
import { logEvent, getEvents } from "../../eventLogger";

const API_BASE = "http://127.0.0.1:8000";

export function ExpertCaptureOverlay({ isOpen, onClose }) {
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState("");
  const [lastCapture, setLastCapture] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [eventList, setEventList] = useState(() =>
    getEvents().slice(-25).reverse()
  );

  const timerRef = useRef(null);

  useEffect(() => {
    const handleCustomEvent = (e) => {
      const newEv = e.detail;
      setEventList((prev) => [newEv, ...prev.slice(0, 35)]);
    };

    window.addEventListener("mimic:event", handleCustomEvent);

    return () => {
      window.removeEventListener("mimic:event", handleCustomEvent);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const createBackendSession = async () => {
    const response = await fetch(`${API_BASE}/api/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_type: "expert_demonstration",
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend session creation failed (${response.status})`);
    }

    return response.json();
  };

  const handleStart = async () => {
    if (recording) return;

    setRecordingError("");

    try {
      logEvent("DEMONSTRATION_START_REQUESTED");

      // 1. Create backend session first
      const session = await createBackendSession();

      setSessionId(session.session_id);

      logEvent("BACKEND_SESSION_CREATED", {
        sessionId: session.session_id,
      });

      // 2. Start the existing real screen + microphone recorder
      await startRecording();

      setRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      logEvent("DEMONSTRATION_RECORDING_STARTED", {
        sessionId: session.session_id,
      });
    } catch (err) {
      console.error("[MIMIC] Start capture error:", err);

      setRecording(false);
      setSessionId(null);

      setRecordingError(
        err?.message ||
          "Failed to create session or access screen/microphone."
      );

      logEvent("DEMONSTRATION_RECORDING_ERROR", {
        message: err?.message || "Unknown error",
      });
    }
  };

  const handleStop = async () => {
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const result = await stopRecording();
      const currentEvents = getEvents();

      setRecording(false);

      if (result) {
        downloadBlob(
          result.screenBlob,
          "mimic-expert-screen.webm"
        );

        downloadBlob(
          result.audioBlob,
          "mimic-expert-voice.webm"
        );

        setLastCapture({
          duration: result.duration,
          formatted: formatTime(
            Math.round(result.duration / 1000)
          ),
          count: currentEvents.length,
          time: new Date().toLocaleTimeString(),
        });

        logEvent("DEMONSTRATION_RECORDING_STOPPED", {
          sessionId,
          duration: result.duration,
          eventCount: currentEvents.length,
        });
      }
    } catch (err) {
      console.error("[MIMIC] Stop capture error:", err);

      setRecording(false);

      setRecordingError(
        err?.message || "Failed to finalize recording."
      );

      logEvent("DEMONSTRATION_STOP_ERROR", {
        sessionId,
        message: err?.message || "Unknown error",
      });
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");

    const s = (secs % 60)
      .toString()
      .padStart(2, "0");

    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  const totalEventCount = getEvents().length;

  return (
    <div className="workspace-overlay-backdrop">
      <div className="workspace-overlay-shell">

        <div className="workspace-top-bar">
          <div className="workspace-header-info">
            <span className="workspace-mode-tag">
              EXPERT CAPTURE STUDIO
            </span>

            <h2 className="workspace-title">
              Demonstration Recording Session
            </h2>

            {sessionId && (
              <div className="workspace-session-id">
                SESSION&nbsp;&nbsp;{sessionId}
              </div>
            )}
          </div>

          <button
            className="btn-workspace-close"
            onClick={onClose}
            aria-label="Close studio"
          >
            ✕ CLOSE
          </button>
        </div>

        <div className="workspace-content-body">

          <div className="capture-action-banner">
            <div className="banner-left">

              <span className="banner-status-tag">
                {recording
                  ? "RECORDING ACTIVE"
                  : "ENGINE READY"}
              </span>

              <p className="banner-instruction">
                {recording
                  ? "Demonstration underway. Perform your workflow and speak your reasoning aloud."
                  : "Click below to begin capturing your screen, voice narration, and interaction trace."}
              </p>

            </div>

            <div className="banner-controls">

              {!recording ? (
                <button
                  className="btn-hero-primary large"
                  onClick={handleStart}
                >
                  <span className="rec-dot-icon" />
                  <span className="btn-label">
                    START EXPERT CAPTURE
                  </span>
                  <span className="btn-arrow">
                    →
                  </span>
                </button>
              ) : (
                <button
                  className="btn-danger-capture"
                  onClick={handleStop}
                >
                  <span className="stop-square-icon" />
                  <span>
                    STOP & SAVE DEMONSTRATION
                  </span>
                </button>
              )}

            </div>
          </div>

          {recordingError && (
            <div className="capture-error-box">
              <span>⚠ {recordingError}</span>
            </div>
          )}

          <div className="capture-telemetry-grid">

            <div
              className={`telemetry-card ${
                recording ? "active" : ""
              }`}
            >
              <span className="telemetry-card-title">
                SCREEN CAPTURE
              </span>

              <div className="telemetry-val-row">
                <span className="telemetry-dot" />

                <span className="telemetry-state-text">
                  {recording
                    ? "Recording (15fps)"
                    : "Idle"}
                </span>
              </div>
            </div>

            <div
              className={`telemetry-card ${
                recording ? "active" : ""
              }`}
            >
              <span className="telemetry-card-title">
                MICROPHONE
              </span>

              <div className="telemetry-val-row">
                <span className="telemetry-dot" />

                <span className="telemetry-state-text">
                  {recording
                    ? "Recording (Opus)"
                    : "Idle"}
                </span>
              </div>
            </div>

            <div
              className={`telemetry-card ${
                recording ? "active" : ""
              }`}
            >
              <span className="telemetry-card-title">
                INTERACTIONS
              </span>

              <div className="telemetry-val-row">
                <span className="telemetry-dot" />

                <span className="telemetry-state-text">
                  {recording
                    ? "Capturing DOM Telemetry"
                    : "Standby"}
                </span>
              </div>
            </div>

            <div className="telemetry-card number-card">
              <span className="telemetry-card-title">
                EVENT COUNT
              </span>

              <div className="telemetry-number-row">
                <span className="telemetry-big-number">
                  {totalEventCount}
                </span>

                <span className="telemetry-sub-label">
                  events logged
                </span>
              </div>
            </div>

          </div>

          {recording && (
            <div className="capture-active-timer-stage">

              <span className="rec-live-beacon" />

              <div className="timer-readout">
                {formatTime(recordingTime)}
              </div>

              <span className="timer-session-label">
                Dual WebM Stream Buffering
              </span>

            </div>
          )}

          {lastCapture && !recording && (
            <div className="capture-success-card">

              <div className="success-header">

                <span className="success-icon">
                  ✓
                </span>

                <div>

                  <h4 className="success-title">
                    Demonstration Blobs Packaged & Downloaded
                  </h4>

                  <p className="success-sub">
                    Saved{" "}
                    <code>
                      mimic-expert-screen.webm
                    </code>{" "}
                    and{" "}
                    <code>
                      mimic-expert-voice.webm
                    </code>{" "}
                    to your browser downloads.
                  </p>

                </div>

              </div>

              <div className="success-metrics-row">

                <div>
                  Duration:{" "}
                  <strong>
                    {lastCapture.formatted}
                  </strong>
                </div>

                <div>
                  Events:{" "}
                  <strong>
                    {lastCapture.count}
                  </strong>
                </div>

                <div>
                  Completed:{" "}
                  <strong>
                    {lastCapture.time}
                  </strong>
                </div>

              </div>

            </div>
          )}

          <div className="capture-event-stream-box">

            <div className="stream-box-header">

              <span className="stream-box-title">
                Live Client-Side Interaction Log
              </span>

              <span className="stream-box-count">
                {eventList.length} recent entries
              </span>

            </div>

            <div className="stream-rows-scroll">

              {eventList.length === 0 ? (
                <div className="stream-row-empty">
                  No events registered yet. Interact with
                  the page to stream events.
                </div>
              ) : (
                eventList.map((ev, i) => (
                  <div
                    key={i}
                    className="stream-data-row"
                  >

                    <span className="stream-time">
                      +
                      {(ev.relativeTime / 1000).toFixed(2)}
                      s
                    </span>

                    <span className="stream-event-type">
                      {ev.type}
                    </span>

                    <span className="stream-payload">

                      {ev.element && (
                        <span className="payload-tag">
                          {ev.element}
                        </span>
                      )}

                      {ev.key && (
                        <span className="payload-tag">
                          key: {ev.key}
                        </span>
                      )}

                      {ev.scrollY !== undefined && (
                        <span className="payload-tag">
                          scrollY: {ev.scrollY}px
                        </span>
                      )}

                      {ev.duration && (
                        <span className="payload-tag">
                          dur:{" "}
                          {(ev.duration / 1000).toFixed(1)}
                          s
                        </span>
                      )}

                      {ev.message && (
                        <span>
                          {ev.message}
                        </span>
                      )}

                    </span>

                  </div>
                ))
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ExpertCaptureOverlay;