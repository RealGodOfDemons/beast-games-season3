import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Video, 
  Gamepad2, 
  CreditCard, 
  Mail, 
  UserPlus, 
  LogIn,
  Trophy,
  Menu
} from "lucide-react";
import { useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/video-booth", label: "Video Booth", icon: Video },
    { path: "/games", label: "Games", icon: Gamepad2 },
    { path: "/payment", label: "Payment", icon: CreditCard },
    { path: "/contact", label: "Contact", icon: Mail },
    { path: "/register", label: "Register", icon: UserPlus },
    { path: "/login", label: "Sign In", icon: LogIn },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              {/* <Trophy className="h-8 w-8 text-primary animate-neon-pulse" /> */}
              <img src="/images/logo.jpg" className="h-8 w-8 text-primary animate-neon-pulse"/>
              <span className="text-2xl font-bold beast-gradient">
                MrBeast Games
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`flex items-center space-x-2 ${
                        isActive(item.path) ? "neon-glow" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2 animate-slide-in">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start flex items-center space-x-2 ${
                        isActive(item.path) ? "neon-glow" : ""
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
             {new Date().getFullYear()} Beast Games Season 3. Win $1,000,000 - Play Now!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Entry fee required. Must be 15+ to participate.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;