'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { claimAirdrop } from '@/lib/solana'
import { SOL_TOKEN_MINT } from '../constants'

interface AirdropState {
    isClaiming: boolean
    isSuccess: boolean
    signature: string | null
    error: string | null
}

export const useAirdrop = () => {
    const { publicKey, connected } = useWallet()
    const [airdropState, setAirdropState] = useState<AirdropState>({
        isClaiming: false,
        isSuccess: false,
        signature: null,
        error: null
    })

    const claim = async () => {
        if (!publicKey || !connected) {
            setAirdropState({
                isClaiming: false,
                isSuccess: false,
                signature: null,
                error: 'Wallet not connected'
            })
            return
        }

        setAirdropState(prev => ({
            ...prev,
            isClaiming: true,
            isSuccess: false,
            signature: null,
            error: null
        }))

        try {
            const result = await claimAirdrop(publicKey.toBase58(), SOL_TOKEN_MINT) // Adjust the amount as needed

            if (result.success) {
                setAirdropState({
                    isClaiming: false,
                    isSuccess: true,
                    signature: result.signature || null,
                    error: null
                })
            } else {
                setAirdropState({
                    isClaiming: false,
                    isSuccess: false,
                    signature: null,
                    error: result.error || 'Failed to claim airdrop'
                })
            }
        } catch (error) {
            setAirdropState({
                isClaiming: false,
                isSuccess: false,
                signature: null,
                error: (error as Error).message
            })
        }
    }

    const reset = () => {
        setAirdropState({
            isClaiming: false,
            isSuccess: false,
            signature: null,
            error: null
        })
    }

    return {
        ...airdropState,
        claim,
        reset
    }
}