const bars = [24, 32, 48, 40, 56, 44, 60, 52, 48]
const times = ['09:00', '12:00', '15:00', '18:00', '21:00']

export default function PriceChart() {
  return (
    <div className="bg-[#1c1f2b] h-52 p-5 relative flex flex-col justify-end">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path
            d="M0 300 Q100 280 200 320 T400 240 T600 260 T800 180 T1000 200"
            fill="none"
            stroke="#1ABCF7"
            strokeWidth="4"
          />
        </svg>
      </div>
      <div className="flex justify-between items-end h-full w-full pb-3 border-b border-white/10">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-1 bg-[#1ABCF7]"
            style={{ height: `${h * 0.9}%`, opacity: 0.3 + (i / bars.length) * 0.7 }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-500 uppercase">
        {times.map(t => <span key={t}>{t}</span>)}
      </div>
    </div>
  )
}
