import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AirdropTimer from "@/components/airdrop-timer";
import { ArrowRight, Gift, Check, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          SOL Airdrop
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300">
          Claim your share of the Solana airdrop. Connect your wallet and check
          your eligibility now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/airdrop">
              Claim Airdrop <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/eligibility">
              Check Eligibility <Check className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <AirdropTimer />

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="mr-2 h-5 w-5 text-primary" />
              Claim Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Connect your wallet and claim your SOL tokens if you&apos;re eligible
              for the airdrop.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-primary" />
              Check Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Enter your Solana wallet address to check if you&apos;re eligible for
              the airdrop.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-primary" />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Find answers to commonly asked questions about the SOL airdrop.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
