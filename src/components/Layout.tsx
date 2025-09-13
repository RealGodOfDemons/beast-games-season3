import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Home, 
  Video, 
  Gamepad2, 
  CreditCard, 
  Mail, 
  UserPlus, 
  LogIn,
  Trophy,
  Menu,
  LogOut,
} from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 🔹 Get user + listen to auth changes
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.subscription.unsubscribe();
  }, []);

  // 🔹 Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/"); // redirect home after logout
  };

  // 🔹 Redirect if not logged in & trying to access protected pages
  useEffect(() => {
    const publicPaths = ["/", "/login", "/register"];
    if (!user && !publicPaths.includes(location.pathname)) {
      navigate("/login"); // send them to login
    }
  }, [user, location, navigate]);

  // 🔹 Navbar items
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    ...(user
      ? [
          { path: "/video-booth", label: "Video Booth", icon: Video },
          { path: "/games", label: "Games", icon: Gamepad2 },
          { path: "/payment", label: "Payment", icon: CreditCard },
          { path: "/contact", label: "Contact", icon: Mail },
          { path: "/logout", label: "Logout", icon: LogOut, action: handleLogout },
        ]
      : [
          { path: "/register", label: "Register", icon: UserPlus },
          { path: "/login", label: "Sign In", icon: LogIn },
        ]),
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
              <img 
                src="/images/logo.jpg" 
                className="h-8 w-8 text-primary animate-neon-pulse" 
              />
              <span className="text-2xl font-bold beast-gradient">
                MrBeast Games
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                if (item.label === "Logout") {
                  return (
                    <Button
                      key="logout"
                      variant="ghost"
                      className="flex items-center space-x-2"
                      onClick={item.action}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                }
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
                if (item.label === "Logout") {
                  return (
                    <Button
                      key="logout"
                      variant="ghost"
                      className="w-full justify-start flex items-center space-x-2"
                      onClick={() => {
                        item.action?.();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                }
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
              {new Date().getFullYear()} Beast Games Season 3. Win $5,000,000 - Play Now!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Entry fee required. Must be 15+ to participate.
            </p>
            <p>
        By using this site, you agree to our{" "}
        <Link
          to="/privacy-policy"
          className="text-blue-400 hover:underline hover:text-blue-300"
        >
          Privacy Policy
        </Link>
        .
      </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
