import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Bitcoin, Wallet, Copy, CheckCircle } from 'lucide-react';

interface CryptoPaymentProps {
  onPaymentInitiated: () => void;
  isLoading: boolean;
}

const CryptoPayment = ({ onPaymentInitiated, isLoading }: CryptoPaymentProps) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const cryptoOptions = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      icon: Bitcoin,
      price: '0.00085',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      color: 'bg-gradient-to-r from-crypto-bitcoin to-amber-500'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: '0.0185',
      address: '0x742c4B63F2b9C2E8b2B5c2e8f2B9C2E8b2B5c2e8',
      icon: "",
      color: 'bg-gradient-to-r from-crypto-ethereum to-blue-500'
    },
    {
      id: 'litecoin',
      name: 'Litecoin',
      symbol: 'LTC',
      price: '0.35',
      address:'0x742c4B63F2b9C2E8b2B5c2e8f2B9C2E8b2B5c2e8',
      icon: Wallet,
      color: 'bg-gradient-to-r from-crypto-litecoin to-gray-500'
    }
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
      description: "Payment address copied to clipboard"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (selectedCrypto) {
    const selected = cryptoOptions.find(c => c.id === selectedCrypto);
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
              <strong>Important:</strong> Send exactly {selected?.price} {selected?.symbol} to the address above. 
              Your qualification will be processed automatically once the transaction is confirmed.
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
                  <div className="font-bold">{crypto.price} {crypto.symbol}</div>
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

export default CryptoPayment;