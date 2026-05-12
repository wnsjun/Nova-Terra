import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import STOPurchase from '../markettrade/STOPurchase'
import STOConfirm from '../markettrade/STOConfirm'
import STOComplete from '../markettrade/STOComplete'

interface PropertyDetailProps {
  name: string
  location: string
  type: string
  typeColor: string
  image: string
  vacancyRate: string
  annualYield: string
  totalValue: string
  stoPrice: string
  fundingPercentage: number
  investors: number
  symbol: string
  contractAddress: string
}

export default function PropertyDetail({
  name,
  location,
  type,
  typeColor,
  image,
  vacancyRate,
  annualYield,
  totalValue,
  stoPrice,
  fundingPercentage,
  investors,
  symbol,
  contractAddress: _contractAddress,
}: PropertyDetailProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [quantity, setQuantity] = useState(0)
  const [transactionId] = useState('')

  const pricePerToken = parseFloat(stoPrice.replace(/[^0-9.]/g, ''))
  const totalAmount = quantity * pricePerToken

  const handleNext = (purchaseQuantity: number) => {
    setQuantity(purchaseQuantity)
    setStep(2)
  }

  const handleBack = () => setStep(1)
  const handleConfirm = () => setStep(3)

  const handleViewPortfolio = () => navigate('/portfolio')
  const handleExploreMore = () => navigate('/marketplace')
  return (
    <>
      {/* Hero Section with Property Image */}
      <section className="relative h-100 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-10 h-full flex items-end pb-12">
          <div>
            <div className={`inline-block rounded-full bg-black/60 px-4 py-1.5 text-sm font-bold backdrop-blur-md border mb-4 ${typeColor}`}>
              {type}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{name}</h1>
            <div className="flex items-center gap-2 text-gray-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-lg">{location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Property Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">공실률</p>
              <p className="text-2xl font-bold text-white">{vacancyRate}</p>
            </div>
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">연 수익률</p>
              <p className="text-2xl font-bold text-[#1ABCF7]">{annualYield}</p>
            </div>
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">총 가치</p>
              <p className="text-2xl font-bold text-white">{totalValue}</p>
            </div>
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-2">STO 가격</p>
              <p className="text-2xl font-bold text-white">{stoPrice}</p>
            </div>
          </div>

          {/* Funding Progress */}
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 mb-10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-bold text-white">펀딩 현황</h3>
              <span className="text-gray-400">{investors.toLocaleString()} 투자자</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-600 mb-2">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#1ABCF7] to-[#A020F0]"
                style={{ width: `${fundingPercentage}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-400">{fundingPercentage}% 달성</p>
          </div>

          {/* STO Purchase */}
          {step === 1 && (
            <STOPurchase
              stoPrice={stoPrice}
              propertyName={name}
              propertyLocation={location}
              symbol={symbol}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <STOConfirm
              stoPrice={stoPrice}
              propertyName={name}
              quantity={quantity}
              onBack={handleBack}
              onConfirm={handleConfirm}
            />
          )}
          {step === 3 && (
            <STOComplete
              propertyName={name}
              quantity={quantity}
              totalAmount={totalAmount}
              transactionId={transactionId}
              symbol={symbol}
              onViewPortfolio={handleViewPortfolio}
              onExploreMore={handleExploreMore}
            />
          )}
        </div>
      </section>
    </>
  )
}
