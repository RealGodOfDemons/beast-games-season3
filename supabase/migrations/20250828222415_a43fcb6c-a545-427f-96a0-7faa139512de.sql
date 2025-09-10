-- Create games table for MrBeast Games
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prize_amount INTEGER DEFAULT 1000000,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on games table
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Create policy for games (publicly viewable)
CREATE POLICY "Games are publicly viewable" 
ON public.games 
FOR SELECT 
USING (true);

-- Create admin policy for games management
CREATE POLICY "Admins can manage games" 
ON public.games 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create videos table for video booth
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on videos table
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Create policies for videos
CREATE POLICY "Users can view approved videos" 
ON public.videos 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Users can create their own videos" 
ON public.videos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" 
ON public.videos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" 
ON public.videos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create video likes table
CREATE TABLE public.video_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable RLS on video likes
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for video likes
CREATE POLICY "Users can view all video likes" 
ON public.video_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can like videos" 
ON public.video_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike videos" 
ON public.video_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create video comments table
CREATE TABLE public.video_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on video comments
ALTER TABLE public.video_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for video comments
CREATE POLICY "Users can view all video comments" 
ON public.video_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.video_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.video_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.video_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on contact messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for contact messages (only admins can view)
CREATE POLICY "Admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Create game participations table to track user game entries
CREATE TABLE public.game_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, game_id)
);

-- Enable RLS on game participations
ALTER TABLE public.game_participations ENABLE ROW LEVEL SECURITY;

-- Create policies for game participations
CREATE POLICY "Users can view their own participations" 
ON public.game_participations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own participations" 
ON public.game_participations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participations" 
ON public.game_participations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add qualification status to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_paid_entry BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ;

-- Insert sample games
INSERT INTO public.games (title, description, prize_amount) VALUES
('Puzzle Challenge', 'Solve complex puzzles to win the ultimate prize!', 1000000),
('Obstacle Run', 'Navigate through challenging obstacles in record time.', 1000000),
('Treasure Hunt', 'Find hidden treasures using clues and strategy.', 1000000),
('Memory Master', 'Test your memory skills with increasingly difficult patterns.', 1000000),
('Speed Race', 'Race against time in this high-speed challenge.', 1000000);

-- Create triggers for updating timestamps
CREATE TRIGGER update_games_updated_at
BEFORE UPDATE ON public.games
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_comments_updated_at
BEFORE UPDATE ON public.video_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();