import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  Loader2,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { DifficultyPill } from "../components/DifficultyPill";
import { MotokoHighlighter } from "../components/MotokoHighlighter";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetTutorial,
  useGetTutorials,
  useGetUserProgress,
  useMarkComplete,
  useMarkIncomplete,
} from "../hooks/useQueries";

type Page = "home" | "tutorials" | "tutorial-detail" | "progress";

interface TutorialDetailPageProps {
  slug: string;
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function TutorialDetailPage({
  slug,
  onNavigate,
}: TutorialDetailPageProps) {
  const [copied, setCopied] = useState(false);
  const [markSuccess, setMarkSuccess] = useState(false);
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: tutorial, isLoading, isError } = useGetTutorial(slug);
  const { data: allTutorials } = useGetTutorials(
    tutorial?.category ?? null,
    null,
    null,
  );
  const { data: progress } = useGetUserProgress(isAuthenticated);
  const markComplete = useMarkComplete();
  const markIncomplete = useMarkIncomplete();

  const isCompleted = (progress ?? []).some(
    (p) => p.tutorialId === tutorial?.id,
  );

  const categoryTutorials = (allTutorials ?? []).sort(
    (a, b) => Number(a.id) - Number(b.id),
  );
  const currentIndex = categoryTutorials.findIndex((t) => t.slug === slug);
  const prevTutorial =
    currentIndex > 0 ? categoryTutorials[currentIndex - 1] : null;
  const nextTutorial =
    currentIndex < categoryTutorials.length - 1
      ? categoryTutorials[currentIndex + 1]
      : null;

  const handleCopy = () => {
    if (!tutorial) return;
    navigator.clipboard.writeText(tutorial.codeExample).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleToggleComplete = async () => {
    if (!tutorial) return;
    try {
      if (isCompleted) {
        await markIncomplete.mutateAsync(tutorial.id);
      } else {
        await markComplete.mutateAsync(tutorial.id);
        setMarkSuccess(true);
        setTimeout(() => setMarkSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <main
        className="max-w-[900px] mx-auto px-6 py-12"
        data-ocid="tutorial_detail.loading_state"
      >
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-12 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-48 w-full rounded bg-muted" />
        </div>
      </main>
    );
  }

  if (isError || !tutorial) {
    return (
      <main
        className="max-w-[900px] mx-auto px-6 py-12"
        data-ocid="tutorial_detail.error_state"
      >
        <p className="text-muted-foreground">Tutorial not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => onNavigate("tutorials")}
        >
          Back to Tutorials
        </Button>
      </main>
    );
  }

  return (
    <main
      className="max-w-[900px] mx-auto px-6 py-12"
      data-ocid="tutorial_detail.page"
    >
      <button
        type="button"
        data-ocid="tutorial_detail.back.button"
        onClick={() => onNavigate("tutorials")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tutorials
      </button>

      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <DifficultyPill difficulty={tutorial.difficulty} />
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
            {tutorial.category}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {Number(tutorial.estimatedMinutes)} min read
          </span>
        </div>
        <h1 className="text-4xl font-extrabold leading-tight mb-4">
          {tutorial.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {tutorial.description}
        </p>
        {tutorial.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tutorial.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <article className="prose prose-invert max-w-none mb-10">
        {tutorial.content.split("\n").map((line, i) =>
          line.trim() === "" ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: static content line index
            <br key={i} />
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: static content line index
            <p key={i} className="text-muted-foreground leading-relaxed mb-3">
              {line}
            </p>
          ),
        )}
      </article>

      {tutorial.codeExample && (
        <section className="mb-12">
          <div
            className="rounded-2xl overflow-hidden"
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
                {tutorial.slug}.mo
              </span>
              <button
                type="button"
                onClick={handleCopy}
                data-ocid="tutorial_detail.code.copy_button"
                className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <div className="p-6">
              <MotokoHighlighter code={tutorial.codeExample} />
            </div>
          </div>
        </section>
      )}

      {isAuthenticated && (
        <section
          className="mb-12 card-surface p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          data-ocid="tutorial_detail.progress.section"
        >
          <div className="flex-1">
            <p className="font-semibold text-foreground">
              {isCompleted
                ? "Tutorial Completed"
                : "Mark this tutorial as complete"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isCompleted
                ? "Great job! Keep up the learning momentum."
                : "Track your progress across all Motoko tutorials."}
            </p>
          </div>
          {markSuccess && (
            <div
              className="flex items-center gap-2 text-sm text-green-400"
              data-ocid="tutorial_detail.progress.success_state"
            >
              <CheckCircle2 className="w-4 h-4" /> Marked complete!
            </div>
          )}
          <Button
            data-ocid={
              isCompleted
                ? "tutorial_detail.mark_incomplete.button"
                : "tutorial_detail.mark_complete.button"
            }
            onClick={handleToggleComplete}
            disabled={markComplete.isPending || markIncomplete.isPending}
            variant={isCompleted ? "outline" : "default"}
            className={
              isCompleted
                ? "border-border"
                : "bg-primary text-primary-foreground"
            }
          >
            {markComplete.isPending || markIncomplete.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : isCompleted ? (
              <Circle className="w-4 h-4 mr-2" />
            ) : (
              <CheckCircle2 className="w-4 h-4 mr-2" />
            )}
            {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          </Button>
        </section>
      )}

      <nav className="flex items-center justify-between gap-4 border-t border-border pt-8">
        {prevTutorial ? (
          <button
            type="button"
            data-ocid="tutorial_detail.prev.button"
            onClick={() =>
              onNavigate("tutorial-detail", { slug: prevTutorial.slug })
            }
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-left">
              <span className="block text-xs uppercase tracking-wide mb-0.5">
                Previous
              </span>
              <span className="font-medium line-clamp-1">
                {prevTutorial.title}
              </span>
            </span>
          </button>
        ) : (
          <div />
        )}
        {nextTutorial ? (
          <button
            type="button"
            data-ocid="tutorial_detail.next.button"
            onClick={() =>
              onNavigate("tutorial-detail", { slug: nextTutorial.slug })
            }
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group ml-auto text-right"
          >
            <span>
              <span className="block text-xs uppercase tracking-wide mb-0.5">
                Next
              </span>
              <span className="font-medium line-clamp-1">
                {nextTutorial.title}
              </span>
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <div />
        )}
      </nav>
    </main>
  );
}
