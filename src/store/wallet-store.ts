import { create } from 'zustand'
import { PublicKey } from '@solana/web3.js'

interface WalletState {
    balance: number | null
    setBalance: (balance: number) => void
    lastRefreshed: Date | null
    refreshBalance: () => void
    isRefreshing: boolean
}

export const useWalletStore = create<WalletState>((set) => ({
    balance: null,
    lastRefreshed: null,
    isRefreshing: false,
    setBalance: (balance) => set({
        balance,
        lastRefreshed: new Date(),
        isRefreshing: false
    }),
    refreshBalance: () => set({ isRefreshing: true })
}))
