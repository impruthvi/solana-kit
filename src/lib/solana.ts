import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    Transaction,
    SystemProgram,
    Keypair,
} from '@solana/web3.js';

import {
    createInitializeMintInstruction,
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    getMinimumBalanceForRentExemptMint,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction
} from '@solana/spl-token';

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

/**
 * Interface for token creation parameters
 */
export interface TokenCreateParams {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: number;
    mintAuthority: string;
    freezeAuthority?: string | null;
    description?: string;
    websiteUrl?: string;
    metadataUri?: string;
}

/**
 * Creates a new Solana SPL Token
 * @param wallet Connected wallet adapter (Phantom, Solflare, etc.)
 * @param tokenParams Token creation parameters
 * @returns Object containing transaction details or error message
 */
export const createSolanaToken = async (
    wallet: WalletContextState,
    tokenParams: TokenCreateParams
): Promise<{
    success: boolean;
    signature?: string;
    error?: string;
    tokenAddress?: string;
    tokenAccountAddress?: string;
}> => {
    try {
        console.log("Creating Solana token with params:", tokenParams);

        // Check if wallet is connected
        if (!wallet || !wallet.publicKey) {
            return {
                success: false,
                error: "Wallet not connected. Please connect your wallet first."
            };
        }

        // Validate mint authority address
        if (!isValidSolanaAddress(tokenParams.mintAuthority)) {
            return {
                success: false,
                error: "Invalid mint authority Solana wallet address."
            };
        }

        // Validate freeze authority if provided
        if (tokenParams.freezeAuthority && !isValidSolanaAddress(tokenParams.freezeAuthority)) {
            return {
                success: false,
                error: "Invalid freeze authority Solana wallet address."
            };
        }

        // Validate decimals
        if (tokenParams.decimals < 0 || tokenParams.decimals > 9) {
            return {
                success: false,
                error: "Decimals must be between 0 and 9."
            };
        }

        // Validate total supply
        if (tokenParams.totalSupply <= 0) {
            return {
                success: false,
                error: "Total supply must be greater than zero."
            };
        }

        // Setup connection
        const connection = getConnection();
        const payer = wallet.publicKey;
        const mintAuthority = new PublicKey(tokenParams.mintAuthority);
        const freezeAuthority = tokenParams.freezeAuthority
            ? new PublicKey(tokenParams.freezeAuthority)
            : null;

        // Create a new mint keypair
        const mintKeypair = Keypair.generate();
        console.log("Token mint address:", mintKeypair.publicKey.toString());

        // Calculate rent-exempt minimum balance
        const requiredLamports = await getMinimumBalanceForRentExemptMint(connection);

        // Check payer's balance
        const payerBalance = await connection.getBalance(payer);
        const estimatedFees = requiredLamports + 10000000; // Add buffer for transaction fees

        if (payerBalance < estimatedFees) {
            return {
                success: false,
                error: `Insufficient balance for token creation. Required: ${estimatedFees / LAMPORTS_PER_SOL} SOL, Available: ${payerBalance / LAMPORTS_PER_SOL} SOL.`
            };
        }

        // Create transaction for token creation
        const transaction = new Transaction();

        // Add instruction to create account for the mint
        transaction.add(
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: mintKeypair.publicKey,
                lamports: requiredLamports,
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID
            })
        );

        // Add instruction to initialize the mint
        transaction.add(
            createInitializeMintInstruction(
                mintKeypair.publicKey,
                tokenParams.decimals,
                mintAuthority,
                freezeAuthority,
                TOKEN_PROGRAM_ID
            )
        );

        // If we want to also mint tokens to owner, we need to create a token account
        // Get the associated token account address
        const associatedTokenAccount = await getAssociatedTokenAddress(
            mintKeypair.publicKey,
            mintAuthority
        );

        // Create associated token account for the token owner
        transaction.add(
            createAssociatedTokenAccountInstruction(
                payer,
                associatedTokenAccount,
                mintAuthority,
                mintKeypair.publicKey
            )
        );

        // Mint tokens to the token account
        const mintAmount = tokenParams.totalSupply * (10 ** tokenParams.decimals);
        transaction.add(
            createMintToInstruction(
                mintKeypair.publicKey,
                associatedTokenAccount,
                mintAuthority,
                BigInt(mintAmount)
            )
        );

        // Set recent blockhash and fee payer
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = payer;

        // Sign transaction with the mint keypair and wallet
        if (!wallet.signTransaction) {
            return {
                success: false,
                error: "Wallet does not support transaction signing"
            };
        }

        // Partially sign with the mint keypair
        transaction.partialSign(mintKeypair);

        // Sign with wallet
        const signedTransaction = await wallet.signTransaction(transaction);

        // Send and confirm transaction
        console.log("Sending token creation transaction...");
        const signature = await connection.sendRawTransaction(signedTransaction.serialize());

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

        console.log("Token creation complete. Signature:", signature);
        console.log("Token Address:", mintKeypair.publicKey.toString());
        console.log("Token Account Address:", associatedTokenAccount.toString());

        // If metadata is provided, we could add metadata but this requires additional setup
        // This would typically use the Metaplex standard to add metadata

        return {
            success: true,
            signature,
            tokenAddress: mintKeypair.publicKey.toString(),
            tokenAccountAddress: associatedTokenAccount.toString()
        };
    } catch (error) {
        console.error("Token creation failed:", error);
        return {
            success: false,
            error: (error as Error).message || "Unknown error occurred during token creation."
        };
    }
};

/**
 * Gets recent transactions for a Solana wallet address
 * @param walletAddress The wallet address to fetch transactions for
 * @param limit Optional maximum number of transactions to return (default: 10)
 * @returns Object containing transactions or error message
 */
export const getWalletTransactions = async (
    walletAddress: string,
    limit: number = 10
): Promise<{
    success: boolean;
    transactions?: Array<any>;
    error?: string;
}> => {
    try {
        console.log("Getting transactions for wallet:", walletAddress);

        if (!isValidSolanaAddress(walletAddress)) {
            return {
                success: false,
                error: "Invalid Solana wallet address."
            };
        }

        const connection = getConnection();
        const publicKey = new PublicKey(walletAddress);

        // Get signatures of recent transactions
        const signatures = await connection.getSignaturesForAddress(
            publicKey,
            { limit },
            'confirmed'
        );

        if (!signatures || signatures.length === 0) {
            return {
                success: true,
                transactions: [] // Return empty array instead of error when no transactions
            };
        }

        // Fetch detailed transaction data for each signature
        const transactions = await Promise.all(
            signatures.map(async (sig) => {
                // Get parsed transaction
                const txData = await connection.getParsedTransaction(
                    sig.signature,
                    {
                        commitment: 'confirmed',
                        maxSupportedTransactionVersion: 0
                    }
                );
                
                // Return combined data
                return {
                    signature: sig.signature,
                    blockTime: sig.blockTime,
                    confirmationStatus: sig.confirmationStatus,
                    err: sig.err,
                    memo: sig.memo,
                    details: txData
                };
            })
        );

        console.log(`Retrieved ${transactions.length} transactions for wallet`);

        return {
            success: true,
            transactions
        };
    } catch (error) {
        console.error("Failed to fetch wallet transactions:", error);
        return {
            success: false,
            error: (error as Error).message || "Unknown error occurred while fetching wallet transactions."
        };
    }
};