import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Puzzle, 
  Zap, 
  Search, 
  Brain, 
  Timer,
  Trophy,
  Lock,
  Play,
  DollarSign
} from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  prize_amount: number;
  is_active: boolean;
}

interface Profile {
  has_paid_entry: boolean;
}

const Games = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const gameIcons = {
    "Puzzle Challenge": Puzzle,
    "Obstacle Run": Zap,
    "Treasure Hunt": Search,
    "Memory Master": Brain,
    "Speed Race": Timer
  };

  useEffect(() => {
    fetchGames();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_paid_entry')
        .eq('user_id', user.id)
        .single();
      
      setProfile(profile);
    }
  };

  const fetchGames = async () => {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('is_active', true)
        .order('created_at');

      if (error) throw error;
      setGames(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load games.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (gameId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to play games.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!profile?.has_paid_entry) {
      toast({
        title: "Payment Required",
        description: "You need to pay the $50 entry fee to play games.",
        variant: "destructive",
      });
      navigate("/payment");
      return;
    }

    // If paid, start the game
    toast({
      title: "Game Starting!",
      description: "Loading your game. Good luck!",
    });
    // Here you would typically navigate to the actual game or open game modal
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold beast-gradient">Epic Game Challenges</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          5 incredible games await you. Master them all to compete for the $5,000,000 grand prize! or win 1 game and get token of $1,000,000
        </p>
        
        {!user && (
          <div className="bg-card border-2 border-accent rounded-lg p-6 max-w-2xl mx-auto">
            <Lock className="h-8 w-8 text-accent mx-auto mb-2" />
            <p className="text-lg font-semibold text-accent">Sign In Required</p>
            <p className="text-muted-foreground mb-4">
              Create an account to access all games and compete for prizes.
            </p>
            <Link to="/register">
              <Button className="beast-button">
                Create Account
              </Button>
            </Link>
          </div>
        )}

        {user && !profile?.has_paid_entry && (
          <div className="bg-card border-2 border-primary rounded-lg p-6 max-w-2xl mx-auto neon-glow">
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-lg font-semibold text-primary">Entry Fee Required</p>
            <p className="text-muted-foreground mb-4">
              Pay the $50 entry fee to unlock all games and compete for the grand prize.
            </p>
            <Link to="/payment">
              <Button className="beast-button">
                Pay Entry Fee
              </Button>
            </Link>
          </div>
        )}

        {user && profile?.has_paid_entry && (
          <div className="bg-card border-2 border-gaming-gold rounded-lg p-6 max-w-2xl mx-auto">
            <Trophy className="h-8 w-8 text-gaming-gold mx-auto mb-2" />
            <p className="text-lg font-semibold text-gaming-gold">You're Qualified!</p>
            <p className="text-muted-foreground">
              You have full access to all games. Good luck winning the grand prize!
            </p>
          </div>
        )}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {games.map((game) => {
          const IconComponent = gameIcons[game.title as keyof typeof gameIcons] || Trophy;
          const canPlay = user && profile?.has_paid_entry;
          
          return (
            <Card 
              key={game.id} 
              className={`game-card cursor-pointer relative overflow-hidden ${
                canPlay ? 'hover:neon-glow' : 'opacity-75'
              }`}
              onClick={() => handleGameClick(game.id)}
            >
              {!canPlay && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <Lock className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <IconComponent className="h-16 w-16 text-primary animate-float" />
                </div>
                <CardTitle className="text-2xl beast-gradient">{game.title}</CardTitle>
                <div className="flex justify-center space-x-2">
                  <Badge variant="secondary" className="text-gaming-gold">
                    ${game.prize_amount.toLocaleString()}
                  </Badge>
                  {canPlay ? (
                    <Badge variant="default" className="bg-primary">
                      Unlocked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-muted-foreground">
                      Locked
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground text-lg">
                  {game.description}
                </p>
                
                <Button 
                  className={`w-full ${canPlay ? 'beast-button' : 'bg-muted text-muted-foreground'}`}
                  disabled={!canPlay}
                >
                  {canPlay ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Play Now
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Locked
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {games.length === 0 && (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-muted-foreground">No Games Available</h3>
          <p className="text-muted-foreground">Check back soon for new challenges!</p>
        </div>
      )}
    </div>
  );
};

export default Games;