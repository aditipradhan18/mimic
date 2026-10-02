import { HeroContent } from "./HeroContent";
import { LiquidWave } from "./LiquidWave";

export function Hero({ onStartDemo, scrollY = 0 }) {
  // Subtle artistic fade and vertical lift on scroll
  const scrollRatio = Math.min(scrollY / 600, 1.0);
  const contentOpacity = Math.max(1.0 - scrollRatio * 1.15, 0.0);
  const contentTranslateY = scrollRatio * -32;

  return (
    <section id="top" className="mimic-hero-section">
      {/* Background Liquid Glass Wave */}
      <LiquidWave scrollY={scrollY} />

      {/* Foreground Hero Content */}
      <div
        className="hero-foreground-container"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentTranslateY}px)`,
        }}
      >
        <HeroContent onStartDemo={onStartDemo} />
      </div>
    </section>
  );
}

export default Hero;
