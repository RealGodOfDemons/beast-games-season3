import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Mail, 
  MessageCircle, 
  Send, 
  Phone, 
  MapPin,
  Clock,
  HelpCircle,
  Trophy,
  Gamepad2
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          message: formData.message
        });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Failed to Send",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold beast-gradient">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions about MrBeast Games Season 3? Need help with payments or gameplay? 
          We're here to help you win that $1,000,000!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="game-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <MessageCircle className="h-6 w-6 text-primary" />
              <span>Send us a Message</span>
            </CardTitle>
            <p className="text-muted-foreground">
              Get in touch with our support team for any questions or concerns.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Your Name</Label>
                <Input
                  id="contact-name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email Address</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-message">Your Message</Label>
                <Textarea
                  id="contact-message"
                  placeholder="How can we help you with MrBeast Games?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  required
                />
              </div>
              
              <Button
                type="submit" 
                disabled={loading}
                className="w-full beast-button"
              >
                {loading ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-pulse" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Support Info */}
          <Card className="game-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span>Support Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@beastgames3.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (548) 659-8470</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Support Hours</p>
                  <p className="text-sm text-muted-foreground">24/7 During Competition</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Worldwide Competition</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Quick Links */}
          <Card className="game-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-secondary" />
                <span>Quick Help</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-gaming-gold" />
                  <span>How to Win $1,000,000?</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Pay the $50 entry fee, complete all 5 games, and achieve the highest scores to qualify for the grand prize!
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <span>Payment Issues?</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Having trouble with the $50 entry fee payment? Contact us immediately for assistance.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-accent" />
                  <span>Game Access</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Games locked? Make sure you've paid the entry fee and are signed into your account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Community */}
          <Card className="game-card bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <Trophy className="h-12 w-12 text-primary mx-auto animate-neon-pulse" />
              <h3 className="text-xl font-bold beast-gradient">
                Join the Community
              </h3>
              <p className="text-muted-foreground">
                Connect with other players, share strategies, and get the latest updates on MrBeast Games Season 3.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm">
                  <a href="https://www.tiktok.com/@mr_beastoffiicial?_r=1&_d=ej3086ha479152&sec_uid=MS4wLjABAAAAtU8GFR561JOEF3f
                       IklsCOfPnnDW7HhAWppVFmAmdmuL_dZAYrmoG3hfVAvB0DOmN&share_author_id=7528952547664282632&sharer_language=en&source=
                       h5_m&u_code=elcj8ec1e7fgmj&timestamp=1753014212&user_id=7528952547664282632&sec_user_id=MS4wLjABAAAAtU8GFR561JOEF3fIkl
                       sCOfPnnDW7HhAWppVFmAmdmuL_dZAYrmoG3hfVAvB0DOmN&item_author_type=1&utm_source=copy&utm_campaign=client_sh
                       are&utm_medium=android&share_iid=7528952507160332040&share_link_id=7a181750-85f3-459c-ad1d-f28d66599bbc&s
                       hare_app_id=1233&ugbiz_name=ACCOUNT&ug_btm=b8727%2Cb7360&social_share_type=5&enable_checksum=1" >
                        Tik Tok
                  </a>
                </Button>
                <Button variant="outline" size="sm">
                 <a href="https://x.com/MrBeast" target="_blank">X (Twitter)</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Emergency Contact */}
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-6 text-center space-y-2">
          <h3 className="text-lg font-bold text-destructive">
            Emergency Support
          </h3>
          <p className="text-muted-foreground">
            For urgent payment or technical issues during active competition, 
            email <strong>emergency@mrbeastgames.com</strong> for immediate assistance.
          </p>
          <Button>
             <a href="https://wa.me/+15486598470">WhatsApp</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;