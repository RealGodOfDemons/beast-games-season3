import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import GiftCardPayment from "@/components/giftcardPayment";
import {
  CreditCard,
  Shield,
  Check,
  Trophy,
  Zap,
  Gamepad2,
  Video,
  Bitcoin,
  Wallet,
  Copy,
  CheckCircle,
} from "lucide-react";
import { createLucideIcon } from "lucide-react";

/* ------------------ Ethereum Icon ------------------ */
export const Ethereum = createLucideIcon("Ethereum", [
  ["path", { d: "M12 2L4 12l8 4 8-4-8-10z", key: "eth-top" }],
  ["path", { d: "M12 16v6l8-10", key: "eth-bottom-right" }],
  ["path", { d: "M12 16v6l-8-10", key: "eth-bottom-left" }],
]);

/* ------------------ PaymentProofUpload ------------------ */
const PaymentProofUpload = ({ userId }: { userId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload your payment proof before confirming.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .upload(`${userId}/${Date.now()}-${file.name}`, file);

      if (error) throw error;

      // Save record in DB
      const { error: dbError } = await supabase.from("crypto_payments" as any).insert([
        {
          user_id: userId,
          proof_url: data?.path,
          status: "pending",
        },
      ]);

      if (dbError) throw dbError;

      toast({
        title: "Proof Submitted",
        description: "Your payment proof has been uploaded. We’ll confirm soon.",
      });

      setFile(null);
    } catch (err: any) {
      toast({
        title: "Uploading",
        description:
          err.message ===
          "new row violates row-level security policy"
            ? "Your payment proof has already been submitted, wait for confirmation."
            : err.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      <Button
        onClick={handleConfirm}
        disabled={uploading}
        className="w-full beast-button"
      >
        {uploading ? "Uploading..." : "Confirm Payment"}
      </Button>
    </div>
  );
};

/* ------------------ CryptoPayment ------------------ */
interface CryptoPaymentProps {
  onPaymentInitiated: () => void;
  isLoading: boolean;
}

const CryptoPayment = ({ onPaymentInitiated, isLoading }: CryptoPaymentProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const cryptoOptions = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: "0.00044",
      address: "bc1q20var9wpmf6xtkkh6dnqrhs9emaujsjcrg0504",
      icon: Bitcoin,
      color: "bg-gradient-to-r from-crypto-bitcoin to-amber-500",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: "0.011",
      address: "0x56E25C15AC77180E8CA65950A92eF9c9F549781f",
      icon: Ethereum,
      color: "bg-gradient-to-r from-crypto-ethereum to-blue-500",
    },
    {
      id: "litecoin",
      name: "Litecoin",
      symbol: "LTC",
      price: "0.44",
      address: "ltc1qa0uad7ln9lse0glzwdvwxjpdxena8afge9vga6",
      icon: Wallet,
      color: "bg-gradient-to-r from-crypto-litecoin to-gray-500",
    },
    {
      id: "USDT-TRC20",
      name: "USD Tether (TRC20)",
      symbol: "USDT-TRC20",
      price: "50.01",
      address: "TEE8xp9pAguyPnPKuMmpRHKBZVdfMuTL89",
      icon: Wallet,
      color: "bg-gradient-to-r from-crypto-tron to-red-500",
    },
    {
      id: "BNB",
      name: "Binance Coin",
      symbol: "BNB",
      price: "0.057",
      address: "bnb1g3h4x3j6m5z5j5f5g5h5j5k5l5m5n5p5q5r5s5",
      icon: Wallet,
      color: "bg-gradient-to-r from-crypto-bnb to-yellow-400",
    },
  ];

  const handleCryptoSelect = (crypto: any) => {
    setSelectedCrypto(crypto.id);
    setPaymentAddress(crypto.address);
    onPaymentInitiated();
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(paymentAddress);
    setCopied(true);
    toast({
      title: "Address Copied",
      description: "Payment address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (selectedCrypto) {
    const selected = cryptoOptions.find((c) => c.id === selectedCrypto);
    const IconComponent = selected?.icon || Bitcoin;

    return (
      <Card className="border-crypto-border bg-gradient-to-br from-crypto-background to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconComponent className="w-6 h-6 text-crypto-bitcoin" />
            Pay with {selected?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 border border-crypto-border rounded-lg bg-gradient-to-r from-crypto-bitcoin/10 to-crypto-ethereum/10">
            <div className="text-3xl font-bold mb-2">
              {selected?.price} {selected?.symbol}
            </div>
            <p className="text-sm text-muted-foreground">≈ $50 USD</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Send to this address:</label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm break-all">{paymentAddress}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="shrink-0"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> Send exactly {selected?.price}{" "}
              {selected?.symbol} to the address above. Your qualification will be
              processed automatically once the transaction is confirmed.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setSelectedCrypto(null)}
          >
            Choose Different Cryptocurrency
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-crypto-border bg-gradient-to-br from-crypto-background to-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="w-6 h-6 text-crypto-bitcoin" />
          Pay with Cryptocurrency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {cryptoOptions.map((crypto) => {
            const IconComponent = crypto.icon;
            return (
              <Button
                key={crypto.id}
                variant="outline"
                className={`w-full p-6 h-auto flex items-center justify-between hover:shadow-crypto transition-all duration-300 ${crypto.color} hover:text-white border-crypto-border`}
                onClick={() => handleCryptoSelect(crypto)}
                disabled={isLoading}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-8 h-8" />
                  <div className="text-left">
                    <div className="font-semibold">{crypto.name}</div>
                    <div className="text-sm opacity-80">{crypto.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {crypto.price} {crypto.symbol}
                  </div>
                  <div className="text-sm opacity-80">≈ $50</div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Secure • Fast • Global
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

/* ------------------ Main Payment Component ------------------ */
const Payment = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setProfile(profile);

        if (profile?.has_paid_entry) {
          toast({
            title: "Already Qualified!",
            description:
              "You have already paid the entry fee and can play all games.",
          });
          navigate("/games");
        }
      }
    } catch (error: any) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoPaymentInitiated = () => {
    toast({
      title: "Crypto Payment Initiated",
      description:
        "Follow the instructions to complete your cryptocurrency payment",
    });
  };

  const handleCardPayment = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to make a payment.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { amount: 5000 }, // $50.00 in cents
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast({
          title: "Payment Processing",
          description: "Redirecting to secure payment...",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description:
          error.message === "Edge Function returned a non-2xx status code"
            ? "Something went wrong, please try crypto payment"
            : error.message ||
              "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
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

  if (!user) {
    return (
      <div className="text-center space-y-8 py-16">
        <Trophy className="h-24 w-24 text-primary mx-auto animate-neon-pulse" />
        <div className="space-y-4">
          <h1 className="text-4xl font-bold beast-gradient">
            Payment Required
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            You need to sign in before making a payment to participate in
            MrBeast Games.
          </p>
          <Button onClick={() => navigate("/login")} className="beast-button">
            Sign In to Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold beast-gradient">Entry Fee Payment</h1>
        <p className="text-xl text-muted-foreground">
          Pay the $50 entry fee to unlock all games and compete for $1,000,000!
        </p>
      </div>

      {/* What You Get */}
      <Card className="game-card">
        <CardHeader>
          <CardTitle className="text-center text-2xl beast-gradient">
            What You Get for $50
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <Gamepad2 className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-bold">5 Epic Games</h3>
              <p className="text-sm text-muted-foreground">
                Access to all gaming challenges
              </p>
            </div>
            <div className="text-center space-y-2">
              <Trophy className="h-12 w-12 text-gaming-gold mx-auto" />
              <h3 className="font-bold">$5M Prize Pool</h3>
              <p className="text-sm text-muted-foreground">
                Compete for the grand prize
              </p>
            </div>
            <div className="text-center space-y-2">
              <Video className="h-12 w-12 text-secondary mx-auto" />
              <h3 className="font-bold">Video Booth</h3>
              <p className="text-sm text-muted-foreground">
                Share your gaming highlights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Options */}
      <div className="space-y-4">
        <CryptoPayment
          onPaymentInitiated={handleCryptoPaymentInitiated}
          isLoading={processing}
        />

        {/* Payment Proof Upload */}
        <Card className="border-crypto-border bg-gradient-to-br from-crypto-background to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-green-500" />
              Upload Payment Proof
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              After sending your crypto payment, please upload a screenshot or
              proof of the transaction below. Our team will review it and
              confirm your entry.
            </p>
            <PaymentProofUpload userId={user.id} />
          </CardContent>
        </Card>
      </div>
      
      {/* Credit */}
  <GiftCardPayment userId={user.id} />

      {/* Security Notice */}
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Secure Payment Guarantee</h3>
              <p className="text-muted-foreground">
                Your payment information is protected by industry-standard
                encryption. We never store your card details, and all
                transactions are processed through secure, PCI-compliant payment
                processors.
              </p>
              <p className="text-sm text-muted-foreground">
                Questions about payment? Contact our support team 24/7.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
