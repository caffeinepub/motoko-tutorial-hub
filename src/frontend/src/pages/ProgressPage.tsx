import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Clock, Trophy } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetStats,
  useGetTutorials,
  useGetUserProgress,
} from "../hooks/useQueries";

type Page = "home" | "tutorials" | "tutorial-detail" | "progress";

interface ProgressPageProps {
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProgressPage({ onNavigate }: ProgressPageProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: progress, isLoading: progressLoading } =
    useGetUserProgress(isAuthenticated);
  const { data: allTutorials, isLoading: tutLoading } = useGetTutorials(
    null,
    null,
    null,
  );
  const { data: stats } = useGetStats();

  const totalTutorials = Number(stats?.totalTutorials ?? 0);
  const completedCount = (progress ?? []).length;
  const completionPct =
    totalTutorials > 0
      ? Math.round((completedCount / totalTutorials) * 100)
      : 0;
  const tutorialMap = new Map(
    (allTutorials ?? []).map((t) => [Number(t.id), t]),
  );
  const isLoading = progressLoading || tutLoading;

  if (!isAuthenticated) {
    return (
      <main
        className="max-w-[900px] mx-auto px-6 py-20 text-center"
        data-ocid="progress.page"
      >
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="text-2xl font-bold mb-2">Sign in to track progress</h2>
        <p className="text-muted-foreground mb-6">
          Login to save your completed tutorials and track your learning
          journey.
        </p>
        <Button
          data-ocid="progress.login.button"
          onClick={() => onNavigate("home")}
        >
          Go to Home
        </Button>
      </main>
    );
  }

  return (
    <main
      className="max-w-[900px] mx-auto px-6 py-12"
      data-ocid="progress.page"
    >
      <div className="mb-10">
        <h1 className="text-4xl font-bold">My Progress</h1>
        <p className="text-muted-foreground mt-2">
          Track your Motoko learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="card-surface p-5">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <div className="text-3xl font-bold text-teal">{completedCount}</div>
        </div>
        <div className="card-surface p-5">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-muted-foreground">
              Total Available
            </span>
          </div>
          <div className="text-3xl font-bold">{totalTutorials}</div>
        </div>
        <div className="card-surface p-5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm text-muted-foreground">Completion</span>
          </div>
          <div className="text-3xl font-bold text-green">{completionPct}%</div>
        </div>
      </div>

      <div className="card-surface p-6 mb-10">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-medium">Overall Progress</span>
          <span className="text-muted-foreground">
            {completedCount} / {totalTutorials} tutorials
          </span>
        </div>
        <Progress
          value={completionPct}
          className="h-3"
          data-ocid="progress.progress_bar"
        />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-5">Completed Tutorials</h2>
        {isLoading ? (
          <div className="space-y-3" data-ocid="progress.loading_state">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list, no stable key
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (progress ?? []).length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="progress.empty_state"
          >
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No completed tutorials yet.</p>
            <Button
              variant="outline"
              className="mt-4"
              data-ocid="progress.browse.button"
              onClick={() => onNavigate("tutorials")}
            >
              Browse Tutorials
            </Button>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="progress.list">
            {(progress ?? []).map((p, i) => {
              const tut = tutorialMap.get(Number(p.tutorialId));
              return (
                <button
                  type="button"
                  key={String(p.tutorialId)}
                  data-ocid={`progress.item.${i + 1}`}
                  className="card-surface p-4 flex items-center gap-4 cursor-pointer hover:border-[oklch(0.73_0.11_195/0.4)] transition-colors w-full text-left"
                  onClick={() =>
                    tut && onNavigate("tutorial-detail", { slug: tut.slug })
                  }
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {tut?.title ?? `Tutorial #${String(p.tutorialId)}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tut?.category} · {tut?.difficulty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(p.completedAt)}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
