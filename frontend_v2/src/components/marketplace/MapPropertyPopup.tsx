interface MapPropertyPopupProps {
  property: {
    id: string
    name: string
    address: string
    coverImageUrl: string
    buildingType: string
    occupancyRate: number
    totalMonthlyRent: number
    totalValuation: number
    pricePerToken: number
  }
  onClose: () => void
  onClick: () => void
}

export default function MapPropertyPopup({ property, onClose, onClick }: MapPropertyPopupProps) {
  const formatKRW = (n: number) => {
    if (n >= 1_0000_0000) return `${(n / 1_0000_0000).toFixed(0)}억`
    if (n >= 10000) return `${(n / 10000).toFixed(0)}만`
    return n.toLocaleString()
  }

  return (
    <div
      className="w-64 rounded-2xl bg-white shadow-2xl overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      {/* 이미지 */}
      <div className="relative h-32 w-full">
        <img
          src={property.coverImageUrl}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 내용 */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight">{property.name}</h3>
        <p className="text-xs text-gray-500 mb-3">{property.address}</p>

        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">토큰 가격</span>
            <span className="font-semibold text-gray-900">{formatKRW(property.pricePerToken)} KRWT</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">월 임대 수입</span>
            <span className="font-semibold text-gray-900">{formatKRW(property.totalMonthlyRent)}원</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">총 자산가치</span>
            <span className="font-semibold text-gray-900">{formatKRW(property.totalValuation)}원</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">점유율</span>
            <span className="font-semibold text-[#1ABCF7]">{property.occupancyRate}%</span>
          </div>
        </div>

        <button
          onClick={onClick}
          className="w-full bg-[#1ABCF7] hover:bg-[#1ABCF7]/90 text-black font-bold text-xs py-2 rounded-lg transition-colors"
        >
          자세히 보기
        </button>
      </div>

    </div>
  )
}
