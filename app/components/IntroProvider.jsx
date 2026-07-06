"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

/**
 * Boot intro stages:
 *  "hello"  – black curtain up, the cursive hello draws itself
 *  "reveal" – curtain lifts while the page parallax-settles into place
 *  "done"   – intro dismissed, page fully interactive
 */
const IntroContext = createContext({
  stage: "done",
  beginReveal: () => {},
  finishIntro: () => {},
});

export function useIntro() {
  return useContext(IntroContext);
}

export default function IntroProvider({ children }) {
  const [stage, setStage] = useState("hello");

  // Returning visitors (and reduced-motion users) skip before first paint.
  useLayoutEffect(() => {
    const seen = window.sessionStorage.getItem("hello-intro-seen") === "1";
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (seen || prefersReducedMotion) {
      window.sessionStorage.setItem("hello-intro-seen", "1");
      setStage("done");
    }
  }, []);

  useEffect(() => {
    if (stage === "done") {
      document.documentElement.style.overflow = "";
      return undefined;
    }

    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [stage]);

  const beginReveal = useCallback(() => {
    window.sessionStorage.setItem("hello-intro-seen", "1");
    setStage((previous) => (previous === "hello" ? "reveal" : previous));
  }, []);

  const finishIntro = useCallback(() => {
    setStage("done");
  }, []);

  const value = useMemo(
    () => ({ stage, beginReveal, finishIntro }),
    [stage, beginReveal, finishIntro],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
