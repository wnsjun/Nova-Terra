import { useState, useEffect } from 'react'
import VoteConfirmModal from './VoteConfirmModal'
import { getDelegateOf, selfDelegate } from '../../apis/blockchain/contracts/governanceToken'
import { castVote, checkHasVoted } from '../../apis/blockchain/contracts/governance'
import { getWalletAddress } from '../../apis/blockchain/provider'

interface ProposalCardProps {
  id: string
  onChainProposalId: number
  proposalNumber: string
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected' | 'executed'
  deadline?: string
  startAt?: number
  endTime?: number
  voteFor: number
  voteAgainst: number
  participationRate?: number
  proposer?: string
  governanceAddress: string
  governanceTokenAddress: string
  onVoteSuccess?: () => void
}

type VoteType = 'for' | 'against' | 'abstain'
const SUPPORT_MAP: Record<VoteType, 0 | 1 | 2> = { against: 0, for: 1, abstain: 2 }

const formatTs = (ts: number) => {
  const ms = ts < 1e12 ? ts * 1000 : ts
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ProposalCard({
  onChainProposalId,
  proposalNumber,
  title,
  description,
  status,
  deadline,
  startAt,
  endTime,
  voteFor,
  voteAgainst,
  participationRate,
  proposer,
  governanceAddress,
  governanceTokenAddress,
  onVoteSuccess,
}: ProposalCardProps) {
  const [showVoteButtons, setShowVoteButtons] = useState(false)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [voteType, setVoteType] = useState<VoteType | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [myVote, setMyVote] = useState<VoteType | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)

  useEffect(() => {
    if (status !== 'active' || !governanceAddress || !onChainProposalId) return
    ;(async () => {
      try {
        const walletAddress = await getWalletAddress()
        const voted = await checkHasVoted(governanceAddress, onChainProposalId, walletAddress)
        if (voted) setHasVoted(true)
      } catch {
        /* 지갑 미연결 등 무시 */
      }
    })()
  }, [governanceAddress, onChainProposalId, status])

  const handleVoteClick = (type: VoteType) => {
    setVoteType(type)
    setVoteError(null)
    setShowVoteModal(true)
  }

  const handleConfirmVote = async () => {
    if (!voteType) return
    setSubmitting(true)
    setVoteError(null)
    try {
      // 1. delegate 체크 → address(0)이면 self-delegate
      const userAddress = await getWalletAddress()
      const delegatee = await getDelegateOf(governanceTokenAddress, userAddress)
      if (delegatee === '0x0000000000000000000000000000000000000000') {
        await selfDelegate(governanceTokenAddress)
      }

      // 2. 투표
      await castVote(governanceAddress, onChainProposalId, SUPPORT_MAP[voteType])

      setMyVote(voteType)
      setHasVoted(true)
      setShowVoteModal(false)
      setShowVoteButtons(false)
      onVoteSuccess?.()
    } catch (err: unknown) {
      const e = err as { code?: number | string }
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setVoteError('서명이 거부되었습니다.')
      } else {
        setVoteError('투표 중 오류가 발생했습니다.')
      }
      setShowVoteModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20">진행 중</span>
      case 'passed':
        return <span className="bg-[#1ABCF7]/10 text-[#1ABCF7] text-xs font-bold px-2 py-1 rounded border border-[#1ABCF7]/20">통과됨</span>
      case 'rejected':
        return <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/20">거부됨</span>
      case 'executed':
        return <span className="bg-gray-600/20 text-gray-400 text-xs font-bold px-2 py-1 rounded border border-gray-600/20">실행 완료</span>
    }
  }

  const totalVotes = voteFor + voteAgainst
  const forPercentage = totalVotes > 0 ? (voteFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (voteAgainst / totalVotes) * 100 : 0
  const isActive = status === 'active'
  const isCompleted = status === 'executed' || status === 'passed' || status === 'rejected'

  const voteLabel = myVote === 'for' ? '찬성' : myVote === 'against' ? '반대' : myVote === 'abstain' ? '기권' : '투표'
  const voteLabelColor = myVote === 'for' ? 'text-[#1ABCF7]' : myVote === 'against' ? 'text-red-400' : 'text-gray-400'
  const voteBgColor = myVote === 'for' ? 'bg-[#1ABCF7]/20 border-[#1ABCF7]/30' : myVote === 'against' ? 'bg-red-500/20 border-red-500/30' : 'bg-gray-600/20 border-gray-600/30'

  return (
    <>
      <VoteConfirmModal
        isOpen={showVoteModal}
        voteType={voteType}
        proposalNumber={proposalNumber}
        proposalTitle={title}
        onConfirm={handleConfirmVote}
        onCancel={() => { setShowVoteModal(false); setVoteType(null) }}
        submitting={submitting}
      />

      <div className={`bg-gray-800 border border-gray-600 rounded-xl p-6 transition-all group shadow-lg ${isCompleted ? 'opacity-75 hover:opacity-100' : ''} ${isActive ? 'hover:border-[#1ABCF7]/50' : 'hover:border-gray-600/50'}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-mono text-sm">{proposalNumber}</span>
            {getStatusBadge()}
          </div>
          {deadline && (
            <div className={`flex items-center gap-2 text-sm font-medium ${isActive ? 'text-[#1ABCF7]' : 'text-gray-400'}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{deadline}</span>
            </div>
          )}
        </div>

        {/* Vote Period */}
        {(startAt || endTime) && (
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {startAt && <span>{formatTs(startAt)}</span>}
            <span className="text-gray-600">→</span>
            {endTime && <span>{formatTs(endTime)}</span>}
          </div>
        )}

        {/* Title & Description */}
        <h3 className={`text-xl font-bold text-white mb-2 transition-colors ${isActive ? 'group-hover:text-[#1ABCF7]' : ''}`}>
          {title}
        </h3>
        {proposer && (
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xs text-gray-500">
              {proposer.slice(0, 6)}...{proposer.slice(-4)}
            </span>
          </div>
        )}
        <p className={`text-gray-400 text-sm leading-relaxed ${isCompleted ? 'mb-4 line-clamp-2' : 'mb-6'}`}>
          {description}
        </p>

        {/* Voting Progress */}
        {!isCompleted && (
          <div className="mb-4">
            {participationRate !== undefined && (
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-violet-400">참여율</span>
                <span className="font-bold text-violet-400">{participationRate.toFixed(1)}%</span>
              </div>
            )}
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-violet-400 rounded-full transition-all"
                style={{ width: `${Math.min(participationRate ?? 0, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-[#1ABCF7]">찬성: {forPercentage.toFixed(0)}%</span>
              <span className="text-gray-400">반대: {againstPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#1ABCF7]" style={{ width: `${forPercentage}%`, boxShadow: '0 0 10px rgba(26,188,247,0.5)' }} />
              <div className="h-full bg-red-500/70" style={{ width: `${againstPercentage}%` }} />
            </div>
          </div>
        )}

        {/* Error */}
        {voteError && (
          <p className="text-red-400 text-xs mb-3">{voteError}</p>
        )}

        {/* Footer */}
        <div className={`flex items-center justify-between ${isCompleted ? '' : 'pt-4 border-t border-gray-600'}`}>
          {isCompleted ? (
            <div className="flex items-center gap-4 pt-4 border-t border-gray-600 text-sm w-full">
              <div className="flex items-center gap-2 text-[#1ABCF7]">
                <span className="font-bold">{forPercentage.toFixed(0)}% 찬성</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <span>{againstPercentage.toFixed(0)}% 반대</span>
              </div>
            </div>
          ) : (
            <>
              {hasVoted ? (
                <div className="flex items-center gap-2 mx-auto">
                  <div className={`flex items-center gap-2 px-6 py-2 rounded-lg border ${voteBgColor}`}>
                    <svg className={`w-5 h-5 ${voteLabelColor}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={`text-sm font-bold ${voteLabelColor}`}>{voteLabel} 투표 완료</span>
                  </div>
                </div>
              ) : !showVoteButtons ? (
                <button
                  onClick={() => setShowVoteButtons(true)}
                  className="cursor-pointer px-6 py-2 mx-auto rounded-lg text-sm font-bold transition-all bg-[#1ABCF7] hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(26,188,247,0.3)]"
                >
                  지금 투표하기
                </button>
              ) : (
                <div className="flex items-center gap-2 mx-auto">
                  <button
                    onClick={() => handleVoteClick('for')}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-all bg-[#1ABCF7] hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(26,188,247,0.3)]"
                  >
                    찬성
                  </button>
                  <button
                    onClick={() => handleVoteClick('against')}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-all bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    반대
                  </button>
                  <button
                    onClick={() => handleVoteClick('abstain')}
                    className="cursor-pointer px-4 py-2 rounded-lg text-sm font-bold transition-all bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    기권
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
