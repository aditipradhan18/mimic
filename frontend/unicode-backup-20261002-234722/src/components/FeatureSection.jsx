import { FeatureCard } from "./FeatureCard";

export function FeatureSection({ onOpenCapture, onOpenGraph, onOpenMonitor }) {
  const features = [
    {
      number: "01",
      title: "OBSERVE",
      description: "Capture screen, voice and interaction traces from an expert demonstration.",
      tags: "15FPS · OPUS · DOM TRACE",
      actionLabel: "Launch Capture Studio",
      action: onOpenCapture,
    },
    {
      number: "02",
      title: "UNDERSTAND",
      description: "Extract actions, decision points and observable expert behavior.",
      tags: "MULTIMODAL · DAG · TACIT",
      actionLabel: "Inspect Skill Graph",
      action: onOpenGraph,
    },
    {
      number: "03",
      title: "TRANSFER",
      description: "Guide a novice through the learned workflow with contextual intervention.",
      tags: "LIVE MONITOR · VOICE AGENT",
      actionLabel: "View Novice Monitor",
      action: onOpenMonitor,
    },
  ];

  return (
    <section id="how-it-works" className="mimic-feature-section">
      <div className="feature-section-header">
        <span className="section-label-tag">HOW MIMIC LEARNS</span>
        <h2 className="section-headline">
          <span className="headline-sans">From demonstration</span>
          <span className="headline-serif">to executable skill.</span>
        </h2>
        <p className="section-supporting-para">
          Traditional documentation records what to do. MIMIC encodes the implicit checks,
          hesitations, and mental branching that define true expertise.
        </p>
      </div>

      <div className="feature-cards-grid">
        {features.map((f, i) => (
          <FeatureCard
            key={i}
            number={f.number}
            title={f.title}
            description={f.description}
            tags={f.tags}
            actionLabel={f.actionLabel}
            onAction={f.action}
          />
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
