export function Footer({ onOpenGraph, onOpenSignals, onOpenMonitor, onOpenEvaluation }) {
  return (
    <footer className="mimic-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="brand-symbol small">
              <span className="symbol-glass" />
            </span>
            <span className="brand-wordmark">MIMIC</span>
          </div>
          <p className="footer-motto">
            Multimodal AI learning executable workflows from expert demonstrations.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-col">
            <span className="col-title">WORKSPACE</span>
            <button className="footer-link-btn" onClick={onOpenGraph}>Skill Graph DAG</button>
            <button className="footer-link-btn" onClick={onOpenSignals}>Tacit Signal Review</button>
            <button className="footer-link-btn" onClick={onOpenMonitor}>Live Novice Monitor</button>
            <button className="footer-link-btn" onClick={onOpenEvaluation}>Evaluation Protocol</button>
          </div>

          <div className="footer-col">
            <span className="col-title">INFRASTRUCTURE</span>
            <span className="footer-text-item">15 FPS WebM Stream</span>
            <span className="footer-text-item">Opus Audio Capture</span>
            <span className="footer-text-item">Local Telemetry Engine</span>
            <span className="footer-text-item">WebGL Liquid Surface</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom-row">
        <span>© {new Date().getFullYear()} MIMIC · Executable Skill Intelligence</span>
        <span className="footer-mode-pill">MONOCHROME SYSTEM · LOCAL DEMO MODE</span>
      </div>
    </footer>
  );
}

export default Footer;
