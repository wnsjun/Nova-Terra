import { useState, useEffect, useCallback } from 'react'
import ProposalCard from './ProposalCard'
import CreateProposalModal from './CreateProposalModal'
import { getProposalsByProperty, mapProposalStatusToUI } from '../../apis/properties'

interface Proposal {
  id: string
  proposalNumber: string
  title: string
  description: string
  status: 'active' | 'passed' | 'rejected' | 'executed'
  deadline?: string
  startAt?: number
  endTime?: number
  voteFor: number
  voteAgainst: number
  voterCount: number
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

export default function GovernanceProposalPanel({
  isOpen,
  onClose,
  property,
}: GovernanceProposalPanelProps) {
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const myVotingPower = '2,450' // 내 투표권수 하드코딩
  const totalVoters = '5,500' //총 투표권수 하드코딩

  // Helper function to format deadline
  const formatDeadline = (endTime: number, status: string): string | undefined => {
    if (status !== 'ACTIVE' && status !== 'PENDING') {
      return undefined
    }

    const now = Date.now()
    const diff = endTime - now

    if (diff <= 0) return undefined

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) {
      return `${days}일 ${remainingHours}시간 후 종료`
    }
    return `${hours}시간 ${minutes}분 후 종료`
  }

  const fetchProposals = useCallback(async () => {
    if (!isOpen || !property) {
      setProposals([])
      return
    }
    try {
      setIsLoading(true)
      setError(null)
      const proposalsData = await getProposalsByProperty(property.id)
      const transformedProposals: Proposal[] = proposalsData.map((proposal, index) => ({
        id: proposal.id,
        proposalNumber: `#${proposalsData.length - index}`,
        title: proposal.title,
        description: proposal.description,
        status: mapProposalStatusToUI(proposal.status),
        deadline: formatDeadline(proposal.endTime, proposal.status),
        startAt: proposal.startAt,
        endTime: proposal.endTime,
        voteFor: 30,
        voteAgainst: 70,
        voterCount: 0,
      }))
      setProposals(transformedProposals)
    } catch (err) {
      console.error('제안 목록 조회 실패:', err)
      setError('제안 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [isOpen, property])

  useEffect(() => {
    fetchProposals()
  }, [fetchProposals])

  const filters = ['전체', '진행 중', '통과됨', '거부됨']

  const filteredProposals = proposals.filter((proposal) => {
    if (selectedFilter === '전체') return true
    if (selectedFilter === '진행 중') return proposal.status === 'active'
    if (selectedFilter === '통과됨') return proposal.status === 'passed' || proposal.status === 'executed'
    if (selectedFilter === '거부됨') return proposal.status === 'rejected'
    return true
  })

  if (!property) return null

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
        className={`fixed right-0 w-full md:w-1/2 bg-black border-l border-gray-600 shadow-2xl transform transition-transform duration-300 ease-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px', height: 'calc(100vh - 60px)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
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
          {/* Breadcrumb */}
          <div className="flex flex-wrap gap-2 items-center text-sm mb-6">
            <a className="text-gray-400 hover:text-[#1ABCF7] transition-colors" href="#">
              거버넌스
            </a>
            <span className="text-gray-500">/</span>
            <a className="text-gray-400 hover:text-[#1ABCF7] transition-colors" href="#">
              부동산
            </a>
            <span className="text-gray-500">/</span>
            <span className="text-white font-medium">{property.name}</span>
          </div>

          {/* Property Header */}
          <div className="relative w-full h-70 rounded-xl overflow-hidden group border border-gray-700 mb-6">
            {property.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${property.image})` }}
              ></div>
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-gray-800 to-gray-900"></div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1ABCF7]/20 text-[#1ABCF7] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                    {property.category}
                  </span>
                  <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> {property.status}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{property.name}</h1>
                <p className="text-gray-300 flex items-center gap-1 text-sm">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {property.location}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="col-span-2 md:col-span-2 flex flex-col gap-1 rounded-lg p-5 bg-gray-800 border border-gray-600 shadow-lg">
              <p className="text-gray-400 text-sm font-medium">총 투표권 수</p>
              <p className="text-white text-2xl font-bold">{totalVoters}</p>
            </div>

            {/* My Voting Power - 2x width */}
            <div className="col-span-2 md:col-span-2 flex flex-col gap-1 rounded-lg p-5 bg-gray-800 border border-gray-600 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 text-sm font-medium">나의 투표권</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-white text-2xl font-bold">{myVotingPower}</p>
                <span className="text-sm font-normal text-gray-400">DAO</span>
              </div>
            </div>
          </div>

          {/* Proposals Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-white">안건</h2>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex p-1 bg-gray-800 rounded-lg flex-1 sm:flex-none border border-gray-600">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        selectedFilter === filter
                          ? 'bg-[#1ABCF7] text-black shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <button
                  className="hidden sm:flex bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white p-2 rounded-lg transition-colors cursor-pointer"
                  title="Filter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Proposals List */}
            <div className="flex flex-col gap-4">
              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#1ABCF7] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm">제안 목록을 불러오는 중...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-400 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredProposals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-16 h-16 text-gray-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-400 text-lg mb-1">제안이 없습니다</p>
                  <p className="text-gray-500 text-sm">아직 생성된 제안이 없습니다.</p>
                </div>
              )}

              {/* Proposals */}
              {!isLoading && !error && filteredProposals.length > 0 && (
                <>
                  {filteredProposals.map((proposal) => (
                    <ProposalCard
                      key={proposal.id}
                      {...proposal}
                      onVoteClick={() => console.log('Vote clicked for proposal:', proposal.id)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Create Proposal Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full bg-white hover:bg-gray-100 text-black transition-colors py-3 px-6 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>{' '}
              제안 생성
            </button>

            {/* Governance Rules */}
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 shadow-lg">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                거버넌스 규칙
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 text-gray-400">
                  <svg
                    className="w-4.5 h-4.5 text-[#1ABCF7] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>정족수:</strong> 전체 공급량의 40%가 제안에 투표해야 유효합니다.
                  </span>
                </li>
                <li className="flex gap-3 text-gray-400">
                  <svg
                    className="w-4.5 h-4.5 text-[#1ABCF7] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>투표 기간:</strong> 모든 제안은 3일간 활성 상태를 유지합니다.
                  </span>
                </li>
                <li className="flex gap-3 text-gray-400">
                  <svg
                    className="w-4.5 h-4.5 text-[#1ABCF7] shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>실행 지연:</strong> 통과된 제안은 24시간 락업 기간이 있습니다.
                  </span>
                </li>
              </ul>
              <a className="block mt-4 text-center text-gray-400 hover:text-[#1ABCF7] text-xs underline transition-colors">
                전체 거버넌스 문서 읽기
              </a>
            </div>
          </div>
        </div>
      </div>

      <CreateProposalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        propertyId={property.id}
        onSuccess={fetchProposals}
      />
    </>
  )
}
