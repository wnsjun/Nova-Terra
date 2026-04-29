import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getIdentityAddress } from '../apis/blockchain/contracts/identityRegistry'
import { hasClaim, CLAIM_TOPICS } from '../apis/blockchain/contracts/onchainId'

const REGISTRY_ADDRESS = import.meta.env.VITE_IDENTITY_REGISTRY_ADDRESS as string
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export interface KycStatus {
  isKyc: boolean
  isAccredited: boolean
  isCountry: boolean
  isLoading: boolean
  error: string | null
  refresh: () => void
}

export function useKycStatus(): KycStatus {
  const { walletAddress } = useAuth()
  const [isKyc, setIsKyc] = useState(false)
  const [isAccredited, setIsAccredited] = useState(false)
  const [isCountry, setIsCountry] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    if (!walletAddress || !REGISTRY_ADDRESS) {
      setIsKyc(false)
      setIsAccredited(false)
      setIsCountry(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const onchainIdAddress = await getIdentityAddress(REGISTRY_ADDRESS, walletAddress)

      if (!onchainIdAddress || onchainIdAddress === ZERO_ADDRESS) {
        setIsKyc(false)
        setIsAccredited(false)
        setIsCountry(false)
        return
      }

      const [kyc, accredited, country] = await Promise.all([
        hasClaim(onchainIdAddress, CLAIM_TOPICS.KYC),
        hasClaim(onchainIdAddress, CLAIM_TOPICS.ACCREDITED),
        hasClaim(onchainIdAddress, CLAIM_TOPICS.COUNTRY),
      ])

      setIsKyc(kyc)
      setIsAccredited(accredited)
      setIsCountry(country)
    } catch (err) {
      console.error('KYC 상태 조회 실패:', err)
      setError('KYC 상태를 조회할 수 없습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return { isKyc, isAccredited, isCountry, isLoading, error, refresh: fetchStatus }
}
