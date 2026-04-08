import { CheckCircle2, Clock } from "lucide-react";
import type { TutorialSummary } from "../backend.d";
import { DifficultyPill } from "./DifficultyPill";

interface TutorialCardProps {
  tutorial: TutorialSummary;
  isCompleted?: boolean;
  onClick: () => void;
  index?: number;
}

export function TutorialCard({
  tutorial,
  isCompleted,
  onClick,
  index = 1,
}: TutorialCardProps) {
  return (
    <button
      type="button"
      data-ocid={`tutorial.item.${index}`}
      className="card-surface p-5 flex flex-col gap-3 cursor-pointer hover:border-[oklch(0.73_0.11_195/0.5)] hover:shadow-teal-glow transition-all duration-200 group relative text-left w-full"
      onClick={onClick}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <DifficultyPill difficulty={tutorial.difficulty} />
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {Number(tutorial.estimatedMinutes)} min
        </span>
      </div>
      <h3 className="font-semibold text-foreground group-hover:text-teal transition-colors line-clamp-2 leading-snug">
        {tutorial.title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
        {tutorial.description}
      </p>
      <div className="flex items-center gap-2 pt-1">
        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
          {tutorial.category}
        </span>
      </div>
    </button>
  );
}
