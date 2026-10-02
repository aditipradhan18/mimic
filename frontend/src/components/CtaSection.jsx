export function CtaSection({ onStartDemo, onOpenSignals, onOpenEvaluation }) {
  return (
    <section className="mimic-cta-section">
      <div className="cta-glass-panel">
        <span className="cta-kicker">MIMIC PROTOCOL</span>
        <h2 className="cta-headline">
          Capture your expert knowledge <br />
          <span className="serif-highlight">before it leaves the room.</span>
        </h2>
        <p className="cta-sub">
          Record one demonstration session. Extract candidate tacit behaviors.
          Deploy executable skill graphs to any junior engineer in minutes.
        </p>

        <div className="cta-buttons-row">
          <button className="btn-hero-primary" onClick={onStartDemo}>
            <span className="btn-glow" />
            <span className="btn-label">START EXPERT DEMONSTRATION</span>
            <span className="btn-arrow">→</span>
          </button>

          <button className="btn-secondary-link" onClick={onOpenSignals}>
            Review Candidate Signals
          </button>

          <button className="btn-secondary-link" onClick={onOpenEvaluation}>
            Transfer Evaluation Protocol
          </button>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
