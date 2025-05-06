"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw } from "lucide-react";
import { getWalletTransactions } from "@/lib/solana";
import Link from "next/link";
import { formatDate, shortenAddress } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";

type Transaction = {
  signature: string;
  blockTime: number | null;
  confirmationStatus: string | null;
  err: Record<string, unknown> | null;
  memo: string | null;
  details: {
    transaction?: {
      message?: {
        instructions?: Array<{
          program: string;
        }>;
      };
    };
  };
};

const TransactionHistoryView = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("All");
  const { publicKey } = useWallet();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    const result = await getWalletTransactions(publicKey?.toString() || "", 10);

    if (result.success && result.transactions) {
      setTransactions(
        result.transactions.map((tx) => ({
          ...tx,
          err: tx.err as Record<string, unknown> | null,
          details: tx.details as Transaction["details"],
        }))
      );
    } else {
      setError(result.error || "Failed to fetch transactions");
    }

    setLoading(false);
  };

  const filteredTransactions =
    selectedType === "All"
      ? transactions
      : transactions.filter((tx) =>
          tx.details?.transaction?.message?.instructions?.some(
            (instr: { program: string }) => instr.program === selectedType
          )
        );

  const transactionTypes = [
    "All",
    ...new Set(
      transactions.flatMap(
        (tx) =>
          tx.details?.transaction?.message?.instructions?.map(
            (instr: { program: string }) => instr.program
          ) || []
      )
    ),
  ];

  return (
    <Card className="w-full border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View your last 10 transactions on Solana
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchTransactions}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filter */}
        <div className="mb-4 flex flex-wrap gap-2">
          {transactionTypes.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>

        {loading && (
          <div className="text-center py-10 text-muted-foreground">
            Loading transactions...
          </div>
        )}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Signature</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => {
                    const program =
                      tx.details?.transaction?.message?.instructions?.[0]
                        ?.program ?? "Unknown";
                    const status = tx.err ? "Failed" : "Success";
                    return (
                      <TableRow key={tx.signature}>
                        <TableCell className="font-mono">
                          {shortenAddress(tx.signature)}
                        </TableCell>
                        <TableCell>{formatDate(tx.blockTime)}</TableCell>
                        <TableCell>{program}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              status === "Success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {status}
                          </span>
                        </TableCell>
                        <TableCell className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <Link
                              href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length}{" "}
                transactions
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistoryView;
