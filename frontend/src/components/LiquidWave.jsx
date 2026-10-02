import React, { useEffect, useRef } from "react";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";

export default function LiquidWave() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frame;

    const handlePointerMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;

      container.style.setProperty("--mx", x.toFixed(4));
      container.style.setProperty("--my", y.toFixed(4));
    };

    const animate = () => {
      const time = performance.now() * 0.00008;

      container.style.setProperty(
        "--float-x",
        `${Math.sin(time * 1.7) * 8}px`
      );

      container.style.setProperty(
        "--float-y",
        `${Math.cos(time * 1.35) * 8}px`
      );

      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="liquid-wave-container"
      aria-hidden="true"
    >
      <div className="liquid-wave-orb">
        <LiquidMetal
          {...liquidMetalPresets[2]}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>

      <div className="liquid-orb-glow" />
      <div className="liquid-orb-highlight" />
    </div>
  );
}