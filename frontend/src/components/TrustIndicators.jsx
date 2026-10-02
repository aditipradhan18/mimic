export function TrustIndicators() {
  const items = ["SCREEN", "VOICE", "ACTIONS", "DECISIONS"];

  return (
    <div className="trust-metadata-strip">
      {items.map((item, idx) => (
        <span key={item} className="strip-item-wrapper">
          <span className="strip-text">{item}</span>
          {idx < items.length - 1 && <span className="strip-divider">·</span>}
        </span>
      ))}
    </div>
  );
}

export default TrustIndicators;
