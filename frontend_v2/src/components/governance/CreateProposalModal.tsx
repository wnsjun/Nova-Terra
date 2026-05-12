import { useState } from 'react'
import { getPropertyInfoByTokenAddress } from '../../apis/blockchain/contracts/tokenFactory'
import { getDelegateOf, selfDelegate } from '../../apis/blockchain/contracts/governanceToken'
import { getGovernanceBasicInfo, createOnChainProposal } from '../../apis/blockchain/contracts/governance'
import { getWalletAddress } from '../../apis/blockchain/provider'

interface CreateProposalModalProps {
  isOpen: boolean
  onClose: () => void
  tokenAddress: string
  onSuccess: () => void
}

export default function CreateProposalModal({ isOpen, onClose, tokenAddress, onSuccess }: CreateProposalModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<'idle' | 'delegating' | 'proposing'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('제목과 설명을 입력해주세요.')
      return
    }
    try {
      setSubmitting(true)
      setError('')

      // 1. governance 주소 조회
      const propertyInfo = await getPropertyInfoByTokenAddress(tokenAddress)
      if (!propertyInfo || propertyInfo.governanceAddress === '0x0000000000000000000000000000000000000000') {
        setError('Governance 컨트랙트 주소를 찾을 수 없습니다.')
        return
      }
      const governanceAddress = propertyInfo.governanceAddress

      // 2. GovernanceToken 주소 조회
      const govInfo = await getGovernanceBasicInfo(governanceAddress)
      const governanceTokenAddress = govInfo.governanceToken

      // 3. delegate 체크 → address(0)이면 self-delegate
      const userAddress = await getWalletAddress()
      const delegatee = await getDelegateOf(governanceTokenAddress, userAddress)
      if (delegatee === '0x0000000000000000000000000000000000000000') {
        setStep('delegating')
        await selfDelegate(governanceTokenAddress)
      }

      // 4. 온체인 제안 생성
      setStep('proposing')
      const fullDescription = `${title}\n\n${description}`
      await createOnChainProposal(governanceAddress, fullDescription)

      setTitle('')
      setDescription('')
      setStep('idle')
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const e = err as { code?: number | string }
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setError('서명이 거부되었습니다.')
      } else {
        setError('제안 생성에 실패했습니다. 다시 시도해주세요.')
      }
      setStep('idle')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const inputClass = "w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#1ABCF7] transition-colors"

  const stepLabel = step === 'delegating'
    ? '투표권 활성화 중...'
    : step === 'proposing'
    ? '제안 생성 중...'
    : '생성 중...'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-900 font-bold text-lg">제안 생성</h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="제안 제목을 입력하세요"
              disabled={submitting}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">설명</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="제안 내용을 자세히 설명해주세요"
              rows={4}
              disabled={submitting}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Step indicator */}
          {submitting && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 shrink-0" />
              {stepLabel}
              {step === 'delegating' && (
                <span className="text-xs text-blue-500 ml-1">— MetaMask 서명 필요</span>
              )}
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 py-3 border border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-400 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 bg-[#1ABCF7] text-black hover:bg-[#1ABCF7]/90 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                {stepLabel}
              </>
            ) : '제안 생성'}
          </button>
        </div>
      </div>
    </div>
  )
}
