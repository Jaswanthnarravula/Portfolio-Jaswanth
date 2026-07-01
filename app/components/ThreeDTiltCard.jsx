"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ThreeDTiltCard({
  children,
  isMobile,
  style = {},
  hoverScale = 1.03,
  hoverLift = -6,
  onHoverChange,
}) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (event) => {
    if (isMobile) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltRange = isMobile ? 8 : 20;

    setRotateX((y - 0.5) * -tiltRange);
    setRotateY((x - 0.5) * tiltRange);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      data-cursor="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => onHoverChange?.(true)}
      onHoverEnd={() => onHoverChange?.(false)}
      whileHover={{
        scale: hoverScale,
        y: hoverLift,
        rotateX,
        rotateY,
        z: isMobile ? 24 : 52,
        boxShadow: "0 24px 46px rgba(0, 0, 0, 0.16)",
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
