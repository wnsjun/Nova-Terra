import { useState } from 'react'
import VoteConfirmModal from './VoteConfirmModal'

interface ProposalCardProps {
  id: string
  proposalNumber: string
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected' | 'executed'
  deadline?: string
  startAt?: number
  endTime?: number
  voteFor: number
  voteAgainst: number
  onVoteClick?: () => void
}

const formatTs = (ts: number) => {
  const ms = ts < 1e12 ? ts * 1000 : ts
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function ProposalCard({
  proposalNumber,
  title,
  description,
  status,
  deadline,
  startAt,
  endTime,
  voteFor,
  voteAgainst,
  onVoteClick,
}: ProposalCardProps) {
  const [showVoteButtons, setShowVoteButtons] = useState(false)
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [voteType, setVoteType] = useState<'for' | 'against' | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [myVote, setMyVote] = useState<'for' | 'against' | null>(null)

  const handleVoteClick = (type: 'for' | 'against') => {
    setVoteType(type)
    setShowVoteModal(true)
  }

  const handleConfirmVote = () => {
    console.log(`${voteType === 'for' ? '찬성' : '반대'} 투표 확정`)
    setMyVote(voteType)
    setHasVoted(true)
    onVoteClick?.()
    setShowVoteModal(false)
    setShowVoteButtons(false)
  }

  const handleCancelVote = () => {
    setShowVoteModal(false)
    setVoteType(null)
  }
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded border border-green-500/20">
            진행 중
          </span>
        )
      case 'passed':
        return (
          <span className="bg-[#1ABCF7]/10 text-[#1ABCF7] text-xs font-bold px-2 py-1 rounded border border-[#1ABCF7]/20">
            통과됨
          </span>
        )
      case 'rejected':
        return (
          <span className="bg-red-500/10 text-red-400 text-xs font-bold px-2 py-1 rounded border border-red-500/20">
            거부됨
          </span>
        )
      case 'executed':
        return (
          <span className="bg-gray-600/20 text-gray-400 text-xs font-bold px-2 py-1 rounded border border-gray-600/20">
            실행 완료
          </span>
        )
    }
  }

  const getHoverColor = () => {
    switch (status) {
      case 'active':
        return 'hover:border-[#1ABCF7]/50'
      case 'passed':
        return 'hover:border-green-400/50'
      case 'rejected':
        return 'hover:border-red-400/50'
      default:
        return 'hover:border-gray-600/50'
    }
  }

  const totalVotes = voteFor + voteAgainst
  const forPercentage = totalVotes > 0 ? (voteFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (voteAgainst / totalVotes) * 100 : 0

  const isActive = status === 'active'
  const isCompleted = status === 'executed' || status === 'passed' || status === 'rejected'

  return (
    <>
      <VoteConfirmModal
        isOpen={showVoteModal}
        voteType={voteType}
        proposalNumber={proposalNumber}
        proposalTitle={title}
        onConfirm={handleConfirmVote}
        onCancel={handleCancelVote}
      />

      <div
        className={`bg-gray-800 border border-gray-600 rounded-xl p-6 transition-all group shadow-lg ${
          isCompleted ? 'opacity-75 hover:opacity-100' : ''
        } ${getHoverColor()}`}
      >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 font-mono text-sm">{proposalNumber}</span>
          {getStatusBadge()}
        </div>
        {deadline && (
          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              isActive ? 'text-[#1ABCF7]' : 'text-gray-400'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              {isCompleted ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              )}
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
      <h3
        className={`text-xl font-bold text-white mb-2 transition-colors ${
          isActive ? 'group-hover:text-[#1ABCF7]' : ''
        }`}
      >
        {title}
      </h3>
      <p className={`text-gray-400 text-sm leading-relaxed ${isCompleted ? 'mb-4 line-clamp-2' : 'mb-6'}`}>
        {description}
      </p>

      {/* Voting Progress */}
      {!isCompleted && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-[#1ABCF7]">
              찬성: {forPercentage.toFixed(0)}%
            </span>
            <span className="text-gray-400">반대: {againstPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-[#1ABCF7]"
              style={{
                width: `${forPercentage}%`,
                boxShadow: '0 0 10px rgba(26, 188, 247, 0.5)',
              }}
            ></div>
            <div className="h-full bg-red-500/70" style={{ width: `${againstPercentage}%` }}></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        className={`flex items-center justify-between ${isCompleted ? '' : 'pt-4 border-t border-gray-600'}`}
      >
        {isCompleted ? (
          <>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-600 text-sm w-full">
              <div className="flex items-center gap-2 text-[#1ABCF7]">
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="font-bold">{forPercentage.toFixed(0)}% 찬성</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                </svg>
                <span>{againstPercentage.toFixed(0)}% 반대</span>
              </div>
              <button className="ml-auto text-gray-400 hover:text-[#1ABCF7] font-medium flex items-center gap-1 transition-colors">
                상세 보기
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <>
            {hasVoted ? (
              <div className="flex items-center gap-2 mx-auto">
                <div className={`flex items-center gap-2 px-6 py-2 rounded-lg ${myVote === 'for' ? 'bg-[#1ABCF7]/20 border border-[#1ABCF7]/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <svg className={`w-5 h-5 ${myVote === 'for' ? 'text-[#1ABCF7]' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className={`text-sm font-bold ${myVote === 'for' ? 'text-[#1ABCF7]' : 'text-red-400'}`}>
                    {myVote === 'for' ? '찬성' : '반대'} 투표 완료
                  </span>
                </div>
              </div>
            ) : !showVoteButtons ? (
              <button
                onClick={() => setShowVoteButtons(true)}
                className="cursor-pointer px-6 py-2 mx-auto rounded-lg text-sm font-bold transition-all bg-[#1ABCF7] hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(26,188,247,0.3)] hover:shadow-[0_0_20px_rgba(26,188,247,0.5)]"
              >
                지금 투표하기
              </button>
            ) : (
              <div className="flex items-center gap-3 mx-auto">
                <button
                  onClick={() => handleVoteClick('for')}
                  className="cursor-pointer px-6 py-2 rounded-lg text-sm font-bold transition-all bg-[#1ABCF7] hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(26,188,247,0.3)] hover:shadow-[0_0_20px_rgba(26,188,247,0.5)]"
                >
                  찬성하기
                </button>
                <button
                  onClick={() => handleVoteClick('against')}
                  className="cursor-pointer px-6 py-2 rounded-lg text-sm font-bold transition-all bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                >
                  반대하기
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
