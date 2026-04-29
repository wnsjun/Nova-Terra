interface Props {
  symbol: string
  propertyName: string
  currentPrice: number
  priceChange: number
  volume: number
}

export default function TradingHeader({ symbol, propertyName, currentPrice, priceChange, volume }: Props) {
  const isPositive = priceChange >= 0

  return (
    <div className="bg-[#1c1f2b] p-5 flex justify-between items-end">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">{symbol} / KRW</h1>
          <span className="text-[10px] px-2 py-1 bg-[#272936] text-gray-400 rounded">부동산 STO</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">{propertyName}</p>
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">현재 가격</p>
            <p className="text-xl font-bold text-white">{currentPrice.toLocaleString()} KRW</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">24h 변동</p>
            <p className={`text-xl font-bold ${isPositive ? 'text-[#1ABCF7]' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">24h 거래량</p>
        <p className="text-lg font-bold text-white">{volume.toLocaleString()} KRW</p>
      </div>
    </div>
  )
}
