import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import STOPurchase from '../markettrade/STOPurchase'
import STOConfirm from '../markettrade/STOConfirm'
import STOComplete from '../markettrade/STOComplete'
import { getPropertyBasicInfo, approveKRWT, buyPropertyToken } from '../../apis/blockchain/contracts/propertyToken'

interface STOPurchasePanelProps {
  isOpen: boolean
  onClose: () => void
  property: {
    id: string
    name: string
    location?: string
    stoPrice: number
  } | null
  symbol: string
}

export default function STOPurchasePanel({ isOpen, onClose, property, symbol }: STOPurchasePanelProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [quantity, setQuantity] = useState(0)
  const [transactionId, setTransactionId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [onChainInfo, setOnChainInfo] = useState<{
    tokenPrice: string
    remainingSupply: string
    paymentToken: string
    initialized: boolean
  } | null>(null)

  useEffect(() => {
    if (!isOpen || !property) return
    getPropertyBasicInfo(property.id)
      .then(info => {
        console.log('[OnChain] 원본 값:', {
          maxSupply: info.maxSupply,
          totalSupply: info.totalSupply,
          remainingSupply: info.remainingSupply,
          tokenPrice: info.tokenPrice,
          paymentToken: info.paymentToken,
        })
        console.log('[OnChain] 변환 값:', {
          remainingSupply_토큰수: Number(BigInt(info.remainingSupply) / BigInt(10 ** 18)),
          tokenPrice_KRWT: info.tokenPrice,
        })
        setOnChainInfo({
          tokenPrice: info.tokenPrice,
          remainingSupply: info.remainingSupply,
          paymentToken: info.paymentToken,
          initialized: info.initialized,
        })
      })
      .catch(console.error)
  }, [isOpen, property?.id])

  if (!property) return null

  const maxAvailable = onChainInfo
    ? Number(BigInt(onChainInfo.remainingSupply) / BigInt(10 ** 18))
    : undefined

  const onChainPrice = onChainInfo ? onChainInfo.tokenPrice : `${property.stoPrice.toFixed(0)}`

  const handleNext = (purchaseQuantity: number) => {
    setQuantity(purchaseQuantity)
    setStep(2)
  }

  const handleBack = () => {
    setPurchaseError(null)
    setStep(1)
  }

  const handleConfirm = async () => {
    if (!onChainInfo) return
    if (!onChainInfo.initialized) {
      setPurchaseError('아직 판매 준비가 완료되지 않은 자산입니다. 잠시 후 다시 시도해주세요.')
      return
    }
    setIsLoading(true)
    setPurchaseError(null)
    try {
      const totalCost = BigInt(onChainInfo.tokenPrice) * BigInt(quantity)
      await approveKRWT(onChainInfo.paymentToken, property.id, totalCost)
      const txHash = await buyPropertyToken(property.id, quantity)
      setTransactionId(txHash)
      setStep(3)
    } catch (err: unknown) {
      console.error('[구매 실패] 전체 에러:', err)
      const ethErr = err as { code?: number | string; message?: string; reason?: string }
      console.error('[구매 실패] code:', ethErr.code, '| message:', ethErr.message, '| reason:', ethErr.reason)
      if (ethErr.code === 4001 || ethErr.code === 'ACTION_REJECTED') {
        setPurchaseError('서명이 거부되었습니다.')
      } else if (ethErr.reason?.includes('not initialized') || ethErr.message?.includes('not initialized')) {
        setPurchaseError('아직 판매 준비가 완료되지 않은 자산입니다. 잠시 후 다시 시도해주세요.')
      } else if (ethErr.reason?.includes('not verified') || ethErr.message?.includes('not verified')) {
        setPurchaseError('지갑 주소가 인증되지 않았습니다. KYC 등록 후 구매 가능합니다.')
      } else {
        setPurchaseError('구매 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPortfolio = () => {
    onClose()
    setTimeout(() => {
      setStep(1)
      navigate('/portfolio')
    }, 300)
  }

  const handleExploreMore = () => {
    onClose()
    setTimeout(() => setStep(1), 300)
  }

  const handlePanelClose = () => {
    onClose()
    setTimeout(() => setStep(1), 300)
  }

  const stoPrice = `${onChainPrice} KRWT`
  const totalAmount = onChainInfo
    ? quantity * Number(onChainInfo.tokenPrice)
    : quantity * property.stoPrice

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={handlePanelClose}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      ></div>

      {/* Panel */}
      <div
        className={`fixed right-0 z-50 w-full md:w-1/2 overflow-y-auto bg-black border-l border-gray-600 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      >
        {/* Close Button */}
        <button
          onClick={handlePanelClose}
          className="sticky top-4 left-4 z-10 float-left ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 border border-gray-600 text-white transition-all hover:bg-gray-700 hover:border-[#1ABCF7]"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 py-12">
          {/* STO Purchase Steps */}
          {step === 1 && (
            <STOPurchase
              stoPrice={stoPrice}
              propertyName={property.name}
              propertyLocation={property.location}
              symbol={symbol}
              maxAvailable={maxAvailable}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <STOConfirm
              stoPrice={stoPrice}
              propertyName={property.name}
              quantity={quantity}
              onBack={handleBack}
              onConfirm={handleConfirm}
              isLoading={isLoading}
              error={purchaseError}
            />
          )}
          {step === 3 && (
            <STOComplete
              propertyName={property.name}
              quantity={quantity}
              totalAmount={totalAmount}
              transactionId={transactionId}
              onViewPortfolio={handleViewPortfolio}
              onExploreMore={handleExploreMore}
              symbol={symbol}
            />
          )}
        </div>
      </div>
    </>
  )
}
