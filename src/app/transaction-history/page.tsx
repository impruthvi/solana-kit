import TransactionHistoryView from "@/components/transaction-history-view";

export default function TransactionHistoryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Transaction History
      </h1>
      <TransactionHistoryView />
    </div>
  );
}
