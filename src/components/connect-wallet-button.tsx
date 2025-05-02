"use client";

import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

const ConnectWalletButton: FC = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleConnectClick = () => {
    setVisible(true);
  };

  const handleDisconnectClick = () => {
    disconnect();
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm text-gray-300">
          {shortenAddress(publicKey.toString())}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDisconnectClick}
          className="text-gray-400 hover:text-gray-200"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleConnectClick} size="sm">
      <Wallet className="h-4 w-4 mr-2" /> Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
