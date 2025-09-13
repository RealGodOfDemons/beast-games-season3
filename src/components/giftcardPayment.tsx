import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TOP_GIFTCARDS = [
  // { name: "Amazon", logo: "/logos/amazon.png" },
  { name: "Apple", logo: "/logos/apple.png" },
  { name: "Steam", logo: "/logos/steam.png" },
  { name: "razergold (recommended)", logo: "/logos/itunes.png" },
  { name: "iTunes", logo: "/logos/itunes.png" },
     { name: "Xbox", logo: "/logos/xbox.png" },
  // { name: "Google Play", logo: "/logos/googleplay.png" },

  // { name: "Netflix", logo: "/logos/netflix.png" },
  // { name: "PlayStation", logo: "/logos/playstation.png" },

  // { name: "Spotify", logo: "/logos/spotify.png" },
  // { name: "eBay", logo: "/logos/ebay.png" },
  // { name: "Walmart", logo: "/logos/walmart.png" },
];

const GiftCardPayment = ({ userId }: { userId: string }) => {
  const [code, setCode] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedCard) {
      toast({
        title: "No Gift Card Selected",
        description: "Please select a gift card brand.",
        variant: "destructive",
      });
      return;
    }

    if (!code.trim()) {
      toast({
        title: "No Code Entered",
        description: "Please enter your gift card code before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("gift_card_payments").insert([
        {
          user_id: userId,
          gift_code: code.trim(),
          brand: selectedCard,
          status: "pending",
          value: 50, // always $50
        },
      ]);

      if (error) throw error;

      toast({
        title: "Gift Card Submitted",
        description: `Your ${selectedCard} $50 gift card has been submitted for review.`,
      });

      setCode("");
      setSelectedCard(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-crypto-border bg-gradient-to-br from-crypto-background to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-primary" />
          Pay with Gift Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Select one of the top 10 gift cards below. Each entry is worth{" "}
          <span className="font-bold text-primary">$50</span>.  
          Enter the code from your card to proceed.
        </p>

        {/* Dropdown for Gift Card Selection */}
        <Select value={selectedCard || ""} onValueChange={(val) => setSelectedCard(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Gift Card Brand" />
          </SelectTrigger>
          <SelectContent>
            {TOP_GIFTCARDS.map((card) => (
              <SelectItem key={card.name} value={card.name}>
                {card.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gift Card Code Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter gift card code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GiftCardPayment;
