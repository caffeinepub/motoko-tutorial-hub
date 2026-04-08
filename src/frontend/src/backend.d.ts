import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Tutorial {
    id: bigint;
    title: string;
    featured: boolean;
    content: string;
    difficulty: string;
    slug: string;
    tags: Array<string>;
    description: string;
    codeExample: string;
    category: string;
    estimatedMinutes: bigint;
}
export type Time = bigint;
export interface UserProgress {
    completedAt: Time;
    tutorialId: bigint;
}
export interface UserProfile {
    name: string;
}
export interface TutorialSummary {
    id: bigint;
    title: string;
    featured: boolean;
    difficulty: string;
    slug: string;
    description: string;
    category: string;
    estimatedMinutes: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<[string, bigint]>>;
    getFeaturedTutorials(): Promise<Array<TutorialSummary>>;
    getStats(): Promise<{
        totalCompletions: bigint;
        totalUsers: bigint;
        totalTutorials: bigint;
    }>;
    getTutorial(slug: string): Promise<Tutorial>;
    getTutorials(category: string | null, difficulty: string | null, search: string | null): Promise<Array<TutorialSummary>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProgress(): Promise<Array<UserProgress>>;
    isCallerAdmin(): Promise<boolean>;
    markComplete(tutorialId: bigint): Promise<void>;
    markIncomplete(tutorialId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
