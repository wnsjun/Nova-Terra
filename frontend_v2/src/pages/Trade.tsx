import { useState, useEffect } from 'react'
import Topbar from '../layouts/Topbar'
import PropertyInfoCard from '../components/trade/PropertyInfoCard'
import TradingHeader from '../components/trade/TradingHeader'
import PriceChart from '../components/trade/PriceChart'
import OrderBook from '../components/trade/OrderBook'
import TradeForm from '../components/trade/TradeForm'
import MyOrders from '../components/trade/MyOrders'
import { getProperties, type PropertyResponse } from '../apis/properties'
import { getTradeOrders, getMyTradeOrders, createOrder, cancelOrder, type TradeOrder } from '../apis/trade'

export default function Trade() {
  const [properties, setProperties] = useState<PropertyResponse[]>([])
  const [selected, setSelected] = useState<PropertyResponse | null>(null)
  const [orders, setOrders] = useState<TradeOrder[]>([])
  const [myOrders, setMyOrders] = useState<TradeOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProperties()
      .then(data => {
        setProperties(data)
        if (data.length > 0) setSelected(data[0])
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selected) return
    Promise.all([getTradeOrders(selected.id), getMyTradeOrders()])
      .then(([tradeOrders, mine]) => {
        setOrders(tradeOrders)
        setMyOrders(mine)
      })
      .finally(() => setLoading(false))
  }, [selected])

  const refreshOrders = async () => {
    if (!selected) return
    const [tradeOrders, mine] = await Promise.all([getTradeOrders(selected.id), getMyTradeOrders()])
    setOrders(tradeOrders)
    setMyOrders(mine)
  }

  const handleOrder = async (type: 'BUY' | 'SELL', pricePerToken: number, tokenAmount: number) => {
    if (!selected) return
    await createOrder({ propertyId: selected.id, type, tokenAmount, pricePerToken })
    await refreshOrders()
  }

  const handleCancel = async (id: string) => {
    await cancelOrder(id)
    setMyOrders(prev => prev.filter(o => o.id !== id))
  }

  const sellOrders = orders.filter(o => o.type === 'SELL' && o.status === 'ACTIVE')
    .sort((a, b) => b.pricePerToken - a.pricePerToken)
  const buyOrders = orders.filter(o => o.type === 'BUY' && o.status === 'ACTIVE')
    .sort((a, b) => b.pricePerToken - a.pricePerToken)

  const symbol = selected ? selected.name.slice(0, 3).toUpperCase() : '---'
  const currentPrice = selected?.pricePerToken ?? 0

  return (
    <div className="min-h-screen bg-[#10131e]">
      <Topbar />

      {/* Token Selector Tabs */}
      <div className="border-b border-white/10 px-6 py-2.5 flex gap-2 overflow-x-auto">
        {properties.map(p => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className={`shrink-0 px-4 py-1.5 text-xs font-bold transition-all ${
              selected?.id === p.id
                ? 'bg-[#1ABCF7] text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {p.name.length > 10 ? p.name.slice(0, 10) + '…' : p.name}
          </button>
        ))}
        {properties.length === 0 && !loading && (
          <span className="text-xs text-gray-500 py-1.5">거래 가능한 자산이 없습니다.</span>
        )}
      </div>

      {loading && !selected ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1ABCF7]" />
        </div>
      ) : selected ? (
        <main className="px-6 py-6 space-y-6">
          {/* 3-Column Grid */}
          <div className="grid grid-cols-12 gap-5 items-start">
            {/* Left: Property Info */}
            <section className="col-span-3">
              <PropertyInfoCard property={selected} />
            </section>

            {/* Center: Chart + Order Book */}
            <section className="col-span-6 space-y-4">
              <TradingHeader
                symbol={symbol}
                propertyName={selected.name}
                currentPrice={currentPrice}
                priceChange={2.51}
                volume={1_240_500_000}
              />
              <PriceChart />
              <OrderBook sellOrders={sellOrders} buyOrders={buyOrders} currentPrice={currentPrice} symbol={symbol} />
            </section>

            {/* Right: Trade Form */}
            <section className="col-span-3 sticky top-20">
              <TradeForm
                currentPrice={currentPrice}
                symbol={symbol}
                onSubmit={handleOrder}
              />
            </section>
          </div>

          {/* Bottom: My Orders */}
          <MyOrders orders={myOrders} onCancel={handleCancel} />
        </main>
      ) : null}
    </div>
  )
}
