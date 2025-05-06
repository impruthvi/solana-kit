import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AirdropTimer from "@/components/airdrop-timer";
import {
  ArrowRight,
  Gift,
  Check,
  HelpCircle,
  Send,
  PlusCircle,
  Clock,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 py-8">
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          Solana Kit
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300">
          An all-in-one toolkit for Solana — claim airdrops, create tokens,
          transfer SOL, and view your on-chain activity with ease.
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
              Claim Airdrop
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
              Enter your Solana wallet address to see if you qualify for the
              airdrop.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5 text-primary" />
              Create Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Easily create your own SPL token with custom name, symbol, and supply.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5 text-primary" />
              Transfer SOL & Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Send SOL or any SPL token to other wallets using a simple interface.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              View History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Track your recent transactions, token transfers, and airdrop activity.
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
              Find answers to common questions about using Solana Kit and its features.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
