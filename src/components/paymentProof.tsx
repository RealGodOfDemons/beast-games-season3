import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
        .from("payment-proofs") // bucket name
        .upload(`${userId}/${Date.now()}-${file.name}`, file);

      if (error) throw error;

      // Save record in DB for admin review
      const { error: dbError } = await supabase
        .from("crypto_payments")
        .insert([
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
        description: err.message === "new row violates row-level security policy" ? "Your payment proof has already been submitted, wait for confirmation." : err.message,
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

export default PaymentProofUpload;
