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
import { checkEligibility, isValidSolanaAddress } from "@/lib/solana";
import { Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const formSchema = z.object({
  address: z
    .string()
    .min(1, { message: "Address is required" })
    .refine(isValidSolanaAddress, { message: "Invalid Solana address" }),
});

type FormValues = z.infer<typeof formSchema>;

const EligibilityChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    eligible: boolean;
    amount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsChecking(true);
    setError(null);
    setResult(null);

    try {
      const eligibility = await checkEligibility(values.address);
      setResult(eligibility);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solana Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your Solana address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isChecking}>
            {isChecking ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Checking...
              </>
            ) : (
              "Check Eligibility"
            )}
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
          {result.eligible ? (
            <>
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium mb-2">Eligible!</h3>
              <p className="text-gray-400">
                This address is eligible to claim{" "}
                <span className="text-primary font-bold">
                  {result.amount} SOL
                </span>{" "}
                tokens
              </p>
              <Button asChild className="mt-4">
                <a href="/airdrop">Claim Now</a>
              </Button>
            </>
          ) : (
            <>
              <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-medium mb-2">Not Eligible</h3>
              <p className="text-gray-400">
                Unfortunately, this address is not eligible for the airdrop
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
