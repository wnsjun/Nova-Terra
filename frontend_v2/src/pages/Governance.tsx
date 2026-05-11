import { useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'
import Topbar from '../layouts/Topbar'
import GovernancePropertyCard from '../components/governance/GovernancePropertyCard'
import GovernanceProposalPanel from '../components/governance/GovernanceProposalPanel'
import VotingPowerCard from '../components/governance/VotingPowerCard'
import DelegationCard from '../components/governance/DelegationCard'
import VotingPowerPanel from '../components/governance/VotingPowerPanel'
import DelegationPanel from '../components/governance/DelegationPanel'
import { getPortfolio, getBuildingTypeLabel, type HoldingResponse } from '../apis/properties'

interface Property {
  id: string
  name: string
  location: string
  image?: string
  category: string
  tier: string
  totalValuation: number
  amount: number
  proposalStatus: 'active' | 'urgent' | 'scheduled' | 'completed' | 'none'
  proposalTitle?: string
  proposalDetail?: string
  proposalDeadline?: string
  voterCount?: number
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
  totalVoters: string
  governanceScore: string
  myVotingPower: string
}

export default function Governance() {
  const [selectedCategory, setSelectedCategory] = useState('전체 자산')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyInfo | null>(null)
  const [isVotingPowerPanelOpen, setIsVotingPowerPanelOpen] = useState(false)
  const [isDelegationPanelOpen, setIsDelegationPanelOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>('')

  // Helper function to convert API data to Property format
  const convertToProperty = (holding: HoldingResponse): Property => {
    const { property, amount } = holding

    // Determine tier based on total valuation
    const getTier = (valuation: number): string => {
      if (valuation >= 800000000000) return 'Tier S+'
      if (valuation >= 500000000000) return 'Tier S'
      if (valuation >= 200000000000) return 'Tier A'
      if (valuation >= 100000000000) return 'Tier A-'
      if (valuation >= 80000000000) return 'Tier B+'
      return 'Tier B'
    }

    return {
      id: property.id,
      name: property.name,
      location: property.address,
      image: property.coverImageUrl,
      category: getBuildingTypeLabel(property.buildingType),
      tier: getTier(property.totalValuation),
      totalValuation: property.totalValuation,
      amount: amount,
      proposalStatus: 'none', // TODO: Add proposal status from API when available
    }
  }

  // Get wallet address
  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        if (typeof window.ethereum !== 'undefined') {
          const provider = new BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            setWalletAddress(accounts[0].address)
          }
        }
      } catch (error) {
        console.error('지갑 주소 가져오기 실패:', error)
      }
    }

    getWalletAddress()
  }, [])

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!walletAddress) return

      try {
        setIsLoading(true)
        setError(null)
        const holdings = await getPortfolio()
        const convertedProperties = holdings.map(convertToProperty)
        setProperties(convertedProperties)
      } catch (err) {
        console.error('Failed to fetch portfolio:', err)
        setError('포트폴리오를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolio()
  }, [walletAddress])

  const categories = ['전체 자산', '상업 오피스', '소매 및 복합', '물류']

  const filteredProperties = properties.filter((property) => {
    const matchesCategory = selectedCategory === '전체 자산' || property.category.includes(selectedCategory.split(' ')[0])
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        property.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handlePropertyClick = (property: Property) => {
    // Convert Property to PropertyInfo
    const propertyInfo: PropertyInfo = {
      id: property.id,
      name: property.name,
      location: property.location,
      image: property.image,
      category: property.category,
      status: '활성',
      apr: '8.5%',
      tokenPrice: '$12.45',
      totalVoters: '1,240',
      governanceScore: '92',
      myVotingPower: '2,450',
    }
    setSelectedProperty(propertyInfo)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setTimeout(() => setSelectedProperty(null), 300)
  }

  return (
    <div className="min-h-screen bg-black">
      <Topbar />

      <main className="w-full px-4 md:px-10 py-8 mx-auto max-w-350">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white">
              부동산 거버넌스
            </h1>
            <p className="text-gray-400 text-base font-normal leading-normal">
              포트폴리오에서 부동산 자산을 선택하여 안건을 확인하고 투표에 참여하세요.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <VotingPowerCard
            onClick={() => setIsVotingPowerPanelOpen(true)}
            isActive={isVotingPowerPanelOpen}
          />
          <DelegationCard onClick={() => setIsDelegationPanelOpen(true)} />
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 bg-gray-800 p-2 rounded-xl border border-gray-600 shadow-lg">
          <div className="flex gap-2 p-1 overflow-x-auto w-full lg:w-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-[#1ABCF7] text-black shadow-sm'
                    : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex w-full lg:w-auto gap-3 items-center">
            <div className="relative w-full lg:w-72">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1ABCF7] focus:border-transparent placeholder-gray-500"
                placeholder="건물 이름 또는 위치로 검색..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 rounded-lg border border-gray-600 bg-black/50 hover:bg-gray-900 text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#1ABCF7] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400">포트폴리오를 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <h3 className="text-red-400 font-bold">오류 발생</h3>
              </div>
              <p className="text-gray-300">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredProperties.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <h3 className="text-gray-400 text-lg font-bold mb-2">보유한 부동산이 없습니다</h3>
              <p className="text-gray-500 text-sm">부동산을 구매하여 거버넌스에 참여해보세요.</p>
            </div>
          </div>
        )}

        {/* Properties Grid */}
        {!isLoading && !error && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <GovernancePropertyCard
                key={property.id}
                {...property}
                onClick={() => handlePropertyClick(property)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 disabled:opacity-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#1ABCF7] text-black font-bold text-sm shadow-sm shadow-[#1ABCF7]/30">
              1
            </button>
            <button className="w-10 h-10 rounded-lg hover:bg-gray-800 text-gray-400 font-medium text-sm transition-colors">
              2
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </main>

      {/* Governance Proposal Panel */}
      <GovernanceProposalPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        property={selectedProperty}
      />

      {/* Voting Power Panel */}
      <VotingPowerPanel
        isOpen={isVotingPowerPanelOpen}
        onClose={() => setIsVotingPowerPanelOpen(false)}
      />

      {/* Delegation Panel */}
      <DelegationPanel
        isOpen={isDelegationPanelOpen}
        onClose={() => setIsDelegationPanelOpen(false)}
      />
    </div>
  )
}
