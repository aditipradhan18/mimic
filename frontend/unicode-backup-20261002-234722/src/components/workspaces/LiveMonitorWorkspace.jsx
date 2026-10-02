import { useState } from "react";

export function LiveMonitorWorkspace({ isOpen, onClose }) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="workspace-overlay-backdrop">
      <div className="workspace-overlay-shell">
        <div className="workspace-top-bar">
          <div className="workspace-header-info">
            <span className="demo-workflow-badge">DEMO MONITORING STATE · SIMULATED GUIDANCE STREAM</span>
            <h2 className="workspace-title">Novice Live Interaction &amp; Guidance Monitor</h2>
          </div>

          <button className="btn-workspace-close" onClick={onClose} aria-label="Close monitor">
            ✕ CLOSE
          </button>
        </div>

        <div className="workspace-content-body">
          <div className="monitor-split-grid">
            {/* Left: Novice IDE State */}
            <div className="monitor-ide-pane">
              <div className="ide-tab-bar">
                <span className="ide-tab-active font-mono">auth.py (Novice Session)</span>
                <span className="ide-elapsed-time font-mono">Session: 00:24</span>
              </div>

              <div className="ide-code-viewport">
                <div className="code-line">
                  <span className="ln">25</span>
                  <code>def verify_token(token: str) -&gt; bool:</code>
                </div>
                <div className="code-line">
                  <span className="ln">26</span>
                  <code>&nbsp;&nbsp;&nbsp;&nbsp;"""Validates incoming authorization token."""</code>
                </div>
                <div className="code-line cursor-active-line">
                  <span className="ln">27</span>
                  <code>&nbsp;&nbsp;&nbsp;&nbsp;# Novice editing validator logic directly...</code>
                  <span className="novice-cursor-badge">NOVICE CURSOR</span>
                </div>
                <div className="code-line">
                  <span className="ln">28</span>
                  <code>&nbsp;&nbsp;&nbsp;&nbsp;return jwt.decode(token, settings.KEY)</code>
                </div>
              </div>

              {/* Step Comparison */}
              <div className="monitor-step-matrix">
                <div className="step-matrix-box expected">
                  <span className="matrix-label">EXPECTED ACTION</span>
                  <span className="matrix-title">Check config.py</span>
                  <p className="matrix-detail">Expert verified environment variable secret binding first.</p>
                </div>

                <div className="step-matrix-box observed">
                  <span className="matrix-label">OBSERVED ACTION</span>
                  <span className="matrix-title">Opened auth.py &amp; Started Edit</span>
                  <p className="matrix-detail">Skipped configuration check; modifying validator prematurely.</p>
                </div>
              </div>

              {/* Deviation Callout */}
              <div className="deviation-alert-callout">
                <span className="alert-flash-dot" />
                <div>
                  <h4 className="alert-headline">DEVIATION DETECTED</h4>
                  <p className="alert-copy">
                    Novice deviated from the expert demonstration path at Step 02.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Contextual Voice Guidance */}
            <div className="monitor-intervention-pane">
              <div className="intervention-card-header">
                <div className="beacon-indicator-row">
                  <span className="voice-pulse-ring" />
                  <span className="voice-header-label">CONTEXTUAL INTERVENTION</span>
                </div>
                <span className="audio-synth-badge font-mono">VOICE STREAM ACTIVE</span>
              </div>

              <div className="intervention-speech-card">
                <div className="voice-avatar-block">
                  <div className="voice-orb">
                    <span className="voice-orb-glow" />
                  </div>
                  <div className="voice-meta">
                    <span className="voice-name">MIMIC Voice Agent</span>
                    <span className="voice-sub">Contextual Audio Intervention Triggered</span>
                  </div>
                </div>

                {/* Animated Soundwave */}
                <div className="soundwave-container" aria-hidden="true">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className="soundwave-bar"
                      style={{
                        height: `${6 + ((i * 13) % 24)}px`,
                        animationDelay: `${(i * 0.07).toFixed(2)}s`,
                      }}
                    />
                  ))}
                </div>

                <blockquote className="speech-quote-text">
                  "Before modifying the validator, check <strong>config.py</strong>.
                  The expert inspected configuration first."
                </blockquote>
              </div>

              <div className="why-matters-box">
                <div className="why-title-row">
                  <span className="why-label">WHY THIS MATTERS</span>
                </div>
                <p className="why-body">
                  That check determines whether the failure originates in configuration or validation logic.
                  Touching code when configuration is missing creates regression in production.
                </p>
              </div>

              <button
                className={`btn-compliance-toggle ${acknowledged ? "acknowledged" : ""}`}
                onClick={() => setAcknowledged(!acknowledged)}
              >
                {acknowledged
                  ? "✓ Novice Checked config.py (Workflow Resumed)"
                  : "Simulate Novice Compliance →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMonitorWorkspace;
