import { Contract } from 'ethers'
import { GOVERNANCE_ABI } from '../../ABIs'
import { getProvider, getWalletAddress } from '../provider'

// ============================================
//       컨트랙트 인스턴스 생성
// ============================================
export const getGovernanceContract = async (
  contractAddress: string
): Promise<Contract> => {
  const provider = await getProvider()
  return new Contract(contractAddress, GOVERNANCE_ABI, provider)
}

// ============================================
//       기본 정보 조회 (지갑 연결 불필요)
// ============================================
export interface GovernanceBasicInfo {
  governanceToken: string        // GovernanceToken 주소
  proposalCount: string
  votingPeriod: string           // 초 단위
  votingPeriodDays: number       // 일 단위
  contractAddress: string
}

export const getGovernanceBasicInfo = async (
  contractAddress: string
): Promise<GovernanceBasicInfo> => {
  try {
    const contract = await getGovernanceContract(contractAddress)

    const [governanceToken, proposalCount, votingPeriod] = await
Promise.all([
      contract.governanceToken(),
      contract.proposalCount(),
      contract.VOTING_PERIOD(),
    ])

    const votingPeriodSeconds = Number(votingPeriod)
    const votingPeriodDays = votingPeriodSeconds / (24 * 60 * 60)

    return {
      governanceToken,
      proposalCount: proposalCount.toString(),
      votingPeriod: votingPeriod.toString(),
      votingPeriodDays,
      contractAddress,
    }
  } catch (error) {
    console.error('Governance 기본 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       제안 정보 조회
// ============================================
export interface ProposalInfo {
  proposalId: number
  description: string
  forVotes: string
  againstVotes: string
  deadline: string               // timestamp
  snapshot: string               // 스냅샷 시점
  executed: boolean
  isActive: boolean              // 투표 진행 중인지
  totalVotes: string             // 총 투표수
  forPercentage: number          // 찬성 비율
  againstPercentage: number      // 반대 비율
}

export const getProposalInfo = async (
  contractAddress: string,
  proposalId: number
): Promise<ProposalInfo> => {
  try {
    const contract = await getGovernanceContract(contractAddress)

    const [description, forVotes, againstVotes, deadline, snapshot, executed] =
      await contract.getProposal(proposalId)

    const forVotesBN = BigInt(forVotes.toString())
    const againstVotesBN = BigInt(againstVotes.toString())
    const totalVotesBN = forVotesBN + againstVotesBN

    let forPercentage = 0
    let againstPercentage = 0

    if (totalVotesBN > 0n) {
      forPercentage = Number((forVotesBN * 10000n) / totalVotesBN) / 100
      againstPercentage = Number((againstVotesBN * 10000n) / totalVotesBN) / 100
    }

    const isActive = Number(deadline) > Math.floor(Date.now() / 1000)

    return {
      proposalId,
      description,
      forVotes: forVotes.toString(),
      againstVotes: againstVotes.toString(),
      deadline: deadline.toString(),
      snapshot: snapshot.toString(),
      executed,
      isActive,
      totalVotes: totalVotesBN.toString(),
      forPercentage,
      againstPercentage,
    }
  } catch (error) {
    console.error('제안 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       투표 여부 확인
// ============================================
export const checkHasVoted = async (
  contractAddress: string,
  proposalId: number,
  voterAddress?: string
): Promise<boolean> => {
  try {
    const contract = await getGovernanceContract(contractAddress)
    const voter = voterAddress || (await getWalletAddress())

    return await contract.hasVoted(proposalId, voter)
  } catch (error) {
    console.error('투표 여부 확인 실패:', error)
    throw error
  }
}

// ============================================
//       전체 제안 목록 조회
// ============================================
export const getAllProposals = async (
  contractAddress: string
): Promise<ProposalInfo[]> => {
  try {
    const basicInfo = await getGovernanceBasicInfo(contractAddress)
    const proposalCount = Number(basicInfo.proposalCount)

    const proposals: ProposalInfo[] = []

    for (let i = 0; i < proposalCount; i++) {
      const proposal = await getProposalInfo(contractAddress, i)
      proposals.push(proposal)
    }

    return proposals
  } catch (error) {
    console.error('전체 제안 목록 조회 실패:', error)
    throw error
  }
}

// ============================================
//       활성 제안 목록 조회
// ============================================
export const getActiveProposals = async (
  contractAddress: string
): Promise<ProposalInfo[]> => {
  try {
    const allProposals = await getAllProposals(contractAddress)
    return allProposals.filter((p) => p.isActive)
  } catch (error) {
    console.error('활성 제안 목록 조회 실패:', error)
    throw error
  }
}

// ============================================
//       전체 정보 조회 (지갑 필요)
// ============================================
export interface GovernanceFullInfo extends GovernanceBasicInfo {
  userAddress: string
  activeProposalsCount: number
  totalProposalsCount: number
}

export const getGovernanceFullInfo = async (
  contractAddress: string
): Promise<GovernanceFullInfo> => {
  try {
    const basicInfo = await getGovernanceBasicInfo(contractAddress)
    const userAddress = await getWalletAddress()
    const allProposals = await getAllProposals(contractAddress)
    const activeProposals = allProposals.filter((p) => p.isActive)

    return {
      ...basicInfo,
      userAddress,
      activeProposalsCount: activeProposals.length,
      totalProposalsCount: allProposals.length,
    }
  } catch (error) {
    console.error('Governance 전체 정보 조회 실패:', error)
    throw error
  }
}

// ============================================
//       제안 생성 (트랜잭션)
// ============================================
export const createOnChainProposal = async (
  contractAddress: string,
  description: string
): Promise<number> => {
  try {
    const provider = await getProvider()
    const signer = await provider.getSigner()
    const contract = new Contract(contractAddress, GOVERNANCE_ABI, signer)
    const tx = await contract.createProposal(description)
    const receipt = await tx.wait()

    // ProposalCreated 이벤트에서 proposalId 추출
    const iface = contract.interface
    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog(log)
        if (parsed && parsed.name === 'ProposalCreated') {
          return Number(parsed.args.proposalId)
        }
      } catch { /* skip */ }
    }

    // 이벤트 파싱 실패 시 현재 proposalCount - 1 반환
    const count = await contract.proposalCount()
    return Number(count) - 1
  } catch (error) {
    console.error('제안 생성 실패:', error)
    throw error
  }
}

// ============================================
//       투표 (트랜잭션)
// ============================================
// support: 0=반대, 1=찬성, 2=기권(기권은 트랜잭션 없이 로컬 처리)
export const castVote = async (
  contractAddress: string,
  proposalId: number,
  support: 0 | 1 | 2
): Promise<string> => {
  if (support === 2) return 'abstain'  // 기권은 온체인 불필요
  try {
    const provider = await getProvider()
    const signer = await provider.getSigner()
    const contract = new Contract(contractAddress, GOVERNANCE_ABI, signer)
    // 배포된 컨트랙트는 vote(uint256, bool) — true=찬성, false=반대
    const tx = await contract.vote(proposalId, support === 1)
    const receipt = await tx.wait()
    return receipt.hash
  } catch (error) {
    console.error('투표 실패:', error)
    throw error
  }
}