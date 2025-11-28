import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="rounded-full border border-border/60 bg-background/60"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-primary" />
      )}
    </Button>
  );
};

export default ThemeToggle;


