import { Contract } from 'ethers'
import { GOVERNANCE_TOKEN_ABI } from '../../ABIs'
import { getProvider, getWalletAddress } from '../provider'

// ============================================
//       컨트랙트 인스턴스 생성
// ============================================
export const getGovernanceTokenContract = async (
  contractAddress: string
): Promise<Contract> => {
  const provider = await getProvider()
  return new Contract(contractAddress, GOVERNANCE_TOKEN_ABI, provider)
}

// ============================================
//       기본 정보 조회 (지갑 연결 불필요)
// ============================================
export interface GovernanceTokenBasicInfo {
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  stoToken: string               // STO 토큰 주소
  owner: string
  clockMode: string              // ERC20Votes clock 모드
  currentClock: string           // 현재 clock (블록 번호 or 타임스탬프)
  contractAddress: string
}

export const getGovernanceTokenBasicInfo = async (
  contractAddress: string
): Promise<GovernanceTokenBasicInfo> => {
  try {
    const contract = await getGovernanceTokenContract(contractAddress)

    const [
      name,
      symbol,
      decimals,
      totalSupply,
      stoToken,
      owner,
      clockMode,
      currentClock,
    ] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
      contract.stoToken(),
      contract.owner(),
      contract.CLOCK_MODE(),
      contract.clock(),
    ])

    return {
      name,
      symbol,
      decimals,
      totalSupply: totalSupply.toString(),
      stoToken,
      owner,
      clockMode,
      currentClock: currentClock.toString(),
      contractAddress,
    }
  } catch (error) {
    console.error('GovernanceToken 기본 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       투표권 조회
// ============================================
export interface VotingPowerInfo {
  currentVotes: string           // 현재 투표권
  balance: string                // 토큰 잔액
  delegatedTo: string            // 위임한 주소
  isDelegated: boolean           // 위임 여부
}

export const getVotingPower = async (
  contractAddress: string,
  holderAddress?: string
): Promise<VotingPowerInfo> => {
  try {
    const contract = await getGovernanceTokenContract(contractAddress)
    const holder = holderAddress || (await getWalletAddress())

    const [currentVotes, balance, delegatedTo] = await Promise.all([
      contract.getVotes(holder),
      contract.balanceOf(holder),
      contract.delegates(holder),
    ])

    return {
      currentVotes: currentVotes.toString(),
      balance: balance.toString(),
      delegatedTo,
      isDelegated: delegatedTo.toLowerCase() !== holder.toLowerCase(),
    }
  } catch (error) {
    console.error('투표권 조회 실패:', error)
    throw error
  }
}

// ============================================
//       과거 투표권 조회
// ============================================
export const getPastVotingPower = async (
  contractAddress: string,
  timepoint: number,
  holderAddress?: string
): Promise<string> => {
  try {
    const contract = await getGovernanceTokenContract(contractAddress)
    const holder = holderAddress || (await getWalletAddress())

    const pastVotes = await contract.getPastVotes(holder, timepoint)
    return pastVotes.toString()
  } catch (error) {
    console.error('과거 투표권 조회 실패:', error)
    throw error
  }
}

// ============================================
//       전체 정보 조회 (지갑 필요)
// ============================================
export interface GovernanceTokenFullInfo extends GovernanceTokenBasicInfo {
  userBalance: string
  userVotingPower: string
  userDelegatedTo: string
  userIsDelegated: boolean
  userAddress: string
}

export const getGovernanceTokenFullInfo = async (
  contractAddress: string
): Promise<GovernanceTokenFullInfo> => {
  try {
    const basicInfo = await getGovernanceTokenBasicInfo(contractAddress)
    const userAddress = await getWalletAddress()
    const votingPowerInfo = await getVotingPower(contractAddress,
userAddress)

    return {
      ...basicInfo,
      userBalance: votingPowerInfo.balance,
      userVotingPower: votingPowerInfo.currentVotes,
      userDelegatedTo: votingPowerInfo.delegatedTo,
      userIsDelegated: votingPowerInfo.isDelegated,
      userAddress,
    }
  } catch (error) {
    console.error('GovernanceToken 전체 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       총 공급량 조회
// ============================================
export const getTotalSupply = async (contractAddress: string): Promise<string> => {
  const contract = await getGovernanceTokenContract(contractAddress)
  const supply = await contract.totalSupply()
  return supply.toString()
}

// ============================================
//       위임 주소 조회
// ============================================
export const getDelegateOf = async (
  contractAddress: string,
  userAddress?: string
): Promise<string> => {
  const contract = await getGovernanceTokenContract(contractAddress)
  const user = userAddress || (await getWalletAddress())
  const delegatee = await contract.delegates(user)
  return delegatee
}

// ============================================
//       자기 자신에게 위임 (트랜잭션)
// ============================================
export const selfDelegate = async (
  contractAddress: string
): Promise<string> => {
  try {
    const provider = await getProvider()
    const signer = await provider.getSigner()
    const userAddress = await signer.getAddress()
    const contract = new Contract(contractAddress, GOVERNANCE_TOKEN_ABI, signer)
    const tx = await contract.delegate(userAddress)
    const receipt = await tx.wait()
    return receipt.hash
  } catch (error) {
    console.error('자기 위임 실패:', error)
    throw error
  }
}
