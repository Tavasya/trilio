import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trilio</h1>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/onboarding/1")}>
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 py-12 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Grow Your LinkedIn Presence
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Learn from successful creators who started where you are and achieved your goals
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/onboarding/1")}
            className="px-8 py-6 text-lg"
          >
            Start Your Journey
          </Button>
        </div>
      </main>

      <footer className="border-t">
        <div className="container mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          © 2024 Trilio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}