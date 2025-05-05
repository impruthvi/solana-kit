"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { isValidSolanaAddress, transferSOL } from "@/lib/solana";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

const formSchema = z.object({
  recipient: z
    .string()
    .min(1, { message: "Address is required" })
    .refine(isValidSolanaAddress, { message: "Invalid Solana address" }),
  amount: z.coerce
    .number()
    .max(100, { message: "Amount must be less than 100" }),
});

type FormValues = z.infer<typeof formSchema>;

const TransferSolana = () => {
  const [result, setResult] = useState<{
    transaction: string;
    amount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: NaN,
    },
  });

  const wallet = useWallet();

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const result = await transferSOL(wallet, values.recipient, values.amount);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.signature) {
        setResult({
          transaction: result.signature,
          amount: values.amount,
        });
      } else {
        setError("Transaction failed");
      }

      form.reset();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Solana Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Recipient Solana address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount to Transfer (in SOL)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount to transfer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : "Transfer"}
          </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="border rounded-lg p-6 text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">Transaction Successful</h3>
          <p className="text-gray-400">
            You have successfully transferred{" "}
            <span className="text-primary font-bold">{result.amount} SOL</span>{" "}
            tokens
          </p>

          <p className="text-gray-400 break-words">
            Transaction Signature:{" "}
            <a
              href={`https://explorer.solana.com/tx/${result.transaction}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              {result.transaction.slice(0, 8)}...{result.transaction.slice(-8)}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default TransferSolana;
