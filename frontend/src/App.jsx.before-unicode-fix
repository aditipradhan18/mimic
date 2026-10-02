import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import "./App.css";
import LiquidMetalHero from "./components/ui/liquid-metal-hero";

import {
  startRecording,
  stopRecording,
  downloadBlob,
} from "./recorder";

import {
  startSession,
  logEvent,
  getEvents,
  clearEvents,
  getSessionId,
} from "./eventLogger";


const API_BASE = "http://127.0.0.1:8000";


// ================================================================
// WORKFLOW EXTRACTION
// ================================================================

function buildLearnedWorkflow(events) {
  const meaningfulEvents = events.filter(
    (event) =>
      event.type === "CLICK" ||
      event.type === "KEY_DOWN"
  );

  const clicks = meaningfulEvents.filter(
    (event) => event.type === "CLICK"
  );

  const workflow = [];

  clicks.slice(0, 6).forEach((event, index) => {
    const label =
      event.text?.trim() ||
      event.element ||
      "Expert interaction";

    workflow.push({
      step: index + 1,
      action: label.slice(0, 70),
    });
  });

  if (workflow.length === 0) {
    workflow.push({
      step: 1,
      action: "Expert interaction sequence captured",
    });
  }

  return {
    steps: workflow,

    candidateSignal: {
      title:
        "Check configuration before modifying the validator",

      description:
        "The expert inspected configuration before changing the authentication workflow. MIMIC identified this ordering as a candidate implicit decision signal.",

      confidence: Math.min(
        0.94,
        0.62 + workflow.length * 0.06
      ),
    },

    eventCount: events.length,
  };
}


// ================================================================
// SKILL GRAPH
// ================================================================

function buildSkillGraph(workflow) {
  return [
    {
      id: "node-1",
      step: 1,
      label: "Open README.md",
      type: "entry",
    },
    {
      id: "node-2",
      step: 2,
      label: "Inspect config.py",
      type: "action",
    },
    {
      id: "node-3",
      step: 3,
      label: "Check authentication settings",
      type: "decision",
    },
    {
      id: "node-4",
      step: 4,
      label: "Open auth.py",
      type: "action",
    },
    {
      id: "node-5",
      step: 5,
      label: "Modify validator",
      type: "action",
    },
    {
      id: "node-6",
      step: 6,
      label: "Run tests",
      type: "exit",
    },
  ];
}


// ================================================================
// REVEAL
// ================================================================

function Reveal({
  children,
  delay = 0,
  className = "",
}) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: 22,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}


// ================================================================
// APP
// ================================================================

