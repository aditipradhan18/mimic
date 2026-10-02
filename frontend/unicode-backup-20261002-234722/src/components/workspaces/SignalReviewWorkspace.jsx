import { useState } from "react";
import { logEvent } from "../../eventLogger";

const CANDIDATE_SIGNALS = [
  {
    id: "sig-01",
    title: "Pre-Edit Configuration Inspection",
    summary: "Expert paused before editing auth.py and inspected config.py first.",
    confidence: 87,
    status: "Pending", // "Pending" | "Approved" | "Rejected"
    evidence: {
      pauseDuration: "4.2 seconds hesitation before file modification",
      screenContext: "Active viewport focused on config.py SECRET_KEY resolution",
      actionOrdering: "config.py inspection preceded auth.py write event",
      narration: "'Let me check if secret is loaded from env before touching validator...'",
    },
  },
  {
    id: "sig-02",
    title: "Double Unit-Test Assertion Check",
    summary: "Expert re-ran isolated auth test suite twice before staging git changes.",
    confidence: 92,
    status: "Approved",
    evidence: {
      pauseDuration: "1.8 seconds observing terminal stdout",
      screenContext: "Integrated terminal session running pytest",
      actionOrdering: "Two clean test runs verified before git status check",
      narration: "'Re-running once more to verify idempotence...'",
    },
  },
  {
    id: "sig-03",
    title: "Curl Header Null-Byte Assertion",
    summary: "Expert manually tested empty Bearer header token prior to modifying validator code.",
    confidence: 79,
    status: "Pending",
    evidence: {
      pauseDuration: "3.1 seconds inspecting curl response header",
      screenContext: "Terminal shell executing curl -H 'Authorization: Bearer '",
      actionOrdering: "CLI request executed before code edit block",
      narration: "'Let me verify what response the current server returns for null token.'",
    },
  },
];

export function SignalReviewWorkspace({ isOpen, onClose }) {
  const [signals, setSignals] = useState(CANDIDATE_SIGNALS);

  if (!isOpen) return null;

  const handleDecision = (id, newStatus) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    logEvent("SIGNAL_REVIEW_DECISION", { signalId: id, status: newStatus });
  };

  return (
    <div className="workspace-overlay-backdrop">
      <div className="workspace-overlay-shell">
        <div className="workspace-top-bar">
          <div className="workspace-header-info">
            <span className="workspace-mode-tag">TACIT BEHAVIOR INTELLIGENCE</span>
            <h2 className="workspace-title">Candidate Implicit Expert Signals</h2>
          </div>

          <button className="btn-workspace-close" onClick={onClose} aria-label="Close signal review">
            ✕ CLOSE
          </button>
        </div>

        <div className="workspace-content-body">
          <div className="signals-list-column">
            {signals.map((sig) => (
              <div key={sig.id} className={`signal-review-card status-${sig.status.toLowerCase()}`}>
                <div className="signal-card-top">
                  <div className="signal-title-area">
                    <span className="signal-code font-mono">{sig.id.toUpperCase()}</span>
                    <h3 className="signal-card-headline">{sig.title}</h3>
                  </div>

                  <div className="signal-badge-group">
                    <span className="signal-conf-pill">
                      Confidence: <strong>{sig.confidence}%</strong>
                    </span>
                    <span className={`signal-decision-pill pill-${sig.status.toLowerCase()}`}>
                      {sig.status}
                    </span>
                  </div>
                </div>

                <p className="signal-body-summary">{sig.summary}</p>

                {/* Evidence Matrix */}
                <div className="signal-evidence-table">
                  <div className="evidence-cell">
                    <span className="ev-header">Pause Duration</span>
                    <span className="ev-content">{sig.evidence.pauseDuration}</span>
                  </div>

                  <div className="evidence-cell">
                    <span className="ev-header">Screen Context</span>
                    <span className="ev-content">{sig.evidence.screenContext}</span>
                  </div>

                  <div className="evidence-cell">
                    <span className="ev-header">Action Ordering</span>
                    <span className="ev-content">{sig.evidence.actionOrdering}</span>
                  </div>

                  <div className="evidence-cell">
                    <span className="ev-header">Narration Trace</span>
                    <span className="ev-content italic">{sig.evidence.narration}</span>
                  </div>
                </div>

                <div className="signal-card-foot">
                  <span className="foot-note-text">
                    Human-in-the-loop review: Approving promotes this implicit check into the active skill graph.
                  </span>

                  <div className="signal-action-buttons">
                    <button
                      className={`btn-decision-approve ${sig.status === "Approved" ? "active" : ""}`}
                      onClick={() => handleDecision(sig.id, "Approved")}
                    >
                      ✓ Approve Signal
                    </button>
                    <button
                      className={`btn-decision-reject ${sig.status === "Rejected" ? "active" : ""}`}
                      onClick={() => handleDecision(sig.id, "Rejected")}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignalReviewWorkspace;
