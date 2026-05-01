"use client";

import { useEffect, useRef } from "react";

/**
 * רקע וידאו בתוך קונטיינר ממוקם (למשל גיבור בלבד): מילוי + זOOM קל כדי לחתוך פסים שחורים בתוך הפריים.
 * הקובץ ב-public — ברירת מחדל: /bg-video.mp4
 */
export default function BackgroundVideo({ src = "/bg-video.mp4" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* נטרול מוחלט של ערוץ האודיו מהווידאו (חלק מהקבצים כוללים פס קול) */
    video.muted = true;
    video.volume = 0;
    video.defaultMuted = true;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncMotionPreference = () => {
      if (motionQuery.matches) {
        video.pause();
        video.removeAttribute("autoplay");
        return;
      }
      video.play().catch(() => {});
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);

    return () => motionQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-sea-salt"
      aria-hidden="true"
    >
      {/* זום אחיד על כל הפריים כדי לדחוף pillarboxing (פסים שחורים בצדדים) מחוץ לחיתוך — בלי עיוות */}
      <video
        ref={videoRef}
        className="absolute left-1/2 top-1/2 min-h-full min-w-full object-cover object-center [transform:translate(-50%,-50%)_scale(1.56)]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
