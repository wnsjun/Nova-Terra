import { createPortal } from 'react-dom'

interface VoteConfirmModalProps {
  isOpen: boolean
  voteType: 'for' | 'against' | 'abstain' | null
  proposalNumber: string
  proposalTitle: string
  onConfirm: () => void
  onCancel: () => void
  submitting?: boolean
}

const VOTE_CONFIG = {
  for: { label: '찬성', color: 'text-[#1ABCF7]', bg: 'bg-[#1ABCF7]/20', btnClass: 'bg-[#1ABCF7] hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(26,188,247,0.3)]' },
  against: { label: '반대', color: 'text-red-400', bg: 'bg-red-500/20', btnClass: 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' },
  abstain: { label: '기권', color: 'text-gray-400', bg: 'bg-gray-600/30', btnClass: 'bg-gray-600 hover:bg-gray-500 text-white' },
}

export default function VoteConfirmModal({
  isOpen,
  voteType,
  proposalNumber,
  proposalTitle,
  onConfirm,
  onCancel,
  submitting,
}: VoteConfirmModalProps) {
  if (!isOpen || !voteType) return null

  const cfg = VOTE_CONFIG[voteType]

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]" onClick={onCancel}>
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cfg.bg}`}>
            <svg className={`w-6 h-6 ${cfg.color}`} fill="currentColor" viewBox="0 0 20 20">
              {voteType === 'for' ? (
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              ) : voteType === 'against' ? (
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              )}
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">투표 확인</h3>
            <p className="text-sm text-gray-400">{proposalNumber}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            <span className="font-bold text-white">"{proposalTitle}"</span> 안건에
          </p>
          <p className={`text-lg font-bold ${cfg.color}`}>
            {cfg.label} 투표하시겠습니까?
          </p>
        </div>

        <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 mb-6 space-y-1">
          <p className="text-sm text-gray-400">⚠️ 투표 후에는 변경할 수 없습니다.</p>
          <p className="text-xs text-gray-500">투표권이 없는 경우 먼저 자기 위임(delegate)이 자동 실행됩니다.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className={`cursor-pointer flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${cfg.btnClass}`}
          >
            {submitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                처리 중...
              </>
            ) : `${cfg.label} 투표하기`}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
