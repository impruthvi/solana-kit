import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
} from '@solana/web3.js';
import { SOL_TOKEN_MINT } from './constants';

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
