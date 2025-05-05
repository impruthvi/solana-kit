import CreateTokenForm from "@/components/create-token";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateTokenPage() {
  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-center">
            Create Token
          </CardTitle>
          <CardDescription className="text-center">
            Create a new token on the Solana blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTokenForm />
        </CardContent>
      </Card>
    </div>
  );
}
