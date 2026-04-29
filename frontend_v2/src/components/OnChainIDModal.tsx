import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWalletAddress } from '../apis/blockchain/provider'

interface OnChainIDModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnChainIDModal({ isOpen, onClose}: OnChainIDModalProps) {
  const [address, setAddress] = useState('')
  const active = 1  // 1이면 active 상태
  const navigate = useNavigate()

  // 지갑 주소 가져오기
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const walletAddress = await getWalletAddress()
        setAddress(walletAddress)
      } catch (error) {
        console.error('지갑 주소 가져오기 실패:', error)
      }
    }

    if (isOpen) {
      fetchAddress()
    }
  }, [isOpen])

  // 주소 축약 함수 (0x1234...Ef 형식)
  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-2)}`
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    alert('주소가 복사되었습니다!')
  }

  if (!isOpen) return null

  return (
    <>
      {/* 백그라운드 오버레이 */}
      <div
        className="fixed inset-0 z-90"
        onClick={onClose}
      />

      {/* 드롭다운 모달 */}
      <div
        className="absolute top-full right-0 mt-2 w-96 rounded-2xl bg-white border-2 border-white shadow-2xl z-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-black"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 신분증 내용 */}
        <div className="p-6">
          {/* 헤더 */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold text-black mb-2 tracking-tight">ONCHAIN ID</h2>
            <div className="inline-flex flex-col items-center justify-center">
              {/* <div className="text-[9px] uppercase tracking-[0.15em] text-black bg-black/5 px-2 py-0.5 rounded-t-md font-bold border border-black/10">{address}</div> */}
              <div className="relative px-4 py-2 bg-black border border-black rounded-lg shadow-md flex items-center gap-2">
                <button
                  onClick={handleCopyAddress}
                  className="cursor-pointer flex items-center justify-center w-5 h-5 rounded hover:bg-white/10 transition-colors"
                  title="주소 복사"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <span className="font-mono text-sm text-white tracking-wider font-medium">{formatAddress(address)}</span>
              </div>
            </div>
          </div>

          {/* 검증 카드들 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* KYC 카드 */}
            <div
              onClick={() => { onClose(); navigate('/kyc') }}
              className={`flex flex-col items-center p-3 rounded-xl bg-white shadow-sm cursor-pointer hover:opacity-80 transition-opacity ${active === 1 ? 'border-2 border-[#1ABCF7]' : 'border border-black/10'}`}
            >
              <div className="w-full flex justify-end mb-1">
                <span className="px-1.5 py-0.5 rounded bg-black/5 text-black text-[8px] font-bold uppercase tracking-wider border border-black/10">Verified</span>
              </div>
              <div className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${active === 1 ? 'bg-black border-none' : 'bg-gray-50 border border-black/20'}`}>
                <svg className={`w-5 h-5 ${active === 1 ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-black mb-1">KYC</h3>
              <p className="text-[9px] text-center text-black/60 mb-2">Identity verified</p>
            </div>

            {/* Accredited 카드 */}
            <div className={`flex flex-col items-center p-3 rounded-xl bg-white shadow-sm ${active === 1 ? 'border-2 border-[#1ABCF7]' : 'border border-black/10'}`}>
              <div className="w-full flex justify-end mb-1">
                <span className="px-1.5 py-0.5 rounded bg-black/5 text-black text-[8px] font-bold uppercase tracking-wider border border-black/10">{active === 1 ? 'Verified' : 'Required'}</span>
              </div>
              <div className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${active === 1 ? 'bg-black border-none' : 'bg-gray-50 border border-black/20'}`}>
                <svg className={`w-5 h-5 ${active === 1 ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={active === 1 ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-black mb-1">Accredited</h3>
              <p className="text-[9px] text-center text-black/60 mb-2">Investor status</p>
            </div>

            {/* Country 카드 */}
            <div className={`flex flex-col items-center p-3 rounded-xl bg-white shadow-sm ${active === 1 ? 'border-2 border-[#1ABCF7]' : 'border border-black/10'}`}>
              <div className="w-full flex justify-end mb-1">
                <span className="px-1.5 py-0.5 rounded bg-black/5 text-black text-[8px] font-bold uppercase tracking-wider border border-black/10">{active === 1 ? 'Verified' : 'Required'}</span>
              </div>
              <div className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${active === 1 ? 'bg-black border-none' : 'bg-gray-50 border border-black/20'}`}>
                <svg className={`w-5 h-5 ${active === 1 ? 'text-white' : 'text-black'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={active === 1 ? "M5 13l4 4L19 7" : "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"} />
                </svg>
              </div>
              <h3 className="text-xs font-bold text-black mb-1">Country</h3>
              <p className="text-[9px] text-center text-black/60 mb-2">Tax jurisdiction</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
