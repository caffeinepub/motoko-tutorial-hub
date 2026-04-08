import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { SkeletonCard } from "../components/SkeletonCard";
import { TutorialCard } from "../components/TutorialCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCategories,
  useGetTutorials,
  useGetUserProgress,
} from "../hooks/useQueries";

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

type Page = "home" | "tutorials" | "tutorial-detail" | "progress";

interface TutorialsPageProps {
  initialCategory?: string;
  onNavigate: (page: Page, params?: Record<string, string>) => void;
}

export function TutorialsPage({
  initialCategory,
  onNavigate,
}: TutorialsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ?? "All",
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [search, setSearch] = useState("");
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const categoryFilter = selectedCategory === "All" ? null : selectedCategory;
  const difficultyFilter =
    selectedDifficulty === "All" ? null : selectedDifficulty;
  const searchFilter = search.trim() === "" ? null : search.trim();

  const { data: tutorials, isLoading } = useGetTutorials(
    categoryFilter,
    difficultyFilter,
    searchFilter,
  );
  const { data: categories } = useGetCategories();
  const { data: progress } = useGetUserProgress(isAuthenticated);

  const completedIds = new Set(
    (progress ?? []).map((p) => Number(p.tutorialId)),
  );
  const categoryList = ["All", ...(categories ?? []).map(([name]) => name)];

  return (
    <main
      className="max-w-[1200px] mx-auto px-6 py-12"
      data-ocid="tutorials.page"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold">All Tutorials</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive Motoko programming curriculum
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="tutorials.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tutorials..."
            className="pl-9 bg-card border-border"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {categoryList.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid="tutorials.category.tab"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary/50 shadow-teal-glow"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              type="button"
              data-ocid="tutorials.difficulty.tab"
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                selectedDifficulty === diff
                  ? "bg-secondary text-foreground border-border"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <p
        className="text-sm text-muted-foreground mb-6"
        data-ocid="tutorials.result_count"
      >
        {isLoading
          ? "Loading..."
          : `${(tutorials ?? []).length} tutorial${(tutorials ?? []).length !== 1 ? "s" : ""} found`}
      </p>

      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="tutorials.loading_state"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton list
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (tutorials ?? []).length === 0 ? (
        <div
          className="text-center py-20 text-muted-foreground"
          data-ocid="tutorials.empty_state"
        >
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No tutorials found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters or search term
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSelectedCategory("All");
              setSelectedDifficulty("All");
              setSearch("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="tutorials.list"
        >
          {(tutorials ?? []).map((tutorial, i) => (
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
      )}
    </main>
  );
}
