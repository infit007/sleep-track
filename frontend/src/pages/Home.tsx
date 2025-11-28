import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, BarChart3, Target, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-20 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-gradient-night animate-float">
              <Moon className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-night bg-clip-text text-transparent">
            Track Your Sleep,
            <br />
            Transform Your Life
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your sleep patterns, set goals, and achieve better rest with SleepTrack's
            beautiful analytics and insights.
          </p>
          <div className="flex gap-4 justify-center pt-6">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-primary to-secondary text-white">
                Register
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-lg backdrop-blur-sm bg-card/50 border border-border/50 space-y-4 animate-fade-in">
            <div className="p-3 rounded-full bg-primary/10 w-fit">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Sleep Logging</h3>
            <p className="text-muted-foreground">
              Quickly log your sleep and wake times. We automatically calculate your sleep duration.
            </p>
          </div>

          <div className="p-6 rounded-lg backdrop-blur-sm bg-card/50 border border-border/50 space-y-4 animate-fade-in delay-100">
            <div className="p-3 rounded-full bg-secondary/10 w-fit">
              <BarChart3 className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Visual Analytics</h3>
            <p className="text-muted-foreground">
              See your sleep patterns over time with beautiful charts and weekly summaries.
            </p>
          </div>

          <div className="p-6 rounded-lg backdrop-blur-sm bg-card/50 border border-border/50 space-y-4 animate-fade-in delay-200">
            <div className="p-3 rounded-full bg-accent/10 w-fit">
              <Target className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Set & Track Goals</h3>
            <p className="text-muted-foreground">
              Define your sleep targets and track your progress towards better sleep health.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
