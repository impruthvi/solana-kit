import EligibilityChecker from "@/components/eligibility-checker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EligibilityPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Check Eligibility</CardTitle>
          <CardDescription className="text-center">
            Enter your Solana address to check if you&apos;re eligible for the
            airdrop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EligibilityChecker />
        </CardContent>
      </Card>
    </div>
  );
}
