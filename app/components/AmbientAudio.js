"use client";

import { useEffect, useState } from "react";
import { assetPath } from "../../lib/basePath";

const TARGET_VOLUME = 0.42;

/** אלמנט `<audio>` יחיד לכל האפליקציה — מונע כפילות וניגון כפול (במיוחד ב־Strict Mode). */
let sharedAudioEl = null;

function getSharedAudioElement(src) {
  if (typeof window === "undefined") return null;

  if (!sharedAudioEl) {
    sharedAudioEl = document.createElement("audio");
    sharedAudioEl.loop = true;
    sharedAudioEl.preload = "auto";
    document.body.appendChild(sharedAudioEl);
  }

  const key = src;
  if (sharedAudioEl.dataset.trackSrc !== key) {
    sharedAudioEl.src = src;
    sharedAudioEl.dataset.trackSrc = key;
    sharedAudioEl.load();
  }

  return sharedAudioEl;
}

/** עצירה מיידית — בלי להמתין לסוף קטע */
function hardStop(a) {
  a.pause();
  a.muted = true;
  a.volume = 0;
}

function armForPlayback(a) {
  a.muted = false;
  a.volume = TARGET_VOLUME;
}

export default function AmbientAudio({ src = assetPath("/ambient-river.mp3") }) {
  const [audible, setAudible] = useState(false);

  useEffect(() => {
    const a = getSharedAudioElement(src);
    if (!a) return;

    /* ברירת מחדל: שקט עד שהמשתמש מפעיל מפורשות */
    hardStop(a);
    setAudible(false);

    const sync = () => {
      setAudible(!a.paused && !a.muted && a.volume > 0.001);
    };

    a.addEventListener("play", sync);
    a.addEventListener("playing", sync);
    a.addEventListener("pause", sync);
    a.addEventListener("volumechange", sync);

    return () => {
      a.removeEventListener("play", sync);
      a.removeEventListener("playing", sync);
      a.removeEventListener("pause", sync);
      a.removeEventListener("volumechange", sync);
      hardStop(a);
    };
  }, [src]);

  const toggle = () => {
    const a = getSharedAudioElement(src);
    if (!a) return;

    const on = !a.paused && !a.muted && a.volume > 0.001;

    if (on) {
      hardStop(a);
      setAudible(false);
    } else {
      armForPlayback(a);
      void a.play().catch(() => {
        hardStop(a);
        setAudible(false);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-pressed={audible}
      aria-label={audible ? "Mute ambient river sound" : "Play ambient river sound"}
      className="fixed start-4 top-1/2 z-[100] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-deep-ocean/15 bg-white/75 text-deep-ocean shadow-[0_12px_40px_rgba(30,58,138,0.12)] backdrop-blur-md transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-deep-ocean/40 md:start-6"
    >
      {audible ? (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M17.66 6.34a8 8 0 0 1 0 11.32" />
        </svg>
      ) : (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="m22 9-6 6" />
          <path d="m16 9 6 6" />
        </svg>
      )}
    </button>
  );
}
