import { useState } from 'react'
import type { TradeOrder } from '../../apis/trade'

interface Props {
  orders: TradeOrder[]
  onCancel: (id: string) => void
}

type Tab = 'OPEN' | 'HISTORY'

export default function MyOrders({ orders, onCancel }: Props) {
  const [tab, setTab] = useState<Tab>('OPEN')

  const openOrders = orders.filter(o => o.status === 'ACTIVE')
  const historyOrders = orders.filter(o => o.status !== 'ACTIVE')
  const displayOrders = tab === 'OPEN' ? openOrders : historyOrders

  return (
    <div>
      <div className="flex gap-6 border-b border-white/10 mb-0">
        <button
          onClick={() => setTab('OPEN')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            tab === 'OPEN' ? 'border-[#1ABCF7] text-white' : 'border-transparent text-gray-500'
          }`}
        >
          미체결 주문 ({openOrders.length})
        </button>
        <button
          onClick={() => setTab('HISTORY')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
            tab === 'HISTORY' ? 'border-[#1ABCF7] text-white' : 'border-transparent text-gray-500'
          }`}
        >
          체결 내역
        </button>
      </div>

      <div className="bg-[#1c1f2b] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#272936] text-[10px] uppercase text-gray-400">
              {['시간', '자산', '구분', '주문가격', '수량', '체결률', '관리'].map(h => (
                <th key={h} className={`px-5 py-3 ${h === '관리' ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {displayOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-500 text-sm">
                  {tab === 'OPEN' ? '미체결 주문이 없습니다.' : '체결 내역이 없습니다.'}
                </td>
              </tr>
            ) : (
              displayOrders.map(order => {
                const fillPct = order.tokenAmount > 0 ? (order.filledAmount / order.tokenAmount) * 100 : 0
                const isBuy = order.type === 'BUY'
                return (
                  <tr key={order.id}>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleString('ko-KR')}</td>
                    <td className="px-5 py-3.5 font-bold text-white">{order.propertyName}</td>
                    <td className={`px-5 py-3.5 font-bold ${isBuy ? 'text-[#1ABCF7]' : 'text-red-400'}`}>
                      {isBuy ? '매수' : '매도'}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-white">{order.pricePerToken.toLocaleString()} KRW</td>
                    <td className="px-5 py-3.5 text-white">{order.tokenAmount.toFixed(1)} STO</td>
                    <td className="px-5 py-3.5">
                      <div className="w-24 bg-[#272936] h-1 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#1ABCF7] to-[#e9b3ff]"
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <span className={`text-[10px] ${fillPct > 0 ? 'text-[#1ABCF7]' : 'text-gray-500'}`}>
                        {fillPct.toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {order.status === 'ACTIVE' && (
                        <button
                          onClick={() => onCancel(order.id)}
                          className="text-red-400 text-xs font-bold uppercase hover:underline tracking-wider"
                        >
                          취소
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
