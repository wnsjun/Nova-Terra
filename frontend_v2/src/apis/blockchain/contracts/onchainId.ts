import { Contract, BrowserProvider, toUtf8Bytes } from 'ethers'
import { ONCHAINID_ABI } from '../../ABIs'
import { getProvider } from '../provider'

// KYC Claim topic 상수
export const CLAIM_TOPICS = {
  KYC: 1,
  ACCREDITED: 2,
  COUNTRY: 3,
} as const

// 컨트랙트 인스턴스 생성
export const getOnchainIdContract = async (
  contractAddress: string
): Promise<Contract> => {
  const provider = await getProvider()
  return new Contract(contractAddress, ONCHAINID_ABI, provider)
}

// Claim 정보 인터페이스
export interface ClaimInfo {
  issuer: string
  data: string  // bytes를 hex string으로
  validFrom: string
  validTo: string
}

// ONCHAINID 기본 정보
export interface OnchainIdInfo {
  owner: string
  contractAddress: string
}

// 기본 정보 가져오기 (owner만)
export const getOnchainIdInfo = async (
  contractAddress: string
): Promise<OnchainIdInfo> => {
  try {
    const contract = await getOnchainIdContract(contractAddress)
    const owner = await contract.owner()

    return {
      owner,
      contractAddress
    }
  } catch (error) {
    console.error('ONCHAINID 정보 조회 실패:', error)
    throw error
  }
}

// 특정 topic의 Claim 정보 가져오기
export const getClaim = async (
  contractAddress: string,
  topic: number
): Promise<ClaimInfo> => {
  try {
    const contract = await getOnchainIdContract(contractAddress)
    const [issuer, data, validFrom, validTo] = await
contract.getClaim(topic)

    return {
      issuer,
      data,
      validFrom: validFrom.toString(),
      validTo: validTo.toString()
    }
  } catch (error) {
    console.error('Claim 조회 실패:', error)
    throw error
  }
}

// Claim 존재 여부 확인
export const hasClaim = async (
  contractAddress: string,
  topic: number
): Promise<boolean> => {
  try {
    const contract = await getOnchainIdContract(contractAddress)
    return await contract.hasClaim(topic)
  } catch (error) {
    console.error('Claim 존재 여부 확인 실패:', error)
    throw error
  }
}

// Claim 유효성 확인
export const isValidClaim = async (
  contractAddress: string,
  topic: number
): Promise<boolean> => {
  try {
    const contract = await getOnchainIdContract(contractAddress)
    return await contract.isValidClaim(topic)
  } catch (error) {
    console.error('Claim 유효성 확인 실패:', error)
    throw error
  }
}

// Claim 추가 (MetaMask 서명 필요)
export const addClaim = async (
  contractAddress: string,
  topic: number,
  data: string
): Promise<string> => {
  try {
    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new Contract(contractAddress, ONCHAINID_ABI, signer)

    const now = Math.floor(Date.now() / 1000)
    const validTo = now + 365 * 24 * 60 * 60 // 1년

    const tx = await contract.addClaim(topic, toUtf8Bytes(data), now, validTo)
    await tx.wait()
    return tx.hash as string
  } catch (error) {
    console.error('Claim 추가 실패:', error)
    throw error
  }
}