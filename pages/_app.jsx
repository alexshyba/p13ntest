import { UniformTracker } from "@uniformdev/optimize-tracker-react";

import "../styles/style.css";

// for locally downloaded intent data and tracker from npm
import { analytics, localTracker } from "../lib/local-tracker";
import { useEffect } from "react";

export default function UniformConfApp({
  Component,
  pageProps,
  tracker,
  scoring,
}) {
  const trackerInstance = tracker || localTracker;

  useEffect(() => {
    if (!pageProps) {
      return;
    }

    analytics.page();
  }, [pageProps]);

  return (
    <UniformTracker
      trackerInstance={trackerInstance}
      initialIntentScores={scoring}
    >
      <Component {...pageProps} />
    </UniformTracker>
  );
}
