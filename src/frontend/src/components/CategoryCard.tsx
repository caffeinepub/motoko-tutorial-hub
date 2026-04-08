import {
  BookOpen,
  Box,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Globe,
  Layers,
  Network,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import type React from "react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Basics: <BookOpen className="w-6 h-6" />,
  "Data Types": <Database className="w-6 h-6" />,
  Functions: <Code2 className="w-6 h-6" />,
  Actors: <Cpu className="w-6 h-6" />,
  "State Management": <Layers className="w-6 h-6" />,
  Concurrency: <Zap className="w-6 h-6" />,
  Security: <Shield className="w-6 h-6" />,
  Networking: <Network className="w-6 h-6" />,
  Modules: <Box className="w-6 h-6" />,
  Patterns: <GitBranch className="w-6 h-6" />,
  CLI: <Terminal className="w-6 h-6" />,
  Advanced: <Globe className="w-6 h-6" />,
};

const CATEGORY_COLORS = [
  "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 text-cyan-400",
  "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400",
  "from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400",
  "from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400",
  "from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400",
  "from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-400",
  "from-teal-500/20 to-teal-600/5 border-teal-500/30 text-teal-400",
];

interface CategoryCardProps {
  name: string;
  count: bigint;
  index: number;
  onClick: () => void;
}

export function CategoryCard({
  name,
  count,
  index,
  onClick,
}: CategoryCardProps) {
  const colorClass = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  const icon = CATEGORY_ICONS[name] ?? <BookOpen className="w-6 h-6" />;

  return (
    <button
      type="button"
      data-ocid={`category.item.${index + 1}`}
      className={`cursor-pointer rounded-2xl border bg-gradient-to-br p-5 flex flex-col gap-3 hover:scale-[1.02] transition-all duration-200 text-left w-full ${colorClass}`}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground text-base leading-tight">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {Number(count)} tutorials
        </p>
      </div>
    </button>
  );
}
