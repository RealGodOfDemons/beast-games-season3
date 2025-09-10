import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Video, 
  Upload, 
  Heart, 
  MessageCircle, 
  Share2, 
  Play,
  User,
  Calendar,
  Eye
} from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  likes_count: number;
  views_count: number;
  created_at: string;
  profiles?: {
    full_name: string;
  } | null;
}

const VideoBoothe = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    videoUrl: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchVideos();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          profiles!videos_user_id_fkey (
            full_name
          )
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos((data as any) || []);
    } catch (error: any) {
      toast({
        title: "Loading",
        description: "Loading Highlights Please Wait...",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to upload videos.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { error } = await supabase
        .from('videos')
        .insert({
          user_id: user.id,
          title: uploadData.title,
          description: uploadData.description,
          video_url: uploadData.videoUrl,
          thumbnail_url: uploadData.videoUrl, // Use video URL as thumbnail for now
        });

      if (error) throw error;

      toast({
        title: "Video Uploaded!",
        description: "Your video has been submitted for review.",
      });
      
      setUploadData({ title: "", description: "", videoUrl: "" });
      setShowUploadForm(false);
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (videoId: string) => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to like videos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('video_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('video_id', videoId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('video_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);
        
        toast({ title: "Unliked!" });
      } else {
        // Like
        await supabase
          .from('video_likes')
          .insert({
            user_id: user.id,
            video_id: videoId
          });
        
        toast({ title: "Liked!" });
      }
      
      fetchVideos();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to like video.",
        variant: "destructive",
      });
    }
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
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold beast-gradient">Video Booth</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Showcase your gaming skills and highlights to the MrBeast Games community!
        </p>
        
        {user ? (
          <Button 
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="beast-button"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        ) : (
          <p className="text-muted-foreground">
            <a href="/login" className="text-primary hover:underline">Sign in</a> to upload your gaming videos!
          </p>
        )}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="game-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Your Gaming Video</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-title">Video Title</Label>
                <Input
                  id="video-title"
                  placeholder="Epic Gaming Moment!"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  placeholder="Tell us about your amazing gaming highlight..."
                  value={uploadData.description}
                  onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="video-url">Video URL</Label>
                <Input
                  id="video-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={uploadData.videoUrl}
                  onChange={(e) => setUploadData({...uploadData, videoUrl: e.target.value})}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  YouTube, Vimeo, or other video platform links
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit" disabled={uploading} className="beast-button">
                  {uploading ? "Uploading..." : "Upload Video"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {videos.map((video) => (
          <Card key={video.id} className="game-card overflow-hidden">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-muted flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <Play className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                {video.views_count} views
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              {/* Video Info */}
              <div>
                <h3 className="font-bold text-lg line-clamp-2 mb-1">
                  {video.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {video.description}
                </p>
              </div>
              
              {/* Creator Info */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{video.profiles?.full_name || "Anonymous"}</span>
                <Calendar className="h-4 w-4 ml-2" />
                <span>{new Date(video.created_at).toLocaleDateString()}</span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(video.id)}
                    className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{video.likes_count}</span>
                  </button>
                  
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>Comment</span>
                  </button>
                </div>
                
                <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-16">
          <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-muted-foreground">No Videos Yet</h3>
          <p className="text-muted-foreground">Be the first to upload your gaming highlights!</p>
        </div>
      )}

    <hr/>


   {/* mrBeastVideos */}
    <h1 className="text-5xl font-bold beast-gradient" style={{ textAlign: "center" , paddingBottom: "1rem" }}>MrBeast Highlights</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/0e3GPea1Tyg"
          title="I Gave $500,000 To Random People"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/pzBi1nwDn8U?si=hh4lpMMronrr-kwH"
          title="Last To Leave Circle Wins $500,000"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/LeYsRMZFUq0?si=q4YaAAENmUXTSXVm"
          title="MrBeast Challenge"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/Y6jC6VaO3j0?si=xVmazaQRhETj66HL"
          title="Giving Away a Private Island"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/IoZri9hq7z4?si=V4IHAUJLHw5iAPwI"
          title="Giving Away a Private Island 2"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/7ESeQBeikKs?si=hSqANNnHR9RQvv8n"
          title="Giving Away a Private Island 3"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/E6E22XQPhhg?si=ROCRE23CunrDFMZ_"
          title="Private Island Giveaway"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/vBpQ1SlfVtU?si=WSEHNapZvtkcwvQX"
          title="Challenge Video"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/kX3nB4PpJko?si=AKo7silUyIJutVja"
          title="MrBeast Video"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/3OFj6l2tQ9s?si=OwnOYetg35bnQ_Tt"
          title="MrBeast Content"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/mwKJfNYwvm8?si=Sk3zxGGD0MjkJEz6"
          title="Beast Video"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>

      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/h5NvTTOlOtI?si=Wjf7r57Eq5MUIKuR"
          title="Island Giveaway"
          allowFullScreen
          className="w-full h-full rounded-xl shadow-md"
        />
      </div>
    </div>

    </div>
  );
};

export default VideoBoothe;