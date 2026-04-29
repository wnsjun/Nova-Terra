import { useState } from 'react'

interface Props {
  currentPrice: number
  symbol: string
  availableBalance?: number
  onSubmit: (type: 'BUY' | 'SELL', price: number, amount: number) => Promise<void>
}

const PERCENTS = [25, 50, 75, 100]
const FEE_RATE = 0.0005

export default function TradeForm({ currentPrice, symbol, availableBalance = 2450000, onSubmit }: Props) {
  const [tab, setTab] = useState<'BUY' | 'SELL'>('BUY')
  const [price, setPrice] = useState(currentPrice)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const total = price * (parseFloat(amount) || 0)
  const fee = total * FEE_RATE

  const handlePercent = (pct: number) => {
    if (tab === 'BUY') {
      const maxAmount = (availableBalance * (pct / 100)) / price
      setAmount(maxAmount.toFixed(2))
    } else {
      // For sell, would need holdings data - mock for now
      setAmount(((10 * pct) / 100).toFixed(2))
    }
  }

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) return
    setLoading(true)
    try {
      await onSubmit(tab, price, parseFloat(amount))
      setAmount('')
    } catch {
      // error handled upstream
    } finally {
      setLoading(false)
    }
  }

  const isBuy = tab === 'BUY'

  return (
    <div className="bg-[#1c1f2b] border-t border-[#1ABCF7]/20">
      {/* Buy / Sell Tab */}
      <div className="flex bg-[#272936] p-1">
        {(['BUY', 'SELL'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 text-sm font-bold transition-all ${
              tab === t
                ? t === 'BUY'
                  ? 'bg-[#1ABCF7] text-black'
                  : 'bg-red-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t === 'BUY' ? '매수' : '매도'}
          </button>
        ))}
      </div>

      <div className="p-5 space-y-5">
        {/* Price Input */}
        <div>
          <label className="block text-[10px] uppercase text-gray-400 mb-2">가격 (KRW)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold">가격</span>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full bg-[#272936] border-none text-right text-lg font-bold text-white py-3 px-4 pr-3 focus:ring-1 focus:ring-[#1ABCF7] outline-none"
            />
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-[10px] uppercase text-gray-400 mb-2">수량 ({symbol})</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold">수량</span>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#272936] border-none text-right text-lg font-bold text-white py-3 px-4 pr-3 focus:ring-1 focus:ring-[#1ABCF7] outline-none placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Percent Shortcuts */}
        <div className="grid grid-cols-4 gap-2">
          {PERCENTS.map(pct => (
            <button
              key={pct}
              onClick={() => handlePercent(pct)}
              className="bg-[#272936] py-1.5 text-[10px] font-bold text-gray-400 hover:bg-[#1ABCF7]/20 hover:text-[#1ABCF7] transition-colors"
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Order Summary */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">주문 총액</span>
            <span className="font-bold text-white">{total > 0 ? total.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'} KRW</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">수수료 (0.05%)</span>
            <span className="font-bold text-white">{fee > 0 ? fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'} KRW</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!amount || parseFloat(amount) <= 0 || loading}
          className={`w-full py-4 font-bold text-base transition-all active:scale-95 ${
            !amount || parseFloat(amount) <= 0
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : isBuy
              ? 'bg-[#1ABCF7] text-black cursor-pointer hover:brightness-110'
              : 'bg-red-500 text-white cursor-pointer hover:brightness-110'
          }`}
        >
          {loading ? '처리 중...' : `주문 등록 (${isBuy ? '매수' : '매도'})`}
        </button>

        {/* Available Balance */}
        <div className="text-[10px] text-gray-500 flex justify-between uppercase">
          <span>가용 자산</span>
          <span className="text-[#1ABCF7] font-bold">{availableBalance.toLocaleString()} KRW</span>
        </div>
      </div>
    </div>
  )
}
