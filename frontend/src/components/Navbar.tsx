import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Home, Target, PlusCircle, LogOut, Menu, X, Settings } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border/50 backdrop-blur-lg bg-card/30 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-2xl bg-primary/10">
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <span className="font-bold text-lg sm:text-xl">SleepTrack</span>
          </Link>

          {/* Desktop Navigation */}
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Button>
                </Link>
                <Link to="/log-sleep">
                  <Button
                    variant={isActive("/log-sleep") ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="hidden lg:inline">Log Sleep</span>
                  </Button>
                </Link>
                <Link to="/goals">
                  <Button
                    variant={isActive("/goals") ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Target className="h-4 w-4" />
                    <span className="hidden lg:inline">Goals</span>
                  </Button>
                </Link>
                <Link to="/account">
                  <Button
                    variant={isActive("/account") ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden lg:inline">Account</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
                <ThemeToggle />
              </div>
              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-white text-sm px-3 sm:px-4">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-3 space-y-2">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/log-sleep" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive("/log-sleep") ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                Log Sleep
              </Button>
            </Link>
            <Link to="/goals" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive("/goals") ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Target className="h-4 w-4" />
                Goals
              </Button>
            </Link>
            <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={isActive("/account") ? "default" : "ghost"}
                className="w-full justify-start gap-2"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
