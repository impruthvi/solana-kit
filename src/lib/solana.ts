import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    Transaction,
    SystemProgram,
} from '@solana/web3.js';
import { SOL_TOKEN_MINT } from './constants';
import { WalletContextState } from '@solana/wallet-adapter-react';

const getConnection = (() => {
    let connection: Connection | null = null;
    return () => {
        if (!connection) {
            const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');
            connection = new Connection(rpcUrl, {
                commitment: 'confirmed',
                confirmTransactionInitialTimeout: 60000,
            });
            console.log(`Solana connection created with RPC URL: ${rpcUrl}`);
        }
        return connection;
    };
})();

export const isValidSolanaAddress = (address: string): boolean => {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
};

export const checkEligibility = async (
    address: string
): Promise<{ eligible: boolean; amount: number }> => {
    try {
        const publicKey = new PublicKey(address);
        const addressString = publicKey.toString();
        const eligible = addressString.length > 0;
        // const amount = eligible ? Math.floor(Math.random() * 100) + 1 : 0;
        const amount = eligible ? SOL_TOKEN_MINT : 0; // Set a fixed amount for eligible wallets
        return { eligible, amount };
    } catch {
        return { eligible: false, amount: 0 };
    }
};


export const claimAirdrop = async (
    walletAddress: string,
    amount: number = SOL_TOKEN_MINT
): Promise<{
    success: boolean;
    signature?: string;
    error?: string;
    amount?: number;
    newBalance?: number;
}> => {
    try {
        console.log("Claiming airdrop for wallet:", walletAddress);

        if (!isValidSolanaAddress(walletAddress)) {
            return {
                success: false,
                error: "Invalid Solana wallet address.",
            };
        }

        const connection = getConnection();
        const publicKey = new PublicKey(walletAddress);
        const lamports = amount * LAMPORTS_PER_SOL;

        const signature = await connection.requestAirdrop(publicKey, lamports);
        console.log("Airdrop requested, signature:", signature);

        // Poll until confirmed (up to 60s)
        const maxRetries = 30;
        let confirmed = false;

        for (let i = 0; i < maxRetries; i++) {
            const status = await connection.getSignatureStatus(signature);
            const confirmation = status.value?.confirmationStatus;
            if (confirmation === 'confirmed' || confirmation === 'finalized') {
                confirmed = true;
                break;
            }
            await new Promise((res) => setTimeout(res, 2000)); // Wait 2s
        }

        if (!confirmed) {
            throw new Error("Transaction not confirmed after multiple retries.");
        }

        const balance = await connection.getBalance(publicKey);
        return {
            success: true,
            signature,
            amount,
            newBalance: balance / LAMPORTS_PER_SOL,
        };
    } catch (error) {
        return {
            success: false,
            error: (error as Error).message,
        };
    }
};


/**
 * Type definition for wallet interface that should be compatible with most Solana wallets
 */
interface WalletAdapter {
    publicKey: PublicKey;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
    sendTransaction: (
        transaction: Transaction,
        connection: Connection,
        options?: { skipPreflight?: boolean; preflightCommitment?: string }
    ) => Promise<string>;
}

/**
 * Transfers SOL from connected wallet to another address
 * @param wallet Connected wallet adapter (Phantom, Solflare, etc.)
 * @param receiverAddress The wallet address of the receiver
 * @param amount Amount of SOL to transfer
 * @returns Object containing transaction details or error message
 */
export const transferSOL = async (
    wallet: WalletContextState,
    receiverAddress: string,
    amount: number
): Promise<{
    success: boolean;
    signature?: string;
    error?: string;
    amount?: number;
    senderNewBalance?: number;
}> => {
    try {
        console.log("Transferring SOL to:", receiverAddress);

        // Check if wallet is connected
        if (!wallet || !wallet.publicKey) {
            return {
                success: false,
                error: "Wallet not connected. Please connect your wallet first."
            };
        }

        // Validate receiver address
        if (!isValidSolanaAddress(receiverAddress)) {
            return {
                success: false,
                error: "Invalid receiver Solana wallet address."
            };
        }

        // Validate amount
        if (amount <= 0) {
            return {
                success: false,
                error: "Transfer amount must be greater than zero."
            };
        }

        // Setup connection
        const connection = getConnection();
        const senderPublicKey = wallet.publicKey;
        const receiverPublicKey = new PublicKey(receiverAddress);

        // Check sender's balance
        const senderBalance = await connection.getBalance(senderPublicKey);
        const lamportsToSend = amount * LAMPORTS_PER_SOL;

        // Account for transaction fee (approximately 0.000005 SOL or 5000 lamports)
        const estimatedFee = 5000;

        if (senderBalance < lamportsToSend + estimatedFee) {
            return {
                success: false,
                error: `Insufficient balance. Required: ${(lamportsToSend + estimatedFee) / LAMPORTS_PER_SOL} SOL, Available: ${senderBalance / LAMPORTS_PER_SOL} SOL.`
            };
        }

        // Create transfer instruction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderPublicKey,
                toPubkey: receiverPublicKey,
                lamports: lamportsToSend
            })
        );

        // Set recent blockhash and fee payer
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = senderPublicKey;

        // Send transaction using connected wallet
        console.log("Sending transaction...");
        const signature = await wallet.sendTransaction(transaction, connection);


        // Poll until confirmed (up to 60s)
        const maxRetries = 30;
        let confirmed = false;

        for (let i = 0; i < maxRetries; i++) {
            const status = await connection.getSignatureStatus(signature);
            const confirmation = status.value?.confirmationStatus;
            if (confirmation === 'confirmed' || confirmation === 'finalized') {
                confirmed = true;
                break;
            }
            await new Promise((res) => setTimeout(res, 2000)); // Wait 2s
        }

        if (!confirmed) {
            throw new Error("Transaction not confirmed after multiple retries.");
        }

        console.log("Transfer complete. Signature:", signature);

        // Get updated sender balance
        const newSenderBalance = await connection.getBalance(senderPublicKey);

        return {
            success: true,
            signature,
            amount,
            senderNewBalance: newSenderBalance / LAMPORTS_PER_SOL
        };
    } catch (error) {
        console.error("Transfer failed:", error);
        return {
            success: false,
            error: (error as Error).message || "Unknown error occurred during transfer."
        };
    }
};