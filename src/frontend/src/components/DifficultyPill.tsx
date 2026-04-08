import React from "react";

const PILL_STYLES: Record<string, string> = {
  Beginner: "bg-cyan-700/30 text-cyan-300 border border-cyan-700/50",
  Intermediate:
    "bg-emerald-700/30 text-emerald-300 border border-emerald-700/50",
  Advanced: "bg-amber-700/30 text-amber-300 border border-amber-700/50",
  Expert: "bg-red-700/30 text-red-300 border border-red-700/50",
};

export function DifficultyPill({ difficulty }: { difficulty: string }) {
  const style =
    PILL_STYLES[difficulty] ??
    "bg-gray-700/30 text-gray-300 border border-gray-700/50";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${style}`}
    >
      {difficulty}
    </span>
  );
}
