import { useState, useEffect } from 'react'
import { getWalletAddress } from '../../apis/blockchain/provider'

interface STOConfirmProps {
  stoPrice: string
  propertyName: string
  quantity: number
  onBack: () => void
  onConfirm: () => void
  isLoading?: boolean
  error?: string | null
}

export default function STOConfirm({ stoPrice, propertyName, quantity, onBack, onConfirm, isLoading = false, error = null }: STOConfirmProps) {
  const [walletAddress, setWalletAddress] = useState<string>('')

  const pricePerToken = parseFloat(stoPrice.replace(/[^0-9.]/g, ''))
  const subtotal = quantity * pricePerToken
  const balance = 5200000

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const address = await getWalletAddress()
        setWalletAddress(address)
      } catch (error) {
        console.error('지갑 주소 가져오기 실패:', error)
      }
    }

    fetchWalletAddress()
  }, [])

  const formatAddress = (address: string) => {
    if (!address) return '연결되지 않음'
    return `${address.slice(0, 8)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">구매 내용 확인</h2>
        <div className="flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs text-gray-400 border border-gray-600">
          <span className="w-2 h-2 rounded-full bg-[#1ABCF7] animate-pulse shadow-[0_0_8px_#1ABCF7]"></span>
          GIWA Sepolia Tesnet 네트워크
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full bg-[#1ABCF7] text-black font-bold text-sm shadow-[0_0_10px_rgba(26,188,247,0.4)]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-xs font-medium text-[#1ABCF7]">수량</span>
        </div>
        <div className="h-px flex-1 bg-[#1ABCF7] shadow-[0_0_4px_rgba(26,188,247,0.5)] mx-2"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full bg-[#1ABCF7] text-black font-bold text-sm shadow-[0_0_10px_rgba(26,188,247,0.4)]">
            2
          </div>
          <span className="text-xs font-medium text-white">확인</span>
        </div>
        <div className="h-px flex-1 bg-gray-600 mx-2"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-8 h-8 items-center justify-center rounded-full border border-gray-600 bg-black text-gray-400 font-bold text-sm">
            3
          </div>
          <span className="text-xs font-medium text-gray-400">완료</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Purchase Summary */}
        <div className="rounded-xl border border-gray-600 bg-black/80 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">선택된 STO</p>
              <p className="text-base font-bold text-white">{propertyName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">구매 수량</p>
              <p className="text-xl font-bold text-[#1ABCF7]">{quantity} STO</p>
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="rounded-xl bg-black/50 p-4 border border-gray-600 space-y-3 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-white">최종 결제 금액</span>
            <div className="text-right">
              <span className="block text-2xl font-bold text-[#1ABCF7] drop-shadow-[0_0_10px_rgba(26,188,247,0.4)]">
                KRWT {subtotal.toLocaleString()}
              </span>
              <span className="block text-xs text-gray-400 mt-1">{quantity} STO x KRWT {pricePerToken.toLocaleString()}</span>
              <span className="block text-xs text-gray-400">보유 KRW 잔액: KRWT {balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Confirmation */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">
            결제 수단 확인
          </label>
          <div className="flex items-center justify-between rounded-xl border border-[#1ABCF7]/40 bg-[#1ABCF7]/5 p-4 shadow-[0_0_10px_rgba(26,188,247,0.05)]">
            <div className="flex items-center gap-4">
              <div className="flex w-10 h-10 items-center justify-center rounded-full bg-[#1ABCF7]/20 text-[#1ABCF7]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white text-sm">KRW Stable Coin</p>
                <p className="text-xs text-gray-400">Connected Wallet: {formatAddress(walletAddress)}</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="cursor-pointer col-span-1 rounded-xl border border-gray-600 bg-black py-4 text-sm font-bold text-gray-400 hover:border-gray-400 hover:text-white hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="cursor-pointer col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#1ABCF7] py-4 text-base font-bold text-black shadow-[0_0_20px_rgba(26,188,247,0.4)] hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1ABCF7] disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                처리 중...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                구매 확정 및 서명
              </>
            )}
          </button>
        </div>
        {error && (
          <p className="text-center text-sm text-red-400 mt-2">{error}</p>
        )}
        {!error && (
          <p className="text-center text-xs text-gray-400 mt-2">
            버튼을 클릭하면 메타마스크 지갑에서 서명 요청 팝업이 표시됩니다.
          </p>
        )}
      </div>
    </div>
  )
}
