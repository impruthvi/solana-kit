"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWalletEligibility } from "@/lib/hooks/use-wallet";
import { useAirdrop } from "@/lib/hooks/use-airdrop";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const AirdropForm = () => {
  const { connected } = useWallet();
  const {
    isChecking,
    isEligible,
    amount,
    error: eligibilityError,
  } = useWalletEligibility();
  const {
    isClaiming,
    isSuccess,
    signature,
    error: claimError,
    claim,
    reset,
  } = useAirdrop();

  if (!connected) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400 mb-4">
          Please connect your wallet to claim your airdrop
        </p>
        <Button
          onClick={() => {}}
          className="w-full"
          variant="outline"
          disabled
        >
          Connect Wallet First
        </Button>
      </div>
    );
  }

  if (isChecking) {
    return (
      <div className="text-center py-6">
        <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
        <p className="text-gray-400">Checking eligibility...</p>
      </div>
    );
  }

  if (eligibilityError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error checking eligibility: {eligibilityError}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isEligible) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h3 className="text-lg font-medium mb-2">Not Eligible</h3>
        <p className="text-gray-400 mb-4">
          Unfortunately, this wallet is not eligible for the airdrop.
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
        <h3 className="text-lg font-medium mb-2">Airdrop Claimed!</h3>
        <p className="text-gray-400 mb-4">
          You have successfully claimed {amount} SOL tokens.
        </p>
        {signature && (
          <p className="text-xs text-gray-500 break-all mb-4">
            Transaction: {signature}
          </p>
        )}
        <Button onClick={reset} variant="outline" className="w-full">
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-2">
        <h3 className="text-lg font-medium mb-2">Eligible for Airdrop!</h3>
        <p className="text-gray-400">
          You can claim{" "}
          <span className="text-primary font-bold">{amount} SOL</span> tokens
        </p>
      </div>

      {claimError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{claimError}</AlertDescription>
        </Alert>
      )}

      <Button onClick={claim} className="w-full" disabled={isClaiming}>
        {isClaiming ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Claiming...
          </>
        ) : (
          "Claim Airdrop"
        )}
      </Button>
    </div>
  );
};

export default AirdropForm;
