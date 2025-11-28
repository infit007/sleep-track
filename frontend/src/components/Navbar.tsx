import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Home, Target, PlusCircle, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import ThemeToggle from "@/components/ThemeToggle";

interface NavbarProps {
  user?: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border/50 backdrop-blur-lg bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl">SleepTrack</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/log-sleep">
                <Button
                  variant={isActive("/log-sleep") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Log Sleep
                </Button>
              </Link>
              <Link to="/goals">
                <Button
                  variant={isActive("/goals") ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Target className="h-4 w-4" />
                  Goals
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white">
                  Register
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
