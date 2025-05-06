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
import { createSolanaToken, isValidSolanaAddress, TokenCreateParams } from "@/lib/solana";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

const formSchema = z.object({
  tokenName: z
    .string()
    .min(1, { message: "Token name is required" }),
  tokenSymbol: z
    .string()
    .min(1, { message: "Token symbol is required" })
    .max(10, { message: "Token symbol should be 10 characters or less" }),
  decimals: z.coerce
    .number()
    .int()
    .min(0, { message: "Decimals must be a non-negative integer" })
    .max(9, { message: "Decimals should be 9 or less for Solana tokens" }),
  totalSupply: z.coerce
    .number()
    .positive({ message: "Total supply must be positive" }),
  mintAuthority: z
    .string()
    .min(1, { message: "Mint authority address is required" })
    .refine(isValidSolanaAddress, { message: "Invalid Solana address" }),
  freezeAuthority: z
    .string()
    .refine(val => val === "" || isValidSolanaAddress(val), { 
      message: "Invalid Solana address" 
    })
    .optional(),
  tokenDescription: z.string().optional(),
  websiteUrl: z.string().url({ message: "Invalid URL" }).optional().or(z.literal("")),
  metadataUri: z.string().url({ message: "Invalid URI" }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const CreateTokenForm = () => {
  const [result, setResult] = useState<{
    transaction: string;
    tokenAddress?: string;
    tokenAccountAddress?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      decimals: 9,
      totalSupply: undefined,
      mintAuthority: "",
      freezeAuthority: "",
      tokenDescription: "",
      websiteUrl: "",
      metadataUri: "",
    },
  });

  const wallet = useWallet();

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      // Create token parameters
      const tokenParams: TokenCreateParams = {
        name: values.tokenName,
        symbol: values.tokenSymbol,
        decimals: values.decimals,
        totalSupply: values.totalSupply,
        mintAuthority: values.mintAuthority,
        freezeAuthority: values.freezeAuthority || null,
        description: values.tokenDescription,
        websiteUrl: values.websiteUrl,
        metadataUri: values.metadataUri,
      };
      
      // Call token creation function
      const result = await createSolanaToken(wallet, tokenParams);
      
      if (!result.success) {
        setError(result.error || "Transaction failed");
        return;
      }
      
      // Set successful result
      if (result.signature) {
        setResult({
          transaction: result.signature,
          tokenAddress: result.tokenAddress,
          tokenAccountAddress: result.tokenAccountAddress
        });
        
        // Reset form after successful submission
        form.reset();
      } else {
        setError("Transaction failed");
      }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required Fields - First Column */}
            <div className="space-y-4">
              <h3 className="font-medium">Required Information</h3>
              
              <FormField
                control={form.control}
                name="tokenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your token name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenSymbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Symbol</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter token symbol (e.g., SOL)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="decimals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decimals</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Decimals"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalSupply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Supply</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Total supply"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="mintAuthority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mint Authority</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter mint authority address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Optional Fields - Second Column */}
            <div className="space-y-4">
              <h3 className="font-medium">Optional Information</h3>
              
              <FormField
                control={form.control}
                name="freezeAuthority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Freeze Authority</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter freeze authority address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter token description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter project website URL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metadataUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata URI</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter metadata URI"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Token..." : "Create Token"}
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
          <h3 className="text-lg font-medium mb-2">Token Created Successfully</h3>
          <p className="text-gray-400">
            You have successfully created your token.
          </p>

          <div className="mt-4 space-y-2 text-sm">
            {result.tokenAddress && (
              <p className="text-gray-400 break-words">
                <span className="font-medium">Token Address:</span>{" "}
                <a
                  href={`https://explorer.solana.com/address/${result.tokenAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {result.tokenAddress.slice(0, 8)}...{result.tokenAddress.slice(-8)}
                </a>
              </p>
            )}
            
            {result.tokenAccountAddress && (
              <p className="text-gray-400 break-words">
                <span className="font-medium">Token Account:</span>{" "}
                <a
                  href={`https://explorer.solana.com/address/${result.tokenAccountAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {result.tokenAccountAddress.slice(0, 8)}...{result.tokenAccountAddress.slice(-8)}
                </a>
              </p>
            )}
            
            <p className="text-gray-400 break-words">
              <span className="font-medium">Transaction:</span>{" "}
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
        </div>
      )}
    </div>
  );
};

export default CreateTokenForm;