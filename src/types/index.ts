import { PublicKey } from '@solana/web3.js'

export interface AirdropClaimResponse {
    success: boolean
    signature?: string
    message?: string
}

export interface EligibilityResponse {
    eligible: boolean
    amount: number
    reason?: string
}