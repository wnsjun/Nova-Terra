import { useState, useEffect, useCallback } from 'react'
import ProposalCard from './ProposalCard'
import CreateProposalModal from './CreateProposalModal'
import { getPropertyInfoByTokenAddress } from '../../apis/blockchain/contracts/tokenFactory'
import { getGovernanceBasicInfo } from '../../apis/blockchain/contracts/governance'
import { getProposalsByProperty, mapProposalStatusToUI } from '../../apis/properties'

interface Proposal {
  id: string
  onChainProposalId: number
  proposalNumber: string
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected' | 'executed'
  deadline?: string
  startAt?: number
  endTime?: number
  voteFor: number
  voteAgainst: number
  participationRate: number
  proposer?: string
}

interface PropertyInfo {
  id: string
  name: string
  location: string
  image?: string
  category: string
  status: string
  apr: string
  tokenPrice: string
}

interface GovernanceProposalPanelProps {
  isOpen: boolean
  onClose: () => void
  property: PropertyInfo | null
}

const formatDeadline = (deadlineTs: number): string | undefined => {
  const diff = deadlineTs * 1000 - Date.now()
  if (diff <= 0) return undefined
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0) return `${days}일 ${hours % 24}시간 후 종료`
  return `${hours}시간 ${mins}분 후 종료`
}


export default function GovernanceProposalPanel({ isOpen, onClose, property }: GovernanceProposalPanelProps) {
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [governanceAddress, setGovernanceAddress] = useState('')
  const [governanceTokenAddress, setGovernanceTokenAddress] = useState('')

  const fetchProposals = useCallback(async () => {
    if (!isOpen || !property) { setProposals([]); return }
    try {
      setIsLoading(true)
      setError(null)

      // 투표 기능을 위한 거버넌스 컨트랙트 주소 조회
      const propInfo = await getPropertyInfoByTokenAddress(property.id)
      if (!propInfo || propInfo.governanceAddress === '0x0000000000000000000000000000000000000000') {
        setError('Governance 컨트랙트를 찾을 수 없습니다.')
        return
      }
      setGovernanceAddress(propInfo.governanceAddress)

      const govInfo = await getGovernanceBasicInfo(propInfo.governanceAddress)
      setGovernanceTokenAddress(govInfo.governanceToken)

      // 제안 목록 API 조회 (onChainProposalId 포함)
      const apiProposals = await getProposalsByProperty(property.id)

      const transformed: Proposal[] = apiProposals.map((p, idx) => {
        const status = mapProposalStatusToUI(p.status)
        const totalVotes = p.voteFor + p.voteAgainst
        const participationRate = p.totalTokens > 0 ? (totalVotes / p.totalTokens) * 100 : 0
        return {
          id: p.id,
          onChainProposalId: p.onChainProposalId != null ? Number(p.onChainProposalId) : 0,
          proposalNumber: `#${apiProposals.length - idx}`,
          title: p.title,
          description: p.description,
          status,
          deadline: status === 'active' ? formatDeadline(p.endAt) : undefined,
          startAt: p.startAt,
          endTime: p.endAt,
          voteFor: p.voteFor,
          voteAgainst: p.voteAgainst,
          participationRate,
          proposer: p.proposerAddress ?? undefined,
        }
      })
      setProposals(transformed)
    } catch (err) {
      console.error('제안 목록 조회 실패:', err)
      setError('제안 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [isOpen, property])

  useEffect(() => { fetchProposals() }, [fetchProposals])

  const filters = ['전체', '진행 중', '통과됨', '거부됨']
  const filteredProposals = proposals.filter((p) => {
    if (selectedFilter === '전체') return true
    if (selectedFilter === '진행 중') return p.status === 'active'
    if (selectedFilter === '통과됨') return p.status === 'passed' || p.status === 'executed'
    if (selectedFilter === '거부됨') return p.status === 'rejected'
    return true
  })

  if (!property) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ top: '60px' }}
        onClick={onClose}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1/2" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Panel */}
      <div
        className={`fixed right-0 w-full md:w-1/2 bg-black border-l border-gray-600 shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ top: '60px', height: 'calc(100vh - 60px)' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="p-6 md:p-8">
          {/* Breadcrumb */}
          <div className="flex gap-2 items-center text-sm mb-6">
            <span className="text-gray-400">거버넌스</span>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">{property.name}</span>
          </div>

          {/* Property Header */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700 mb-6">
            {property.image
              ? <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${property.image})` }} />
              : <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            }
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <span className="bg-[#1ABCF7]/20 text-[#1ABCF7] text-xs font-bold px-2 py-1 rounded mb-2 inline-block">{property.category}</span>
              <h1 className="text-2xl font-bold text-white">{property.name}</h1>
              <p className="text-gray-300 text-sm">{property.location}</p>
            </div>
          </div>

          {/* Proposals Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">안건</h2>
              <div className="flex p-1 bg-gray-800 rounded-lg border border-gray-600">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFilter(f)}
                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${selectedFilter === f ? 'bg-[#1ABCF7] text-black' : 'text-gray-400 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {isLoading && (
                <div className="flex flex-col items-center gap-3 py-12">
                  <div className="w-10 h-10 border-4 border-[#1ABCF7] border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">불러오는 중...</p>
                </div>
              )}
              {error && !isLoading && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              )}
              {!isLoading && !error && filteredProposals.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg mb-1">제안이 없습니다</p>
                  <p className="text-gray-500 text-sm">아직 생성된 제안이 없습니다.</p>
                </div>
              )}
              {!isLoading && !error && filteredProposals.map((p) => (
                <ProposalCard
                  key={p.id}
                  {...p}
                  governanceAddress={governanceAddress}
                  governanceTokenAddress={governanceTokenAddress}
                  onVoteSuccess={fetchProposals}
                />
              ))}
            </div>
          </div>

          {/* Create Proposal Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full bg-white hover:bg-gray-100 text-black transition-colors py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            제안 생성
          </button>
        </div>
      </div>

      <CreateProposalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        tokenAddress={property.id}
        onSuccess={fetchProposals}
      />
    </>
  )
}
