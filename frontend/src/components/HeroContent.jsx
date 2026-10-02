import { AnnouncementBadge } from "./AnnouncementBadge";
import { HeroActions } from "./HeroActions";
import { TrustIndicators } from "./TrustIndicators";

export function HeroContent({ onStartDemo }) {
  return (
    <div className="hero-content-wrapper">
      <div className="hero-badge-slot">
        <AnnouncementBadge />
      </div>

      <h1 className="hero-headline-primary">
        <span className="headline-sans">Teach AI</span>
        <span className="headline-serif">how experts work.</span>
      </h1>

      <p className="hero-supporting-copy">
        MIMIC observes expert demonstrations across screen, voice and interaction traces,
        then turns them into executable workflows that guide a novice in real time.
      </p>

      <div className="hero-cta-slot">
        <HeroActions onStartDemo={onStartDemo} />
      </div>

      <div className="hero-trust-slot">
        <TrustIndicators />
      </div>
    </div>
  );
}

export default HeroContent;
