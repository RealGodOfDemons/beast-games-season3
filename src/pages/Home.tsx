import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect , useState } from "react";
import { 
  Trophy, 
  Play, 
  Users, 
  DollarSign, 
  Star,
  Gamepad2,
  Video,
  CreditCard
} from "lucide-react";


const Home = () => {

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // ✅ Run checkUser on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // fetch profile from "profiles" table
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();

        setProfile(profile);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  return (
<div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight">
            <span className="beast-gradient">MrBeast Games</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-secondary">
            Season 3
          </h2>

          {/* ✅ Show username if available */}
          {profile?.full_name ? (
            <p className="text-2xl font-bold mt-4">
              Welcome , <span className="text-primary">{profile.full_name}</span> 👋
            </p>
          ) : user ? (
            <p className="text-xl mt-4 text-muted-foreground">
              Welcome, {user.name}
            </p>
          ) : (
            <p className="text-xl mt-4 text-muted-foreground">
              Please <Link to="/login" className="text-primary underline">sign in</Link>
            </p>
          )}

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            The biggest gaming competition on the planet is back! Compete against players worldwide for your chance to win the ultimate prize.
          </p>
        </div>

        {/* Prize Display */}
        <div className="flex items-center justify-center space-x-4 p-8 bg-card rounded-3xl border-2 border-primary neon-glow animate-neon-pulse max-w-2xl mx-auto">
          <Trophy className="h-16 w-16 text-gaming-gold animate-float" />
          <div className="text-left">
            <p className="text-lg text-muted-foreground">Grand Prize</p>
            <p className="text-5xl font-black beast-gradient">$5,000,000</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/games">
            <Button size="lg" className="beast-button text-xl px-8 py-6">
              <Play className="mr-2 h-6 w-6" />
              Play Now!
            </Button>
          </Link>
          <Link to="/payment">
            <Button variant="outline" size="lg" className="text-xl px-8 py-6 border-2 border-primary hover:bg-primary/10">
              <CreditCard className="mr-2 h-6 w-6" />
              $50 Entry Fee
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="game-card">
          <CardHeader className="text-center">
            <Gamepad2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl">Epic Games</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Challenge yourself with 5 incredible games designed to test your skills, speed, and strategy.
            </p>
            <Link to="/games" className="block mt-4">
              <Button variant="outline" className="w-full">
                View Games
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardHeader className="text-center">
            <Video className="h-12 w-12 text-secondary mx-auto mb-4" />
            <CardTitle className="text-2xl">Video Booth</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Upload your gaming highlights and showcase your skills to the MrBeast Games community.
            </p>
            <Link to="/video-booth" className="block mt-4">
              <Button variant="outline" className="w-full">
                Upload Video
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="game-card">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <CardTitle className="text-2xl">Global Community</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Join millions of players worldwide competing for the ultimate prize in gaming history.
            </p>
            <Link to="/register" className="block mt-4">
              <Button variant="outline" className="w-full">
                Join Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
{/*  */}

<section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
  <img
    src="/images/beast-bliss-2.jpg"
    alt="Epic Games"
    className="w-full h-64 object-cover rounded-xl border"
  />
  <img
    src="/images/beast-bliss.jpg"
    alt="Video Booth"
    className="w-full h-64 object-cover rounded-xl border"
  />
  <img
    src="/images/beast-games-1.jpg"
    alt="Global Community"
    className="w-full h-64 object-cover rounded-xl border"
  />
</section>

      {/* Stats */}
      <section className="bg-card rounded-3xl p-8 border border-border">
        <h3 className="text-3xl font-bold text-center mb-8 beast-gradient">
          Season 3 Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <DollarSign className="h-8 w-8 text-gaming-gold mx-auto mb-2" />
            <p className="text-3xl font-bold text-gaming-gold">$5M</p>
            <p className="text-muted-foreground">Prize Pool</p>
          </div>
          <div>
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-3xl font-bold text-primary">500K+</p>
            <p className="text-muted-foreground">Players</p>
          </div>
          <div>
            <Gamepad2 className="h-8 w-8 text-secondary mx-auto mb-2" />
            <p className="text-3xl font-bold text-secondary">5</p>
            <p className="text-muted-foreground">Epic Games</p>
          </div>
          <div>
            <Star className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-3xl font-bold text-accent">24/7</p>
            <p className="text-muted-foreground">Competition</p>
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="text-center space-y-8">
        <h3 className="text-4xl font-bold beast-gradient">How to Win $5,000,000</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
              1
            </div>
            <h4 className="text-xl font-bold">Register & Pay Entry Fee</h4>
            <p className="text-muted-foreground">
              Create your account and pay the $50 entry fee to unlock all games.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-secondary-foreground">
              2
            </div>
            <h4 className="text-xl font-bold">Play All 5 Games</h4>
            <p className="text-muted-foreground">
              Complete every challenge and achieve the highest scores possible.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gaming-gold rounded-full flex items-center justify-center mx-auto text-2xl font-bold text-primary-foreground">
              3
            </div>
            <h4 className="text-xl font-bold">Win the Grand Prize!</h4>
            <p className="text-muted-foreground">
              Top performers will be eligible for the $1,000,000 grand prize!
            </p>
          </div>
        </div>
      </section>
    </div>
  );

}

export default Home;