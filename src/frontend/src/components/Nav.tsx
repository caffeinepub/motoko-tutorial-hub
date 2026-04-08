import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, ChevronDown, LogOut, User } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Page = "home" | "tutorials" | "tutorial-detail" | "progress";

interface NavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Nav({ currentPage, onNavigate }: NavProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { label: "Home", page: "home" as Page },
    { label: "Tutorials", page: "tutorials" as Page },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-teal-glow">
            <span className="text-black font-black text-sm">M</span>
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight">
            Motoko Mastery
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              data-ocid={`nav.${link.page}.link`}
              onClick={() => onNavigate(link.page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  data-ocid="nav.user.button"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onNavigate("progress")}
                  data-ocid="nav.progress.link"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  My Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleAuth}
                  data-ocid="nav.logout.button"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              data-ocid="nav.login.button"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
