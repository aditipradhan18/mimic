"use client";

import { useRef, useState } from "react";
import type {
  CSSProperties,
  PointerEvent,
} from "react";
import { LiquidMetal } from "@paper-design/shaders-react";
import { motion } from "framer-motion";

interface LiquidMetalHeroProps {
  compact?: boolean;
  onPrimaryCtaClick?: () => void;
}

export default function LiquidMetalHero({
  compact = false,
}: LiquidMetalHeroProps) {
  const visualRef =
    useRef<HTMLDivElement>(null);

  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  const handlePointerMove = (
    event: PointerEvent<HTMLElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) /
        rect.width -
      0.5;

    const y =
      (event.clientY - rect.top) /
        rect.height -
      0.5;

    setPointer({ x, y });

    if (visualRef.current) {
      visualRef.current.style.setProperty(
        "--mx",
        `${x}`
      );

      visualRef.current.style.setProperty(
        "--my",
        `${y}`
      );
    }
  };

  const resetPointer = () => {
    setPointer({
      x: 0,
      y: 0,
    });
  };

  return (
    <div
      className={`liquid-visual ${
        compact ? "compact" : ""
      }`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="liquid-back-glow" />

      <div
        ref={visualRef}
        className="liquid-object-wrapper"
        style={
          {
            "--mx": pointer.x,
            "--my": pointer.y,
          } as CSSProperties
        }
      >
        <div className="liquid-object-ring ring-a" />
        <div className="liquid-object-ring ring-b" />

        <motion.div
          className="liquid-object"
          animate={{
            rotateX: -pointer.y * 8,
            rotateY: pointer.x * 10,
            x: pointer.x * 12,
            y: pointer.y * 12,
          }}
          transition={{
            type: "spring",
            stiffness: 65,
            damping: 18,
          }}
        >
          <LiquidMetal
            width="100%"
            height="100%"
            image="/mimic-knot.svg"
            colorBack="#08080c"
            colorTint="#e8e3ff"
            repetition={2.1}
            softness={0.08}
            shiftRed={0.4}
            shiftBlue={0.65}
            distortion={0.14}
            contour={0.8}
            angle={68}
            speed={0.65}
            scale={0.7}
            fit="contain"
            minPixelRatio={1}
            maxPixelCount={1200000}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        </motion.div>

        <div className="liquid-highlight" />
      </div>

      <div className="liquid-caption">
        <span>01</span>
        <span>LEARN → TRANSFER</span>
      </div>
    </div>
  );
}