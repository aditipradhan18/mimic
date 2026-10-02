import { useRef } from "react";

export function FeatureCard({ number, title, description, tags, onAction, actionLabel }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className="premium-glass-card"
      onMouseMove={handleMouseMove}
    >
      <div className="card-cursor-glow" />
      <div className="card-top-row">
        <span className="card-number-tag">{number}</span>
        <span className="card-pill-tag">{tags}</span>
      </div>

      <div className="card-middle-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>

      {actionLabel && (
        <button className="card-action-btn" onClick={onAction}>
          <span>{actionLabel}</span>
          <span className="btn-arrow">→</span>
        </button>
      )}
    </div>
  );
}

export default FeatureCard;
