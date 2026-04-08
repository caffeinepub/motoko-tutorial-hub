import { Toaster } from "@/components/ui/sonner";
import React, { useState } from "react";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { HomePage } from "./pages/HomePage";
import { ProgressPage } from "./pages/ProgressPage";
import { TutorialDetailPage } from "./pages/TutorialDetailPage";
import { TutorialsPage } from "./pages/TutorialsPage";

type Page = "home" | "tutorials" | "tutorial-detail" | "progress";

interface RouteState {
  page: Page;
  params: Record<string, string>;
}

export default function App() {
  const [route, setRoute] = useState<RouteState>({ page: "home", params: {} });

  const navigate = (page: Page, params: Record<string, string> = {}) => {
    setRoute({ page, params });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Toaster />
      <Nav currentPage={route.page} onNavigate={navigate} />

      <div className="flex-1">
        {route.page === "home" && <HomePage onNavigate={navigate} />}
        {route.page === "tutorials" && (
          <TutorialsPage
            initialCategory={route.params.category}
            onNavigate={navigate}
          />
        )}
        {route.page === "tutorial-detail" && route.params.slug && (
          <TutorialDetailPage slug={route.params.slug} onNavigate={navigate} />
        )}
        {route.page === "progress" && <ProgressPage onNavigate={navigate} />}
      </div>

      <Footer />
    </div>
  );
}
