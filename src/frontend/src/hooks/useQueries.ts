import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Tutorial, TutorialSummary, UserProgress } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, bigint]>>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeaturedTutorials() {
  const { actor, isFetching } = useActor();
  return useQuery<TutorialSummary[]>({
    queryKey: ["featuredTutorials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeaturedTutorials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{
    totalCompletions: bigint;
    totalUsers: bigint;
    totalTutorials: bigint;
  }>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return { totalCompletions: 0n, totalUsers: 0n, totalTutorials: 0n };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTutorials(
  category: string | null,
  difficulty: string | null,
  search: string | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<TutorialSummary[]>({
    queryKey: ["tutorials", category, difficulty, search],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTutorials(category, difficulty, search);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTutorial(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Tutorial>({
    queryKey: ["tutorial", slug],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTutorial(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useGetUserProgress(isAuthenticated: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProgress[]>({
    queryKey: ["userProgress"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserProgress();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useMarkComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tutorialId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.markComplete(tutorialId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    },
  });
}

export function useMarkIncomplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tutorialId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.markIncomplete(tutorialId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProgress"] });
    },
  });
}
