"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useIntro } from "./IntroProvider";

/**
 * Apple device-setup boot: the cursive "hello" writes itself on black,
 * holds, then the curtain lifts while the page settles in underneath.
 * Path traced from Apple's setup screen (github.com/mtynior/AppleHello, MIT)
 * as one continuous stroke, so it draws exactly like the original.
 */
const HELLO_PATH =
  "M 242.5 467.4 C 351 372 304.8 427.6 351 372 C 386.5 329.2 405.1 271.6 390.9 246.8 " +
  "C 338.9 156.6 308 485.3 315.5 485.4 C 323.1 485.4 322.6 389.7 360.9 368 " +
  "C 399.1 346.3 412.5 375.2 414.3 388.7 C 417.1 410.5 405.6 445 407.5 457.6 " +
  "C 415.7 510.1 547.7 458.5 558.1 398.9 C 569.2 334.7 471.4 337.8 490.8 440.3 " +
  "C 497.9 477.9 542 487.6 565.5 482 C 650.4 461.6 708.6 357.6 706.6 277.7 " +
  "C 703.8 174.3 612.6 278.8 634.5 438.2 C 643 499.6 714.8 479.7 736 463.3 " +
  "C 775.2 433.1 844.4 346 831.7 261.5 C 818.5 173.2 719.1 318.6 764.7 450.8 " +
  "C 780 494.9 825.6 480 838.1 473.2 C 867.9 457.1 877.4 398.6 902.1 373.1 " +
  "C 933.2 340.8 982.2 364.9 984.3 403.3 C 988.7 487.7 923.6 487.8 899.4 468.8 " +
  "C 878.4 452.3 873.5 403.4 901.7 373.1 C 921 352.4 951.8 351.9 992.4 375.1 " +
  "C 1009 384.6 1023.2 382.9 1034.3 367.7";

const DRAW_DELAY = 0.5;
const DRAW_DURATION = 3.2;
const DRAW_EASE = [0.6, 0.12, 0.36, 0.96];
const HOLD_AFTER_DRAW_MS = 950;
const CURTAIN_DURATION = 1.15;
const CURTAIN_EASE = [0.83, 0, 0.17, 1];

export default function Preloader() {
  const { stage, beginReveal, finishIntro } = useIntro();
  const holdTimerRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(holdTimerRef.current);
  }, []);

  // Any tap or key skips straight to the reveal.
  useEffect(() => {
    if (stage !== "hello") {
      return undefined;
    }

    const skip = () => beginReveal();
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [stage, beginReveal]);

  if (stage === "done") {
    return null;
  }

  const revealing = stage === "reveal";

  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={{ y: revealing ? "-100%" : "0%" }}
      transition={{ duration: CURTAIN_DURATION, ease: CURTAIN_EASE }}
      onAnimationComplete={() => {
        if (revealing) {
          finishIntro();
        }
      }}
      onPointerDown={() => beginReveal()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform",
      }}
    >
      {/* The word lags the curtain and fades — parallax depth inside the lift. */}
      <motion.div
        initial={false}
        animate={revealing ? { y: "30vh", opacity: 0 } : { y: "0vh", opacity: 1 }}
        transition={{
          y: { duration: CURTAIN_DURATION, ease: CURTAIN_EASE },
          opacity: { duration: CURTAIN_DURATION * 0.72, ease: "easeIn" },
        }}
        style={{ width: "clamp(280px, 62vw, 560px)" }}
      >
        <svg
          viewBox="216 205 844 307"
          fill="none"
          style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
        >
          <motion.path
            d={HELLO_PATH}
            stroke="#ffffff"
            strokeWidth={26}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0.001 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: DRAW_DURATION,
              delay: DRAW_DELAY,
              ease: DRAW_EASE,
            }}
            onAnimationComplete={() => {
              holdTimerRef.current = window.setTimeout(beginReveal, HOLD_AFTER_DRAW_MS);
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
