import type { TradeOrder } from '../../apis/trade'

interface Props {
  sellOrders: TradeOrder[]
  buyOrders: TradeOrder[]
  currentPrice: number
  symbol: string
}

function OrderRow({ order, type }: { order: TradeOrder; type: 'buy' | 'sell' }) {
  const filled = order.filledAmount / order.tokenAmount
  return (
    <div className="flex justify-between px-2 py-1.5 text-sm hover:bg-white/5 transition-colors">
      <span className={type === 'sell' ? 'text-red-400' : 'text-[#1ABCF7]'}>
        {order.pricePerToken.toLocaleString()}
      </span>
      <span className="text-white">{(order.tokenAmount - order.filledAmount).toFixed(1)}</span>
      <span className="text-gray-500 text-xs">{(filled * 100).toFixed(0)}%</span>
    </div>
  )
}

const mockTrades = [
  { price: 54200, amount: 12.5, type: 'buy', time: '14:23:45' },
  { price: 54150, amount: 5.0, type: 'sell', time: '14:23:12' },
  { price: 54200, amount: 100.0, type: 'buy', time: '14:22:58' },
  { price: 54180, amount: 42.2, type: 'buy', time: '14:22:30' },
  { price: 54100, amount: 18.0, type: 'sell', time: '14:21:55' },
]

export default function OrderBook({ sellOrders, buyOrders, currentPrice, symbol }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Order Book */}
      <div className="bg-[#1c1f2b] p-4">
        <div className="flex justify-between text-[10px] text-gray-500 mb-3 px-2 uppercase">
          <span>가격 (KRW)</span>
          <span>잔량 (STO)</span>
          <span>체결률</span>
        </div>

        {/* Sell orders - top */}
        <div className="space-y-0.5 mb-2">
          {sellOrders.length > 0
            ? sellOrders.slice(0, 4).map(o => <OrderRow key={o.id} order={o} type="sell" />)
            : [54350, 54300, 54250].map(p => (
                <div key={p} className="flex justify-between px-2 py-1.5 text-sm hover:bg-white/5">
                  <span className="text-red-400">{p.toLocaleString()}</span>
                  <span className="text-white">{(Math.random() * 200 + 50).toFixed(1)}</span>
                  <span className="text-gray-500 text-xs">0%</span>
                </div>
              ))
          }
        </div>

        <div className="py-2 bg-[#272936] text-center border-y border-white/10 my-1">
          <span className="font-bold text-lg text-white">{currentPrice.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 block uppercase">Last Trade</span>
        </div>

        {/* Buy orders - bottom */}
        <div className="space-y-0.5 mt-2">
          {buyOrders.length > 0
            ? buyOrders.slice(0, 4).map(o => <OrderRow key={o.id} order={o} type="buy" />)
            : [54150, 54100, 54050].map(p => (
                <div key={p} className="flex justify-between px-2 py-1.5 text-sm hover:bg-white/5">
                  <span className="text-[#1ABCF7]">{p.toLocaleString()}</span>
                  <span className="text-white">{(Math.random() * 200 + 50).toFixed(1)}</span>
                  <span className="text-gray-500 text-xs">0%</span>
                </div>
              ))
          }
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-[#1c1f2b] p-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">실시간 체결 내역</h3>
        <div className="space-y-3">
          {mockTrades.map((t, i) => (
            <div key={i} className="flex justify-between text-xs border-b border-white/5 pb-2">
              <span className={t.type === 'buy' ? 'text-[#1ABCF7]' : 'text-red-400'}>
                {t.price.toLocaleString()}
              </span>
              <span className="text-white">{t.amount} {symbol}</span>
              <span className="text-gray-500">{t.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
