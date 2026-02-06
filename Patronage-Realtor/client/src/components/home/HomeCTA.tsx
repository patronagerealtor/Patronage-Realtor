"use client";

import Lottie from "lottie-react";

// IMPORTANT:
// When the file is inside /public, we DO NOT import it.
// We reference it via path using fetch-style loading.

export default function HomeCTA() {
  return (
    <button
      aria-label="Home"
      className="group relative inline-flex items-center justify-center
                 w-20 h-20 cursor-pointer"
    >
      {/* LOTTIE ANIMATION */}
      <Lottie
        animationData={require("../../../public/Hero/home.json")}
        loop
        className="w-14 h-14 transition-all duration-500
                   group-hover:opacity-0 group-hover:scale-75"
      />

      {/* TEXT ON HOVER */}
      <span
        className="absolute opacity-0 scale-75
                   transition-all duration-500
                   group-hover:opacity-100 group-hover:scale-100"
        style={{
          color: "#133E45",
          textShadow: "0 0 10px #133E45, 0 0 20px #133E45",
        }}
      >
        home
      </span>
    </button>
  );
}