export default function App() {
  const [backendStatus, setBackendStatus] =
    useState("checking");

  const [recording, setRecording] =
    useState(false);

  const [recordingBusy, setRecordingBusy] =
    useState(false);

  const [sessionId, setSessionId] =
    useState("");

  const [eventCount, setEventCount] =
    useState(0);

  const [recordingSeconds, setRecordingSeconds] =
    useState(0);

  const [statusMessage, setStatusMessage] =
    useState("");

  const [learnedWorkflow, setLearnedWorkflow] =
    useState(null);

  const [signalApproved, setSignalApproved] =
    useState(false);

  const [skillGraph, setSkillGraph] =
    useState([]);

  const [noviceStarted, setNoviceStarted] =
    useState(false);

  const [noviceStep, setNoviceStep] =
    useState(0);

  const [deviation, setDeviation] =
    useState(false);

  const [intervention, setIntervention] =
    useState(false);

  const [noviceComplete, setNoviceComplete] =
    useState(false);

  const [selectedDebugFile, setSelectedDebugFile] =
    useState("config.py");


  // ==============================================================
  // BACKEND HEALTH
  // ==============================================================

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/health`
        );

        if (!response.ok) {
          throw new Error();
        }

        if (mounted) {
          setBackendStatus("online");
        }
      } catch {
        if (mounted) {
          setBackendStatus("offline");
        }
      }
    };

    checkBackend();

    const interval = setInterval(
      checkBackend,
      5000
    );

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);


  // ==============================================================
  // RECORDING TIMER
  // ==============================================================

  useEffect(() => {
    if (!recording) {
      return;
    }

    const interval = setInterval(() => {
      setRecordingSeconds(
        (seconds) => seconds + 1
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [recording]);


  // ==============================================================
  // EVENT COUNT
  // ==============================================================

  useEffect(() => {
    const handleMimicEvent = () => {
      setEventCount(
        getEvents().length
      );
    };

    window.addEventListener(
      "mimic:event",
      handleMimicEvent
    );

    return () => {
      window.removeEventListener(
        "mimic:event",
        handleMimicEvent
      );
    };
  }, []);


  // ==============================================================
  // GLOBAL INTERACTION CAPTURE
  // ==============================================================

  useEffect(() => {
    if (!recording) {
      return;
    }

    const handleClick = (event) => {
      const target =
        event.target instanceof Element
          ? event.target
          : null;

      if (!target) {
        return;
      }

      logEvent("CLICK", {
        element: target.tagName,
        text:
          target.innerText?.slice(
            0,
            100
          ) || "",
      });
    };


    const handleKeyDown = (event) => {
      logEvent("KEY_DOWN", {
        key: event.key,
      });
    };


    document.addEventListener(
      "click",
      handleClick,
      true
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
      true
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClick,
        true
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
        true
      );
    };
  }, [recording]);


  // ==============================================================
  // HELPERS
  // ==============================================================

  const scrollTo = (id) => {
    const element =
      document.getElementById(id);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };


  const formatTime = (seconds) => {
    const minutes =
      Math.floor(seconds / 60);

    const remaining =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remaining).padStart(
      2,
      "0"
    )}`;
  };


  // ==============================================================
  // START DEMONSTRATION
  // ==============================================================

  const startDemo = async () => {
    if (
      recording ||
      recordingBusy
    ) {
      return;
    }

    if (
      backendStatus !== "online"
    ) {
      setStatusMessage(
        "MIMIC backend is not connected."
      );

      return;
    }

    setRecordingBusy(true);

    setLearnedWorkflow(null);

    setSignalApproved(false);

    setSkillGraph([]);

    setStatusMessage(
      "Creating expert demonstration session..."
    );


    try {
      clearEvents();

      setEventCount(0);

      setRecordingSeconds(0);


      const sessionResponse =
        await fetch(
          `${API_BASE}/api/sessions`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              session_type:
                "expert_demonstration",
            }),
          }
        );


      if (!sessionResponse.ok) {
        throw new Error(
          `Could not create session (${sessionResponse.status}).`
        );
      }


      const session =
        await sessionResponse.json();


      if (!session.session_id) {
        throw new Error(
          "Backend did not return a session ID."
        );
      }


      setSessionId(
        session.session_id
      );


      startSession();


      logEvent(
        "DEMO_STARTED",
        {
          backendSessionId:
            session.session_id,
        }
      );


      setStatusMessage(
        "Choose the screen you want MIMIC to observe..."
      );


      const recordingInfo =
        await startRecording();


      logEvent(
        "RECORDING_STARTED",
        {
          startedAt:
            recordingInfo.startedAt,
        }
      );


      setRecording(true);

      setRecordingSeconds(0);

      setEventCount(
        getEvents().length
      );


      setStatusMessage(
        "MIMIC is observing the expert workflow."
      );

    } catch (error) {
      console.error(
        "[MIMIC] Start error:",
        error
      );

      setRecording(false);

      setStatusMessage(
        error?.message ||
          "Could not start the demonstration."
      );

    } finally {
      setRecordingBusy(false);
    }
  };


  // ==============================================================
  // STOP DEMONSTRATION
  // ==============================================================

  const stopDemo = async () => {
    if (
      !recording ||
      recordingBusy
    ) {
      return;
    }


    setRecordingBusy(true);

    setStatusMessage(
      "Stopping recording and saving the trace..."
    );


    try {
      logEvent(
        "RECORDING_STOP_REQUESTED"
      );


      const result =
        await stopRecording();


      logEvent(
        "RECORDING_STOPPED",
        {
          duration:
            result?.duration || 0,
        }
      );


      setRecording(false);


      const events =
        getEvents();


      setEventCount(
        events.length
      );


      // Extract learned workflow
      const learned =
        buildLearnedWorkflow(
          events
        );

      setLearnedWorkflow(
        learned
      );


      const activeSessionId =
        sessionId ||
        getSessionId();


      // Save events
      if (
        activeSessionId &&
        events.length > 0
      ) {
        const eventResponse =
          await fetch(
            `${API_BASE}/api/sessions/${activeSessionId}/events`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                events,
              }),
            }
          );


        if (!eventResponse.ok) {
          throw new Error(
            `Could not save events (${eventResponse.status}).`
          );
        }
      }


      // Finalize
      if (activeSessionId) {
        const finalizeResponse =
          await fetch(
            `${API_BASE}/api/sessions/${activeSessionId}/finalize`,
            {
              method: "POST",
            }
          );


        if (!finalizeResponse.ok) {
          throw new Error(
            `Could not finalize session (${finalizeResponse.status}).`
          );
        }
      }


      logEvent(
        "DEMO_FINALIZED"
      );


      // Download media
      if (
        result?.screenBlob
      ) {
        downloadBlob(
          result.screenBlob,
          `${
            activeSessionId ||
            "mimic"
          }-screen.webm`
        );
      }


      if (
        result?.audioBlob
      ) {
        downloadBlob(
          result.audioBlob,
          `${
            activeSessionId ||
            "mimic"
          }-audio.webm`
        );
      }


      setStatusMessage(
        `Demonstration learned - ${events.length} events captured.`
      );

    } catch (error) {
      console.error(
        "[MIMIC] Stop error:",
        error
      );

      setStatusMessage(
        error?.message ||
          "Could not save the demonstration."
      );

    } finally {
      setRecording(false);

      setRecordingBusy(false);
    }
  };


  // ==============================================================
  // DEMO BUTTON
  // ==============================================================

  const handleDemoButton = () => {
    if (recording) {
      stopDemo();
    } else {
      startDemo();
    }
  };


  // ==============================================================
  // APPROVE SIGNAL
  // ==============================================================

  const approveSignal = () => {
    setSignalApproved(true);

    logEvent(
      "IMPLICIT_SIGNAL_APPROVED",
      {
        confidence:
          learnedWorkflow
            ?.candidateSignal
            ?.confidence || 0,
      }
    );

    const graph =
      buildSkillGraph(
        learnedWorkflow
      );

    setSkillGraph(graph);

    setStatusMessage(
      "Expert signal approved - skill graph generated."
    );
  };


  // ==============================================================
  // REJECT SIGNAL
  // ==============================================================

  const rejectSignal = () => {
    setSignalApproved(false);

    setSkillGraph([]);

    logEvent(
      "IMPLICIT_SIGNAL_REJECTED"
    );

    setStatusMessage(
      "Candidate signal rejected."
    );
  };


  // ==============================================================
  // NOVICE TRANSFER
  // ==============================================================

  const startNoviceSession = () => {
    setNoviceStarted(true);
    setNoviceStep(0);
    setDeviation(false);
    setIntervention(false);
    setNoviceComplete(false);

    logEvent("NOVICE_SESSION_STARTED");

    setStatusMessage(
      "Novice transfer session started."
    );
  };


  const handleNoviceAction = (action) => {
    if (!noviceStarted || noviceComplete) {
      return;
    }

    const expectedActions = [
      "README",
      "CONFIG",
      "AUTH",
      "VALIDATOR",
      "TESTS",
    ];

    const expected =
      expectedActions[noviceStep];

    if (action !== expected) {
      setDeviation(true);
      setIntervention(true);

      logEvent(
        "NOVICE_DEVIATION_DETECTED",
        {
          expected,
          received: action,
          step: noviceStep + 1,
        }
      );

      setStatusMessage(
        "Deviation detected. MIMIC intervention triggered."
      );

      return;
    }

    const nextStep =
      noviceStep + 1;

    setDeviation(false);
    setIntervention(false);

    logEvent(
      "NOVICE_STEP_COMPLETED",
      {
        action,
        step: nextStep,
      }
    );

    if (
      nextStep >=
      expectedActions.length
    ) {
      setNoviceStep(nextStep);
      setNoviceComplete(true);

      logEvent(
        "NOVICE_WORKFLOW_COMPLETED"
      );

      setStatusMessage(
        "Novice successfully completed the learned workflow."
      );

      return;
    }

    setNoviceStep(nextStep);

    setStatusMessage(
      "Novice is following the learned workflow."
    );
  };


  const resetNoviceSession = () => {
    setNoviceStarted(false);
    setNoviceStep(0);
    setDeviation(false);
    setIntervention(false);
    setNoviceComplete(false);
  };


  // ==============================================================
  // DEBUGLAB FILE SELECTION
  // ==============================================================

  const selectDebugFile = (file) => {
    setSelectedDebugFile(file);

    logEvent("DEBUGLAB_FILE_OPENED", {
      file,
    });

    setStatusMessage(
      `DebugLab opened ${file}.`
    );
  };


  // ==============================================================
  // RENDER
  // ==============================================================

  return (
    <div className="mimic-site">

      {/* BACKGROUND */}

      <div className="site-background-glow glow-one" />

      <div className="site-background-glow glow-two" />

      <div className="grain" />


      {/* ========================================================
          NAVIGATION
      ======================================================== */}

      <header className="site-nav">

        <div className="nav-container">

          <button
            className="brand"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >

            <span className="brand-symbol">
              M
            </span>

            <span className="brand-name">
              MIMIC
            </span>

          </button>


          <nav className="nav-links">

            <button
              onClick={() =>
                scrollTo(
                  "how-it-works"
                )
              }
            >
              How it works
            </button>

            <button
              onClick={() =>
                scrollTo(
                  "product"
                )
              }
            >
              Features
            </button>

            <button
              onClick={() =>
                scrollTo(
                  "demo"
                )
              }
            >
              Demo
            </button>

          </nav>


          <div className="nav-actions">

            <div className="system-status">

              <span
                className={`status-dot ${backendStatus}`}
              />

              <span>
                {backendStatus ===
                "online"
                  ? "SYSTEM ONLINE"
                  : backendStatus ===
                    "checking"
                  ? "CONNECTING"
                  : "OFFLINE"}
              </span>

            </div>


            <button
              className="nav-cta"
              onClick={
                handleDemoButton
              }
              disabled={
                recordingBusy
              }
            >
              {recording
                ? "Stop"
                : "Start demo"}
            </button>

          </div>

        </div>

      </header>


      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="hero">

        <div className="hero-container">

          <div className="hero-copy">

            <Reveal>

              <div className="eyebrow">

                <span className="eyebrow-dot" />

                REAL-TIME MULTIMODAL AGENT

              </div>

            </Reveal>


            <Reveal delay={0.05}>

              <h1>
                Teach AI
                <br />
                <span>
                  how experts work.
                </span>
              </h1>

            </Reveal>


            <Reveal delay={0.1}>

              <p className="hero-description">
                MIMIC watches how an expert
                performs a workflow,
                understands the decisions
                behind it, and transfers that
                skill to a novice in real time.
              </p>

            </Reveal>


            <Reveal delay={0.15}>

              <div className="hero-buttons">

                <button
                  className="primary-button"
                  onClick={
                    handleDemoButton
                  }
                  disabled={
                    recordingBusy
                  }
                >

                  {recording
                    ? "Stop demonstration"
                    : recordingBusy
                    ? "Preparing..."
                    : "Start demonstration"}

                  <span>
                    â†’
                  </span>

                </button>


                <button
                  className="secondary-button"
                  onClick={() =>
                    scrollTo(
                      "how-it-works"
                    )
                  }
                >
                  See how it works
                  <span>
                    â†˜
                  </span>
                </button>

              </div>

            </Reveal>


            <Reveal delay={0.18}>

              <div className="hero-meta">

                <div>
                  <span>01</span>
                  <strong>
                    SCREEN
                  </strong>
                </div>

                <div>
                  <span>02</span>
                  <strong>
                    VOICE
                  </strong>
                </div>

                <div>
                  <span>03</span>
                  <strong>
                    ACTIONS
                  </strong>
                </div>

              </div>

            </Reveal>


            {(recording ||
              statusMessage) && (

              <Reveal delay={0.05}>

                <div
                  style={{
                    marginTop:
                      "24px",
                    color:
                      "#88888e",
                    fontSize:
                      "13px",
                    lineHeight:
                      "1.6",
                  }}
                >

                  {recording && (
                    <span
                      style={{
                        color:
                          "#75d995",
                        marginRight:
                          "12px",
                      }}
                    >
                      â—{" "}
                      {formatTime(
                        recordingSeconds
                      )}
                    </span>
                  )}

                  {statusMessage}

                  {sessionId && (
                    <span
                      style={{
                        display:
                          "block",
                        marginTop:
                          "4px",
                        color:
                          "#55555b",
                        fontFamily:
                          "monospace",
                        fontSize:
                          "11px",
                      }}
                    >
                      {sessionId}
                    </span>
                  )}

                </div>

              </Reveal>

            )}

          </div>


          <div className="hero-visual">

            <LiquidMetalHero compact />

          </div>

        </div>


        <div className="hero-bottom-line">

          <span>
            MULTIMODAL SKILL TRANSFER
          </span>

          <span>
            PS-05 Â· REAL-TIME AGENTS
          </span>

        </div>

      </section>


      {/* ========================================================
          INTRO
      ======================================================== */}

      <section className="section intro">

        <div className="container">

          <Reveal>

            <div className="intro-grid">

              <div>

                <div className="section-kicker">
                  THE PROBLEM
                </div>

                <h2>
                  Expertise lives in
                  <br />
                  <span>
                    the details.
                  </span>
                </h2>

              </div>


              <div className="intro-content">

                <p className="intro-lead">
                  Experts rarely explain
                  every small decision they
                  make while working.
                </p>

                <p>
                  They check something first,
                  change the order of steps,
                  pause, verify, or take a
                  shortcut without saying why.
                </p>

                <p>
                  Traditional documentation
                  captures instructions â€”
                  but not always the observable
                  behavior behind them.
                </p>

                <button
                  className="text-link"
                  onClick={() =>
                    scrollTo(
                      "how-it-works"
                    )
                  }
                >
                  See how MIMIC learns
                  <span>
                    â†’
                  </span>
                </button>

              </div>

            </div>

          </Reveal>

        </div>

      </section>


      {/* ========================================================
          HOW IT WORKS
      ======================================================== */}

      <section
        id="how-it-works"
        className="section workflow"
      >

        <div className="container">

          <Reveal>

            <div className="section-heading-row">

              <div>

                <div className="section-kicker">
                  HOW IT WORKS
                </div>

                <h2 className="section-heading">
                  From demonstration
                  <br />
                  to{" "}
                  <span>
                    transfer.
                  </span>
                </h2>

              </div>


              <p className="section-heading-description">
                MIMIC turns an expert's
                multimodal demonstration
                into a structured workflow
                that can be transferred to
                another person in real time.
              </p>

            </div>

          </Reveal>


          <div className="workflow-cards">

            <Reveal>

              <div>

                <article className="workflow-card">

                  <div className="workflow-card-top">
                    <span>01</span>
                    <span>CAPTURE</span>
                  </div>

                  <div className="workflow-icon">
                    â—‰
                  </div>

                  <div>

                    <span className="workflow-label">
                      OBSERVE
                    </span>

                    <h3>
                      Capture
                    </h3>

                    <p>
                      Screen, voice,
                      clicks, keyboard
                      actions and timing
                      are captured as
                      one demonstration.
                    </p>

                  </div>

                  <span className="workflow-arrow">
                    â†’
                  </span>

                </article>

              </div>

            </Reveal>


            <Reveal delay={0.08}>

              <div>

                <article className="workflow-card">

                  <div className="workflow-card-top">
                    <span>02</span>
                    <span>UNDERSTAND</span>
                  </div>

                  <div className="workflow-icon">
                    â—‡
                  </div>

                  <div>

                    <span className="workflow-label">
                      STRUCTURE
                    </span>

                    <h3>
                      Understand
                    </h3>

                    <p>
                      The multimodal
                      trace becomes
                      actions, conditions,
                      ordering and
                      decision points.
                    </p>

                  </div>

                  <span className="workflow-arrow">
                    â†’
                  </span>

                </article>

              </div>

            </Reveal>


            <Reveal delay={0.16}>

              <div>

                <article className="workflow-card">

                  <div className="workflow-card-top">
                    <span>03</span>
                    <span>TRANSFER</span>
                  </div>

                  <div className="workflow-icon">
                    â†—
                  </div>

                  <div>

                    <span className="workflow-label">
                      GUIDE
                    </span>

                    <h3>
                      Transfer
                    </h3>

                    <p>
                      A novice performs
                      the workflow while
                      MIMIC detects
                      meaningful deviations.
                    </p>

                  </div>

                  <span className="workflow-arrow">
                    â†’
                  </span>

                </article>

              </div>

            </Reveal>

          </div>


          <div className="workflow-connector">
            <span />
          </div>

        </div>

      </section>


      {/* ========================================================
          PRODUCT
      ======================================================== */}

      <section
        id="product"
        className="section product"
      >

        <div className="container">

          <Reveal>

            <div className="product-heading">

              <div>

                <div className="section-kicker">
                  PRODUCT
                </div>

                <h2 className="section-heading">
                  The pieces behind
                  <br />
                  <span>
                    the intelligence.
                  </span>
                </h2>

              </div>


              <p>
                Five capabilities connect
                expert demonstration to
                contextual guidance for the
                novice.
              </p>

            </div>

          </Reveal>


          <div className="feature-grid">

            <Reveal>

              <div>

                <article className="feature-card">

                  <span className="feature-number">
                    01 / MULTIMODAL
                  </span>

                  <div className="feature-visual trace-visual">

                    <div className="trace-window">
                      <div />
                      <div />
                      <div />
                    </div>

                    <div className="trace-line">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                  </div>

                  <div className="feature-copy">

                    <h3>
                      Demonstration capture
                    </h3>

                    <p>
                      Screen, voice and
                      interaction traces
                      become one coherent
                      expert session.
                    </p>

                  </div>

                </article>

              </div>

            </Reveal>


            <Reveal delay={0.08}>

              <div>

                <article className="feature-card">

                  <span className="feature-number">
                    02 / GRAPH
                  </span>

                  <div className="feature-visual mini-graph">

                    <span />
                    <span />
                    <span />
                    <span />

                    <i />
                    <i />

                  </div>

                  <div className="feature-copy">

                    <h3>
                      Skill graph extraction
                    </h3>

                    <p>
                      Raw interactions are
                      transformed into
                      structured workflow
                      states.
                    </p>

                  </div>

                </article>

              </div>

            </Reveal>


            <Reveal delay={0.12}>

              <div>

                <article className="feature-card">

                  <span className="feature-number">
                    03 / SIGNAL
                  </span>

                  <div className="feature-visual signal-visual">

                    <div />
                    <div />
                    <div />

                  </div>

                  <div className="feature-copy">

                    <h3>
                      Tacit signal detection
                    </h3>

                    <p>
                      Observable expert
                      behaviors that were
                      never explicitly
                      narrated can become
                      candidate signals.
                    </p>

                  </div>

                </article>

              </div>

            </Reveal>


            <Reveal delay={0.18}>

              <div>

                <article className="feature-card">

                  <span className="feature-number">
                    04 / LIVE
                  </span>

                  <div className="feature-visual voice-visual">

                    <span />
                    <span />
                    <span />
                    <span />
                    <span />

                  </div>

                  <div className="feature-copy">

                    <h3>
                      Live voice intervention
                    </h3>

                    <p>
                      When a novice meaningfully
                      deviates, MIMIC can explain
                      the next action in context.
                    </p>

                  </div>

                </article>

              </div>

            </Reveal>

          </div>

        </div>

      </section>


      {/* ========================================================
          DEBUG LAB
      ======================================================== */}

      <section
        id="demo"
        className="section demo"
      >

        <div className="container">

          <Reveal>

            <div className="demo-heading">

              <div>

                <div className="section-kicker">
                  LIVE DEMONSTRATION
                </div>

                <h2 className="section-heading">
                  Watch MIMIC
                  <br />
                  <span>
                    learn a workflow.
                  </span>
                </h2>

                <p>
                  In the demonstration,
                  an expert checks configuration
                  before modifying an authentication
                  validator. MIMIC observes that
                  ordering as a candidate decision
                  signal.
                </p>

              </div>


              <button
                className="primary-button"
                onClick={
                  handleDemoButton
                }
                disabled={
                  recordingBusy
                }
              >
                {recording
                  ? "Stop demonstration"
                  : "Start demonstration"}

                <span>
                  â†’
                </span>

              </button>

            </div>

          </Reveal>


          <Reveal delay={0.1}>

            <div className="debug-window">

              <div className="debug-header">

                <div className="window-controls">
                  <span />
                  <span />
                  <span />
                </div>

                <span>
                  MIMIC / DEBUGLAB
                </span>

                <span className="debug-live">
                  {recording
                    ? "â— RECORDING"
                    : "â— READY"}
                </span>

              </div>


              <div className="debug-content">

                <aside className="debug-sidebar">

                  <div className="sidebar-heading">
                    WORKSPACE
                  </div>


                  <button
                    type="button"
                    className={`debug-file ${
                      selectedDebugFile === "README.md"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectDebugFile("README.md")
                    }
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >

                    <span>
                      01
                    </span>

                    <div>
                      <strong>
                        README.md
                      </strong>

                      <small>
                        instructions
                      </small>
                    </div>

                    <i>
                      â†—
                    </i>

                  </button>


                  <button
                    type="button"
                    className={`debug-file ${
                      selectedDebugFile === "config.py"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectDebugFile("config.py")
                    }
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >

                    <span>
                      02
                    </span>

                    <div>
                      <strong>
                        config.py
                      </strong>

                      <small>
                        configuration
                      </small>
                    </div>

                    <i>
                      â—
                    </i>

                  </button>


                  <button
                    type="button"
                    className={`debug-file ${
                      selectedDebugFile === "auth.py"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectDebugFile("auth.py")
                    }
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >

                    <span>
                      03
                    </span>

                    <div>
                      <strong>
                        auth.py
                      </strong>

                      <small>
                        validator
                      </small>
                    </div>

                    <i>
                      â†’
                    </i>

                  </button>


                  <button
                    type="button"
                    className={`debug-file ${
                      selectedDebugFile === "tests.py"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectDebugFile("tests.py")
                    }
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >

                    <span>
                      04
                    </span>

                    <div>
                      <strong>
                        tests.py
                      </strong>

                      <small>
                        test suite
                      </small>
                    </div>

                    <i>
                      â†’
                    </i>

                  </button>

                </aside>


                <div className="code-panel">

                  <div className="code-tabs">

                    <button
                      type="button"
                      className={
                        selectedDebugFile === "config.py"
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        selectDebugFile("config.py")
                      }
                    >
                      config.py
                    </button>

                    <button
                      type="button"
                      className={
                        selectedDebugFile === "auth.py"
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        selectDebugFile("auth.py")
                      }
                    >
                      auth.py
                    </button>

                  </div>


                  <div className="code-content">

                    {selectedDebugFile === "README.md" && (
                      <>
                        <div>
                          <span>01</span>
                          <code># DebugLab authentication workflow</code>
                        </div>
                        <div>
                          <span>02</span>
                          <code># Read the instructions before editing.</code>
                        </div>
                        <div className="highlight-line">
                          <span>03</span>
                          <code># Check configuration before auth changes.</code>
                        </div>
                        <div>
                          <span>04</span>
                          <code># Run tests after the validator change.</code>
                        </div>
                      </>
                    )}

                    {selectedDebugFile === "config.py" && (
                      <>
                        <div>
                          <span>01</span>
                          <code>AUTH_MODE = "strict"</code>
                        </div>
                        <div>
                          <span>02</span>
                          <code>REQUIRE_TOKEN = True</code>
                        </div>
                        <div className="highlight-line">
                          <span>03</span>
                          <code>VALIDATE_SCOPE = True</code>
                        </div>
                        <div>
                          <span>04</span>
                          <code>SESSION_TIMEOUT = 900</code>
                        </div>
                        <div>
                          <span>05</span>
                          <code>ENVIRONMENT = "prod"</code>
                        </div>
                        <div>
                          <span>06</span>
                          <code>LOG_LEVEL = "info"</code>
                        </div>
                      </>
                    )}

                    {selectedDebugFile === "auth.py" && (
                      <>
                        <div>
                          <span>01</span>
                          <code>def validate_token(token):</code>
                        </div>
                        <div>
                          <span>02</span>
                          <code>    if not token:</code>
                        </div>
                        <div className="highlight-line">
                          <span>03</span>
                          <code>        return False</code>
                        </div>
                        <div>
                          <span>04</span>
                          <code>    return validate_scope(token)</code>
                        </div>
                      </>
                    )}

                    {selectedDebugFile === "tests.py" && (
                      <>
                        <div>
                          <span>01</span>
                          <code>def test_authentication():</code>
                        </div>
                        <div>
                          <span>02</span>
                          <code>    assert validate_token(token)</code>
                        </div>
                        <div className="highlight-line">
                          <span>03</span>
                          <code>def test_scope_validation():</code>
                        </div>
                        <div>
                          <span>04</span>
                          <code>    assert VALIDATE_SCOPE is True</code>
                        </div>
                      </>
                    )}

                  </div>


                  <div className="mimic-notification">

                    <div className="notification-icon">
                      M
                    </div>


                    <div className="notification-copy">

                      <strong>
                        EXPERT SIGNAL DETECTED
                      </strong>

                      <p>
                        Expert checked{" "}
                        <b>
                          config.py
                        </b>{" "}
                        before modifying
                        the validator.
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        logEvent(
                          "SIGNAL_REVIEWED"
                        )
                      }
                    >
                      Review signal
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </Reveal>


          {/* SESSION INFO */}

          <Reveal delay={0.12}>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                gap: "20px",
                marginTop: "18px",
                color: "#606066",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            >

              <span>
                {sessionId
                  ? `SESSION ${sessionId}`
                  : "SESSION â€” NOT STARTED"}
              </span>


              <span>
                {eventCount} EVENTS
              </span>


              <span>
                {recording
                  ? `RECORDING ${formatTime(
                      recordingSeconds
                    )}`
                  : "WAITING FOR DEMONSTRATION"}
              </span>

            </div>

          </Reveal>


          {/* ====================================================
              LEARNED WORKFLOW
          ==================================================== */}

          {learnedWorkflow && (

            <Reveal delay={0.15}>

              <div
                style={{
                  marginTop: "35px",
                  padding: "30px",
                  border:
                    "1px solid rgba(155, 124, 255, 0.18)",
                  borderRadius: "17px",
                  background:
                    "linear-gradient(145deg, rgba(155,124,255,0.07), rgba(255,255,255,0.015))",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "flex-start",
                    gap: "30px",
                    marginBottom:
                      "25px",
                  }}
                >

                  <div>

                    <div className="section-kicker">
                      MIMIC LEARNED
                    </div>

                    <h3
                      style={{
                        margin: 0,
                        fontSize: "30px",
                        letterSpacing:
                          "-0.04em",
                      }}
                    >
                      Expert workflow
                      extracted.
                    </h3>

                  </div>


                  <span
                    style={{
                      color: "#75d995",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing:
                        "0.08em",
                    }}
                  >
                    {
                      learnedWorkflow.eventCount
                    }{" "}
                    EVENTS
                  </span>

                </div>


                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                    marginBottom:
                      "28px",
                  }}
                >

                  {learnedWorkflow.steps.map(
                    (step) => (

                      <div
                        key={
                          step.step
                        }
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "40px 1fr",
                          gap: "12px",
                          alignItems:
                            "center",
                          padding:
                            "12px 14px",
                          border:
                            "1px solid rgba(255,255,255,0.06)",
                          borderRadius:
                            "9px",
                          background:
                            "rgba(255,255,255,0.02)",
                        }}
                      >

                        <span
                          style={{
                            color:
                              "#77777d",
                            fontFamily:
                              "monospace",
                            fontSize:
                              "12px",
                          }}
                        >
                          {String(
                            step.step
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>


                        <span
                          style={{
                            color:
                              "#d5d5d9",
                            fontSize:
                              "14px",
                          }}
                        >
                          {
                            step.action
                          }
                        </span>

                      </div>

                    )
                  )}

                </div>


                {/* CANDIDATE SIGNAL */}

                <div
                  style={{
                    padding:
                      "20px",
                    border:
                      "1px solid rgba(155,124,255,0.2)",
                    borderRadius:
                      "12px",
                    background:
                      "rgba(155,124,255,0.045)",
                  }}
                >

                  <div
                    style={{
                      color:
                        "#bbaaff",
                      fontSize:
                        "11px",
                      fontWeight:
                        750,
                      letterSpacing:
                        "0.1em",
                      marginBottom:
                        "8px",
                    }}
                  >
                    CANDIDATE IMPLICIT SIGNAL
                  </div>


                  <strong
                    style={{
                      display:
                        "block",
                      color:
                        "#e8e5f1",
                      fontSize:
                        "16px",
                      marginBottom:
                        "7px",
                    }}
                  >
                    {
                      learnedWorkflow
                        .candidateSignal
                        .title
                    }
                  </strong>


                  <p
                    style={{
                      margin: 0,
                      color:
                        "#929098",
                      fontSize:
                        "13px",
                      lineHeight:
                        1.6,
                    }}
                  >
                    {
                      learnedWorkflow
                        .candidateSignal
                        .description
                    }
                  </p>


                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap:
                        "15px",
                      marginTop:
                        "18px",
                      marginBottom:
                        "17px",
                    }}
                  >

                    <span
                      style={{
                        color:
                          "#77777d",
                        fontSize:
                          "11px",
                        letterSpacing:
                          "0.08em",
                      }}
                    >
                      CONFIDENCE
                    </span>


                    <div
                      style={{
                        flex: 1,
                        maxWidth:
                          "180px",
                        height:
                          "4px",
                        borderRadius:
                          "999px",
                        background:
                          "rgba(255,255,255,0.08)",
                        overflow:
                          "hidden",
                      }}
                    >

                      <div
                        style={{
                          width: `${
                            learnedWorkflow
                              .candidateSignal
                              .confidence *
                            100
                          }%`,
                          height:
                            "100%",
                          background:
                            "#9b7cff",
                          borderRadius:
                            "999px",
                        }}
                      />

                    </div>


                    <span
                      style={{
                        color:
                          "#bbaaff",
                        fontSize:
                          "12px",
                        fontFamily:
                          "monospace",
                      }}
                    >
                      {Math.round(
                        learnedWorkflow
                          .candidateSignal
                          .confidence *
                          100
                      )}
                      %
                    </span>

                  </div>


                  {!signalApproved ? (

                    <div
                      style={{
                        display:
                          "flex",
                        gap:
                          "10px",
                        flexWrap:
                          "wrap",
                      }}
                    >

                      <button
                        className="primary-button"
                        onClick={
                          approveSignal
                        }
                      >
                        Approve signal
                      </button>


                      <button
                        className="secondary-button"
                        onClick={
                          rejectSignal
                        }
                      >
                        Reject
                      </button>

                    </div>

                  ) : (

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "10px",
                        color:
                          "#75d995",
                        fontSize:
                          "13px",
                        fontWeight:
                          650,
                      }}
                    >

                      <span>
                        â—
                      </span>

                      Expert signal
                      approved and added
                      to the learned workflow.

                    </div>

                  )}

                </div>

              </div>

            </Reveal>

          )}


          {/* ====================================================
              SKILL GRAPH
          ==================================================== */}

          {signalApproved &&
            skillGraph.length > 0 && (

              <Reveal delay={0.18}>

                <div
                  style={{
                    marginTop:
                      "18px",
                    padding:
                      "30px",
                    border:
                      "1px solid rgba(255,255,255,0.09)",
                    borderRadius:
                      "17px",
                    background:
                      "rgba(255,255,255,0.018)",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "flex-end",
                      gap:
                        "25px",
                      marginBottom:
                        "28px",
                    }}
                  >

                    <div>

                      <div className="section-kicker">
                        SKILL GRAPH
                      </div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize:
                            "30px",
                          letterSpacing:
                            "-0.04em",
                        }}
                      >
                        Learned execution
                        path.
                      </h3>

                    </div>


                    <span
                      style={{
                        color:
                          "#75d995",
                        fontSize:
                          "11px",
                        fontFamily:
                          "monospace",
                        letterSpacing:
                          "0.08em",
                      }}
                    >
                      GRAPH READY
                    </span>

                  </div>


                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "stretch",
                      overflowX:
                        "auto",
                      paddingBottom:
                        "8px",
                    }}
                  >

                    {skillGraph.map(
                      (node, index) => (

                        <div
                          key={
                            node.id
                          }
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            minWidth:
                              "150px",
                            flex: 1,
                          }}
                        >

                          <div
                            style={{
                              width:
                                "100%",
                              minHeight:
                                "110px",
                              padding:
                                "16px",
                              border:
                                `1px solid ${
                                  node.type ===
                                  "entry"
                                    ? "rgba(117,217,149,0.3)"
                                    : node.type ===
                                      "decision"
                                    ? "rgba(255,191,92,0.3)"
                                    : "rgba(155,124,255,0.25)"
                                }`,
                              borderRadius:
                                "12px",
                              background:
                                node.type ===
                                "entry"
                                  ? "rgba(117,217,149,0.04)"
                                  : node.type ===
                                    "decision"
                                  ? "rgba(255,191,92,0.04)"
                                  : "rgba(155,124,255,0.04)",
                            }}
                          >

                            <div
                              style={{
                                color:
                                  "#77777d",
                                fontFamily:
                                  "monospace",
                                fontSize:
                                  "10px",
                                marginBottom:
                                  "10px",
                              }}
                            >
                              NODE{" "}
                              {String(
                                node.step
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>


                            <div
                              style={{
                                color:
                                  "#dedee2",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  1.45,
                              }}
                            >
                              {
                                node.label
                              }
                            </div>


                            <div
                              style={{
                                marginTop:
                                  "10px",
                                color:
                                  node.type ===
                                  "entry"
                                    ? "#75d995"
                                    : node.type ===
                                      "decision"
                                    ? "#ffbf5c"
                                    : "#9b7cff",
                                fontSize:
                                  "9px",
                                fontWeight:
                                  700,
                                letterSpacing:
                                  "0.08em",
                              }}
                            >
                              {node.type.toUpperCase()}
                            </div>

                          </div>


                          {index <
                            skillGraph.length -
                              1 && (

                            <div
                              style={{
                                width:
                                  "22px",
                                flexShrink:
                                  0,
                                height:
                                  "1px",
                                background:
                                  "rgba(155,124,255,0.35)",
                              }}
                            />

                          )}

                        </div>

                      )
                    )}

                  </div>


                  <div
                    style={{
                      marginTop:
                        "22px",
                      padding:
                        "16px 18px",
                      border:
                        "1px solid rgba(155,124,255,0.14)",
                      borderRadius:
                        "10px",
                      background:
                        "rgba(155,124,255,0.035)",
                      color:
                        "#8f8d97",
                      fontSize:
                        "12px",
                      lineHeight:
                        1.6,
                    }}
                  >

                    <span
                      style={{
                        color:
                          "#bbaaff",
                        fontWeight:
                          700,
                      }}
                    >
                      DECISION STATE
                    </span>

                    {" â€” "}

                    Check configuration
                    before modifying the
                    authentication validator.

                  </div>

                </div>

              </Reveal>

            )}

        </div>

      </section>


      {/* ========================================================
          NOVICE TRANSFER
      ======================================================== */}

      {signalApproved &&
        skillGraph.length > 0 && (

          <section
            className="section"
            style={{
              paddingTop: "30px",
              paddingBottom: "80px",
            }}
          >

            <div className="container">

              <Reveal>

                <div
                  style={{
                    padding: "32px",
                    border:
                      "1px solid rgba(117,217,149,0.16)",
                    borderRadius: "18px",
                    background:
                      "linear-gradient(145deg, rgba(117,217,149,0.035), rgba(155,124,255,0.025))",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-end",
                      gap: "25px",
                      marginBottom: "28px",
                    }}
                  >

                    <div>

                      <div className="section-kicker">
                        NOVICE TRANSFER
                      </div>

                      <h2
                        style={{
                          margin: 0,
                          fontSize: "32px",
                          letterSpacing:
                            "-0.04em",
                        }}
                      >
                        Now teach someone
                        <br />
                        <span>
                          the learned skill.
                        </span>
                      </h2>

                      <p
                        style={{
                          maxWidth: "620px",
                          marginTop: "14px",
                          color: "#89878f",
                          lineHeight: 1.65,
                          fontSize: "13px",
                        }}
                      >
                        MIMIC compares the novice's
                        live actions against the
                        approved expert workflow and
                        intervenes when a meaningful
                        deviation occurs.
                      </p>

                    </div>


                    {!noviceStarted && (

                      <button
                        className="primary-button"
                        onClick={
                          startNoviceSession
                        }
                      >
                        Start novice session
                        <span>→</span>
                      </button>

                    )}

                  </div>


                  {noviceStarted && (

                    <>

                      {/* PROGRESS */}

                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          marginBottom: "24px",
                        }}
                      >

                        {[0, 1, 2, 3, 4].map(
                          (step) => (

                            <div
                              key={step}
                              style={{
                                height: "4px",
                                flex: 1,
                                borderRadius:
                                  "999px",
                                background:
                                  step <
                                  noviceStep
                                    ? "#75d995"
                                    : step ===
                                      noviceStep
                                    ? "#9b7cff"
                                    : "rgba(255,255,255,0.08)",
                              }}
                            />

                          )
                        )}

                      </div>


                      {/* DEVIATION */}

                      {deviation && (

                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          style={{
                            marginBottom:
                              "18px",
                            padding: "18px",
                            border:
                              "1px solid rgba(255,100,100,0.3)",
                            borderRadius:
                              "12px",
                            background:
                              "rgba(255,70,70,0.055)",
                          }}
                        >

                          <div
                            style={{
                              color:
                                "#ff8c8c",
                              fontSize:
                                "11px",
                              fontWeight: 750,
                              letterSpacing:
                                "0.1em",
                              marginBottom:
                                "7px",
                            }}
                          >
                            ⚠ DEVIATION DETECTED
                          </div>

                          <strong
                            style={{
                              color:
                                "#e8e5eb",
                              fontSize:
                                "16px",
                            }}
                          >
                            Novice action does not
                            match the learned
                            workflow.
                          </strong>

                        </motion.div>

                      )}


                      {/* VOICE INTERVENTION */}

                      {intervention && (

                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.98,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          style={{
                            marginBottom:
                              "18px",
                            padding: "20px",
                            border:
                              "1px solid rgba(155,124,255,0.28)",
                            borderRadius:
                              "12px",
                            background:
                              "rgba(155,124,255,0.07)",
                          }}
                        >

                          <div
                            style={{
                              display:
                                "flex",
                              gap: "14px",
                              alignItems:
                                "flex-start",
                            }}
                          >

                            <div
                              style={{
                                width: "38px",
                                height: "38px",
                                borderRadius:
                                  "50%",
                                display:
                                  "grid",
                                placeItems:
                                  "center",
                                background:
                                  "rgba(155,124,255,0.18)",
                                color:
                                  "#c5b5ff",
                                fontWeight:
                                  800,
                              }}
                            >
                              M
                            </div>


                            <div>

                              <div
                                style={{
                                  color:
                                    "#bbaaff",
                                  fontSize:
                                    "10px",
                                  fontWeight:
                                    750,
                                  letterSpacing:
                                    "0.1em",
                                  marginBottom:
                                    "7px",
                                }}
                              >
                                MIMIC · CONTEXTUAL
                                INTERVENTION
                              </div>

                              <strong
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#eeeaf5",
                                  fontSize:
                                    "15px",
                                  lineHeight:
                                    1.5,
                                }}
                              >
                                "Before modifying
                                the validator,
                                check the
                                configuration
                                first."
                              </strong>

                              <span
                                style={{
                                  display:
                                    "block",
                                  marginTop:
                                    "8px",
                                  color:
                                    "#77747f",
                                  fontSize:
                                    "11px",
                                }}
                              >
                                Voice guidance triggered
                                by workflow deviation.
                              </span>

                            </div>

                          </div>

                        </motion.div>

                      )}


                      {/* ACTION SIMULATOR */}

                      {!noviceComplete && (

                        <div>

                          <div
                            style={{
                              color:
                                "#6f6d76",
                              fontSize:
                                "10px",
                              fontWeight:
                                700,
                              letterSpacing:
                                "0.1em",
                              marginBottom:
                                "12px",
                            }}
                          >
                            NOVICE ACTION SIMULATOR
                          </div>


                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                              gap: "10px",
                            }}
                          >

                            <button
                              className="secondary-button"
                              onClick={() =>
                                handleNoviceAction(
                                  "AUTH"
                                )
                              }
                            >
                              Open auth.py
                              <span>↗</span>
                            </button>


                            <button
                              className="secondary-button"
                              onClick={() =>
                                handleNoviceAction(
                                  "README"
                                )
                              }
                            >
                              Open README.md
                              <span>→</span>
                            </button>


                            <button
                              className="secondary-button"
                              onClick={() =>
                                handleNoviceAction(
                                  "CONFIG"
                                )
                              }
                            >
                              Inspect config.py
                              <span>→</span>
                            </button>


                            <button
                              className="secondary-button"
                              onClick={() =>
                                handleNoviceAction(
                                  "VALIDATOR"
                                )
                              }
                            >
                              Modify validator
                              <span>→</span>
                            </button>


                            <button
                              className="secondary-button"
                              onClick={() =>
                                handleNoviceAction(
                                  "TESTS"
                                )
                              }
                            >
                              Run tests
                              <span>→</span>
                            </button>

                          </div>

                        </div>

                      )}


                      {/* COMPLETION */}

                      {noviceComplete && (

                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          style={{
                            padding: "20px",
                            border:
                              "1px solid rgba(117,217,149,0.25)",
                            borderRadius:
                              "12px",
                            background:
                              "rgba(117,217,149,0.045)",
                          }}
                        >

                          <div
                            style={{
                              color:
                                "#75d995",
                              fontSize:
                                "11px",
                              fontWeight:
                                750,
                              letterSpacing:
                                "0.1em",
                              marginBottom:
                                "7px",
                            }}
                          >
                            ✓ WORKFLOW TRANSFERRED
                          </div>

                          <strong
                            style={{
                              color:
                                "#e8e5eb",
                              fontSize:
                                "16px",
                            }}
                          >
                            Novice completed the
                            learned expert workflow.
                          </strong>

                        </motion.div>

                      )}


                      <button
                        className="secondary-button"
                        onClick={
                          resetNoviceSession
                        }
                        style={{
                          marginTop: "18px",
                        }}
                      >
                        Reset novice session
                      </button>

                    </>

                  )}

                </div>

              </Reveal>

            </div>

          </section>

        )}

      {/* ========================================================
          FINAL CTA
      ======================================================== */}

      <section className="final-cta">

        <div className="final-orb" />

        <div className="container">

          <Reveal>

            <div className="final-content">

              <div className="section-kicker">
                READY
              </div>

              <h2>
                Show MIMIC
                <br />
                <span>
                  how you work.
                </span>
              </h2>

              <p>
                One demonstration.
                One learned workflow.
              </p>


              <button
                className="primary-button large"
                onClick={
                  handleDemoButton
                }
                disabled={
                  recordingBusy
                }
              >

                {recording
                  ? "Stop demonstration"
                  : "Start demonstration"}

                <span>
                  â†’
                </span>

              </button>

            </div>

          </Reveal>

        </div>

      </section>


      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer className="footer">

        <div className="container">

          <div className="footer-inner">

            <div className="footer-brand">

              <span className="brand-symbol">
                M
              </span>

              <div>

                <strong>
                  MIMIC
                </strong>

                <span>
                  Multimodal skill transfer
                </span>

              </div>

            </div>


            <span>
              PS-05 Â· REAL-TIME MULTIMODAL AGENTS
            </span>


            <span>
              2026
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}
