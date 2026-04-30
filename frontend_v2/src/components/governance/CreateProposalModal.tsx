import { useState } from 'react'
import { createProposal } from '../../apis/properties'

interface CreateProposalModalProps {
  isOpen: boolean
  onClose: () => void
  propertyId: string
  onSuccess: () => void
}

const toLocalDatetimeValue = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function CreateProposalModal({ isOpen, onClose, propertyId, onSuccess }: CreateProposalModalProps) {
  const now = new Date()
  const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startAt, setStartAt] = useState(toLocalDatetimeValue(now))
  const [endAt, setEndAt] = useState(toLocalDatetimeValue(threeDaysLater))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('제목과 설명을 입력해주세요.')
      return
    }
    const startMs = new Date(startAt).getTime()
    const endMs = new Date(endAt).getTime()
    if (isNaN(startMs) || isNaN(endMs)) {
      setError('날짜를 올바르게 입력해주세요.')
      return
    }
    if (endMs <= startMs) {
      setError('종료 시간은 시작 시간보다 이후여야 합니다.')
      return
    }
    try {
      setSubmitting(true)
      setError('')
      await createProposal({
        propertyId,
        title,
        description,
        startAt: Math.floor(startMs / 1000),
        endAt: Math.floor(endMs / 1000),
        onChainProposalId: 5,
      })
      setTitle('')
      setDescription('')
      setStartAt(toLocalDatetimeValue(new Date()))
      setEndAt(toLocalDatetimeValue(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)))
      onSuccess()
      onClose()
    } catch {
      setError('제안 생성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const inputClass = "w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#1ABCF7] transition-colors"

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-gray-900 font-bold text-lg">제안 생성</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
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
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">투표 시작</label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={e => setStartAt(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">투표 종료</label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={e => setEndAt(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 text-gray-500 hover:text-gray-800 hover:border-gray-400 rounded-lg text-sm font-semibold transition-colors"
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
                생성 중...
              </>
            ) : '제안 생성'}
          </button>
        </div>
      </div>
    </div>
  )
}
