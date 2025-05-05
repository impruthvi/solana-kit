import TransferSolana from "@/components/transfer-solana";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TransactionPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">Transfer Solana</CardTitle>
          <CardDescription className="text-center">
            Enter the recipient&apos;s Solana address and the amount to transfer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransferSolana />
        </CardContent>
      </Card>
    </div>
  );
}
