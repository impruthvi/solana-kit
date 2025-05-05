"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SiteNavProps {
  className?: string;
}

const SiteNav = ({ className }: SiteNavProps) => {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", href: "/" },
    { title: "Airdrop", href: "/airdrop" },
    { title: "Transaction", href: "/transaction" },
    { title: "Create Token", href: "/create-token" },
    { title: "Eligibility", href: "/eligibility" },
    { title: "FAQ", href: "/faq" },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default SiteNav;
