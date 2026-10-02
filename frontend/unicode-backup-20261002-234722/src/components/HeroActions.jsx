export function HeroActions({ onStartDemo }) {
  return (
    <div className="hero-actions-group">
      <button className="btn-hero-primary" onClick={onStartDemo}>
        <span className="btn-sheen" />
        <span className="btn-label">START EXPERT DEMONSTRATION</span>
        <span className="btn-arrow">→</span>
      </button>

      <a href="#how-it-works" className="btn-hero-secondary">
        <span>SEE HOW IT WORKS</span>
        <span className="btn-chevron">↓</span>
      </a>
    </div>
  );
}

export default HeroActions;
