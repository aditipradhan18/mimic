export function EvaluationWorkspace({ isOpen, onClose }) {
  const metrics = [
    {
      label: "Workflow Accuracy",
      desc: "Fraction of expert steps correctly mapped into executable graph nodes.",
    },
    {
      label: "Critical-Step Detection",
      desc: "Recall rate of tacit verification points extracted from expert traces.",
    },
    {
      label: "Deviation Precision",
      desc: "Accuracy of flagged novice errors versus harmless workflow variations.",
    },
    {
      label: "Deviation Recall",
      desc: "Preemption rate of novice mistakes before reaching task failure state.",
    },
    {
      label: "Time to Completion",
      desc: "Novice execution speedup relative to static documentation control group.",
    },
    {
      label: "False Interventions",
      desc: "Rate of unnecessary voice interruptions during valid alternative paths.",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="workspace-overlay-backdrop">
      <div className="workspace-overlay-shell">
        <div className="workspace-top-bar">
          <div className="workspace-header-info">
            <span className="workspace-mode-tag">SCIENTIFIC BENCHMARK PROTOCOL</span>
            <h2 className="workspace-title">Workflow Transfer Evaluation Metrics</h2>
          </div>

          <button className="btn-workspace-close" onClick={onClose} aria-label="Close evaluation">
            ✕ CLOSE
          </button>
        </div>

        <div className="workspace-content-body">
          <div className="eval-cards-matrix">
            {metrics.map((m, i) => (
              <div key={i} className="eval-metric-unit">
                <span className="eval-unit-title">{m.label}</span>
                <div className="eval-unit-dash font-mono">—</div>
                <span className="eval-unit-status">Awaiting completed evaluation</span>
                <p className="eval-unit-desc">{m.desc}</p>
              </div>
            ))}
          </div>

          <div className="eval-protocol-footer-box">
            <h4 className="protocol-notice-title">MIMIC Benchmark Standards</h4>
            <p className="protocol-notice-desc">
              To preserve scientific integrity, MIMIC never fabricates benchmark values.
              Quantitative metrics are computed after paired trials with expert demonstration recordings
              and novice evaluation sessions logged against ground truth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluationWorkspace;
