import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { TutorialSummary } from "../backend.d";
import { CategoryCard } from "../components/CategoryCard";
import { MotokoHighlighter } from "../components/MotokoHighlighter";
import { SkeletonCard, SkeletonCategory } from "../components/SkeletonCard";
import { TutorialCard } from "../components/TutorialCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCategories,
  useGetFeaturedTutorials,
  useGetStats,
  useGetUserProgress,
} from "../hooks/useQueries";

const HERO_CODE = `// Motoko Actor Example
actor Counter {
  stable var count : Nat = 0;

  public func increment() : async Nat {
    count += 1;
    return count;
  };

  public query func getCount() : async Nat {
    return count;
  };
}`;

type Page = "home" | "tutorials" | "tutorial-detail" | "progress";

interface HomePageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [copied, setCopied] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: categories, isLoading: catsLoading } = useGetCategories();
  const { data: featured, isLoading: featLoading } = useGetFeaturedTutorials();
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: progress } = useGetUserProgress(isAuthenticated);

  const completedIds = new Set(
    (progress ?? []).map((p) => Number(p.tutorialId)),
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(HERO_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const statItems = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Total Tutorials",
      value: statsLoading
        ? "—"
        : Number(stats?.totalTutorials ?? 0).toLocaleString(),
      colorClass: "text-teal",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Completions",
      value: statsLoading
        ? "—"
        : Number(stats?.totalCompletions ?? 0).toLocaleString(),
      colorClass: "text-green",
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Active Learners",
      value: statsLoading
        ? "—"
        : Number(stats?.totalUsers ?? 0).toLocaleString(),
      colorClass: "text-amber-brand",
    },
  ];

  return (
    <main className="max-w-[1200px] mx-auto px-6">
      {/* Hero */}
      <section
        className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        data-ocid="home.section"
      >
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary text-xs font-medium text-muted-foreground w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.73_0.11_195)] animate-pulse" />
            The Internet Computer's Native Language
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Master{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.73 0.11 195), oklch(0.77 0.16 157))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Motoko
            </span>{" "}
            Programming
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            From first steps to advanced patterns — structured tutorials
            covering actors, concurrency, state management, and more.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              data-ocid="home.start_learning.primary_button"
              onClick={() => onNavigate("tutorials")}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-teal-glow"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              data-ocid="home.browse.secondary_button"
              onClick={() => onNavigate("tutorials")}
              className="gap-2 border-border hover:bg-secondary"
            >
              Browse Tutorials
            </Button>
          </div>
        </div>

        {/* Code Preview Card */}
        <div className="relative">
          <div
            className="rounded-2xl overflow-hidden shadow-teal-glow"
            style={{
              background: "oklch(0.09 0.015 240)",
              border: "1px solid oklch(0.22 0.02 220)",
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">
                counter.mo
              </span>
              <button
                type="button"
                onClick={handleCopy}
                data-ocid="home.code.copy_button"
                className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="p-5">
              <MotokoHighlighter code={HERO_CODE} />
            </div>
          </div>
          <div
            className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.73 0.11 195 / 0.15), transparent 70%)",
            }}
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6" data-ocid="home.stats.section">
        <div
          className="rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-px overflow-hidden"
          style={{
            background: "oklch(0.21 0.018 224)",
            border: "1px solid oklch(0.21 0.018 224)",
          }}
        >
          {statItems.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col sm:flex-row items-center gap-3 p-6 bg-card"
            >
              <div className={stat.colorClass}>{stat.icon}</div>
              <div className="text-center sm:text-left">
                <div className={`text-2xl font-bold ${stat.colorClass}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16" data-ocid="home.categories.section">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Explore Motoko Categories</h2>
          <p className="text-muted-foreground mt-2">
            Structured learning paths for every aspect of Motoko development
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {catsLoading
            ? Array.from({ length: 7 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
                <SkeletonCategory key={i} />
              ))
            : (categories ?? []).map(([name, count], i) => (
                <CategoryCard
                  key={name}
                  name={name}
                  count={count}
                  index={i}
                  onClick={() => onNavigate("tutorials", { category: name })}
                />
              ))}
        </div>
      </section>

      {/* Featured Tutorials */}
      <section className="py-16" data-ocid="home.featured.section">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold">Featured Tutorials</h2>
            <p className="text-muted-foreground mt-2">
              Hand-picked tutorials to get you started
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("tutorials")}
            data-ocid="home.view_all.button"
            className="text-teal hover:text-teal gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
                <SkeletonCard key={i} />
              ))
            : (featured ?? [])
                .slice(0, 6)
                .map((tutorial: TutorialSummary, i) => (
                  <TutorialCard
                    key={String(tutorial.id)}
                    tutorial={tutorial}
                    isCompleted={completedIds.has(Number(tutorial.id))}
                    onClick={() =>
                      onNavigate("tutorial-detail", { slug: tutorial.slug })
                    }
                    index={i + 1}
                  />
                ))}
        </div>
      </section>
    </main>
  );
}
