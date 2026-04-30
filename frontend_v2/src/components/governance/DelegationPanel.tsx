import { useMemo } from 'react'
import DirectDelegationInput from './DirectDelegationInput'

interface DelegationHistory {
  id: string
  agentName: string
  agentLevel: number
  votingPower: string
  delegatedDate: string
  propertyName: string
}

interface Agent {
  id: string
  name: string
  level: number
  specialty: string
  totalDelegated: string
  performance: number
  image?: string
}

interface DelegationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function DelegationPanel({ isOpen, onClose }: DelegationPanelProps) {
  const delegationHistory = useMemo<DelegationHistory[]>(() => {
    if (!isOpen) return []

    return [
      {
        id: '1',
        agentName: '에이전트 스미스',
        agentLevel: 5,
        votingPower: '5,320',
        delegatedDate: '2023.10.15',
        propertyName: 'Yeouido Office A',
      },
      {
        id: '2',
        agentName: '에이전트 김',
        agentLevel: 4,
        votingPower: '1,230',
        delegatedDate: '2023.09.20',
        propertyName: 'Busan Logistics Hub',
      },
    ]
  }, [isOpen])

  const availableAgents = useMemo<Agent[]>(() => {
    if (!isOpen) return []

    return [
      {
        id: '1',
        name: '에이전트 스미스',
        level: 5,
        specialty: '부동산 전문가',
        totalDelegated: '125,000',
        performance: 94,
      },
      {
        id: '2',
        name: '에이전트 김',
        level: 4,
        specialty: '상업용 부동산',
        totalDelegated: '87,500',
        performance: 89,
      },
      {
        id: '3',
        name: '에이전트 박',
        level: 5,
        specialty: '주거용 부동산',
        totalDelegated: '110,300',
        performance: 92,
      },
    ]
  }, [isOpen])

  const totalDelegated = useMemo(() => {
    return delegationHistory.reduce((sum, item) => {
      const power = parseInt(item.votingPower.replace(/,/g, ''))
      return sum + power
    }, 0)
  }, [delegationHistory])

  return (
    <>
      {/* Backdrop - Left half transparent, right half dark */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '60px' }}
        onClick={onClose}
      >
        {/* Left half - transparent */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2"></div>
        {/* Right half - dark backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-black/60 backdrop-blur-sm"></div>
      </div>

      {/* Panel */}
      <div
        className={`fixed right-0 w-full md:w-1/2 bg-[#10131e] border-l border-gray-600 shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px', height: 'calc(100vh - 60px)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-[#1c1f2b] hover:bg-gray-700 text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <svg className="w-8 h-8 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              투표권 위임
            </h1>
            <p className="text-gray-300">전문가에게 투표권을 위임하고 효율적으로 거버넌스에 참여하세요</p>
          </div>

          {/* Summary Card */}
          <div className="bg-linear-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-200 text-sm font-medium uppercase tracking-wider">현재 위임된 투표권</p>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 uppercase border border-purple-500/30">
                Active
              </span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{totalDelegated.toLocaleString()}</p>
            <p className="text-purple-400 text-sm">
              {delegationHistory.length}개 부동산에 위임 중
            </p>
          </div>

          {/* Direct Delegation */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">직접 위임</h2>
            <DirectDelegationInput />
          </div>

          {/* Available Agents */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">추천 에이전트</h2>
            <p className="text-gray-300 text-sm mb-4">신뢰할 수 있는 검증된 에이전트에게 투표권을 위임하세요.</p>
            <div className="space-y-3">
              {availableAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-600 bg-[#1c1f2b] hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-[#10131e] border border-gray-600 flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white">{agent.name}</p>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#1ABCF7]/20 text-[#1ABCF7] border border-[#1ABCF7]/30">
                          Lv {agent.level}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-1">{agent.specialty}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>위임된 투표권: {agent.totalDelegated} NVT</span>
                        <span>•</span>
                        <span className="text-green-400">성과: {agent.performance}%</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#1ABCF7] hover:bg-[#1ABCF7]/90 text-black font-bold text-sm rounded-lg transition-all shadow-lg shrink-0">
                    위임하기
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Delegation History */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4">위임 내역 ({delegationHistory.length})</h2>
            <div className="space-y-3">
              {delegationHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-gray-600 bg-[#1c1f2b]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white">{item.agentName}</p>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                          Lv {item.agentLevel}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{item.propertyName}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors">
                      위임 해제
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white font-bold text-sm">{item.votingPower}</span>
                      <span className="text-gray-300 text-xs">NVT</span>
                    </div>
                    <span className="text-gray-300 text-xs">{item.delegatedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-[#1c1f2b] border border-gray-600 rounded-xl p-6">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1ABCF7]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              위임 안내
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2">
                <span className="text-[#1ABCF7]">•</span>
                <span>위임된 투표권은 에이전트가 대신 투표에 참여합니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1ABCF7]">•</span>
                <span>언제든지 위임을 해제하고 직접 투표할 수 있습니다.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#1ABCF7]">•</span>
                <span>에이전트의 성과는 과거 투표 이력을 기반으로 계산됩니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
