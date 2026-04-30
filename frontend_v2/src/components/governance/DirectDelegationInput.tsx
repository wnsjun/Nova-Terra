import { useState } from 'react'

interface DirectDelegationInputProps {
  onDelegate?: (address: string) => Promise<void>
}

export default function DirectDelegationInput({ onDelegate }: DirectDelegationInputProps) {
  const [address, setAddress] = useState('')
  const [delegating, setDelegating] = useState(false)
  const [result, setResult] = useState<'success' | 'error' | null>(null)

  const handleDelegate = async () => {
    const addr = address.trim()
    if (!addr.match(/^0x[0-9a-fA-F]{40}$/)) {
      setResult('error')
      return
    }
    try {
      setDelegating(true)
      setResult(null)
      if (onDelegate) {
        await onDelegate(addr)
      } else {
        await new Promise(r => setTimeout(r, 1000))
      }
      setResult('success')
      setAddress('')
    } catch {
      setResult('error')
    } finally {
      setDelegating(false)
    }
  }

  return (
    <div className="bg-[#1c1f2b] border border-gray-600 rounded-xl p-5">
      <p className="text-gray-300 text-sm mb-3">위임할 대상의 지갑 주소를 직접 입력하세요.</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={e => { setAddress(e.target.value); setResult(null) }}
          placeholder="0x..."
          className="flex-1 bg-[#10131e] border border-gray-600 text-white rounded-lg px-4 py-2.5 text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-[#1ABCF7] transition-colors"
        />
        <button
          onClick={handleDelegate}
          disabled={delegating || !address.trim()}
          className="px-5 py-2.5 bg-[#1ABCF7] hover:bg-[#1ABCF7]/90 text-black font-bold text-sm rounded-lg transition-all shadow-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {delegating && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />}
          위임하기
        </button>
      </div>
      {result === 'success' && (
        <p className="mt-2 text-xs text-green-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          위임이 완료되었습니다.
        </p>
      )}
      {result === 'error' && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          올바른 지갑 주소를 입력해주세요. (0x + 40자리 hex)
        </p>
      )}
    </div>
  )
}
