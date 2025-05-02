import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} SOL Airdrop. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-sm text-gray-400 hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-primary">
              Discord
            </Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-primary">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
