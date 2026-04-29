import type { PropertyResponse } from '../../apis/properties'

interface Props {
  property: PropertyResponse
}

export default function PropertyInfoCard({ property }: Props) {
  const occupancyRate = ((property.occupancyRate ?? 0) * 100).toFixed(1)
  const annualYield = property.totalValuation
    ? (((property.totalMonthlyRent ?? 0) * 12) / property.totalValuation * 100).toFixed(1)
    : '0.0'

  return (
    <div className="bg-[#1c1f2b] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-0.5 h-full bg-[#e9b3ff]" />
      <div className="aspect-video overflow-hidden">
        <img
          src={property.coverImageUrl}
          alt={property.name}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="p-5">
        <h2 className="text-lg font-bold text-white mb-1">{property.name}</h2>
        <div className="flex justify-between items-center mb-5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">{property.address.split(' ').slice(0, 2).join(' ')}</span>
          <span className="bg-[#7d01b1] text-[#e5a9ff] px-2 py-0.5 rounded-full text-[10px] font-bold">LIVE STO</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[10px] text-gray-400 uppercase mb-1">임차율</p>
            <p className="text-lg font-bold text-[#1ABCF7]">{occupancyRate}%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase mb-1">예상 배당수익률</p>
            <p className="text-lg font-bold text-[#1ABCF7]">{annualYield}%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase mb-1">총 발행 토큰</p>
            <p className="text-sm font-bold text-white">{(property.totalTokens ?? 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase mb-1">자산 가치</p>
            <p className="text-sm font-bold text-white">{((property.totalValuation ?? 0) / 1e8).toFixed(1)}억</p>
          </div>
        </div>

        <div className="bg-[#272936] p-3 flex gap-2 items-start border-l border-[#1ABCF7]/20">
          <span className="text-[#1ABCF7] text-sm mt-0.5">✦</span>
          <div>
            <span className="text-[10px] font-bold text-[#1ABCF7] block mb-1">AI INSIGHT</span>
            <p className="text-xs text-gray-400 leading-relaxed">
              높은 임차율로 배당 안정성이 우수합니다. 주변 상권 성장세로 임대료 상승이 기대됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
