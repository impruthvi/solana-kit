import Link from "next/link";
import SiteNav from "@/components/site-nav";
import ConnectWalletButton from "@/components/connect-wallet-button";

const Header = () => {
  return (
    <header className="border-b border-gray-800 bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              SOL Airdrop
            </span>
          </Link>
          <SiteNav className="ml-6 hidden md:flex" />
        </div>
        <div className="flex items-center gap-4">
          <ConnectWalletButton />
        </div>
      </div>
      <SiteNav className="md:hidden border-t border-gray-800 px-4" />
    </header>
  );
};

export default Header;
