'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { checkEligibility } from '@/lib/solana'

interface WalletEligibility {
    isChecking: boolean
    isEligible: boolean
    amount: number
    error: string | null
}

export const useWalletEligibility = () => {
    const { publicKey, connected } = useWallet()
    const [eligibility, setEligibility] = useState<WalletEligibility>({
        isChecking: false,
        isEligible: false,
        amount: 0,
        error: null
    })

    const checkWalletEligibility = async () => {
        if (!publicKey || !connected) {
            setEligibility({
                isChecking: false,
                isEligible: false,
                amount: 0,
                error: 'Wallet not connected'
            })
            return
        }

        setEligibility(prev => ({ ...prev, isChecking: true, error: null }))

        try {
            const address = publicKey.toString()
            const result = await checkEligibility(address)

            setEligibility({
                isChecking: false,
                isEligible: result.eligible,
                amount: result.amount,
                error: null
            })
        } catch (error) {
            setEligibility({
                isChecking: false,
                isEligible: false,
                amount: 0,
                error: (error as Error).message
            })
        }
    }

    useEffect(() => {
        if (connected && publicKey) {
            checkWalletEligibility()
        }
    }, [connected, publicKey])

    return {
        ...eligibility,
        checkEligibility: checkWalletEligibility
    }
}
