import AirdropForm from "@/components/airdrop-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AirdropPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Claim SOL Airdrop</CardTitle>
          <CardDescription className="text-center">
            Connect your wallet to claim your tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AirdropForm />
        </CardContent>
      </Card>
    </div>
  );
}
