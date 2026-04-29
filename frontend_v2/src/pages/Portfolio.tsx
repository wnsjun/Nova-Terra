import { useState, useEffect } from 'react'
import Topbar from '../layouts/Topbar'
import PortfolioAssetCard from '../components/portfolio/PortfolioAssetCard'
import PortfolioDetailPanel from '../components/portfolio/PortfolioDetailPanel'
import ClaimHistoryPanel from '../components/portfolio/ClaimHistoryPanel'
import { getPortfolio, type PropertyResponse } from '../apis/properties'
import { getPropertyInfo } from '../apis/blockchain/contracts/tokenFactory'
import { getTotalClaimable } from '../apis/blockchain/contracts/dividendDistributor'

interface Asset {
  id: string
  name: string
  location: string
  image?: string
  status: 'active' | 'preparing'
  holdingAmount: number
  currentValue: number
  unclaimedRewards: number
  symbol: string
  propertyData: PropertyResponse
}

export default function Portfolio() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [claimAsset, setClaimAsset] = useState<Asset | null>(null)
  const [isClaimPanelOpen, setIsClaimPanelOpen] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const holdings = await getPortfolio()

        // 각 holding에 대해 블록체인 데이터 가져오기
        const transformedAssets: Asset[] = await Promise.all(
          holdings.map(async (holding) => {
            let unclaimedRewards = 0

            try {
              // TokenFactory에서 dividendAddress 가져오기
              const propertyInfo = await getPropertyInfo('3') // TODO: 실제 propertyId 사용해야 함

              // DividendDistributor에서 미수령 배당금 조회
              const totalClaimable = await getTotalClaimable(propertyInfo.dividendAddress)
              unclaimedRewards = Number(totalClaimable)
            } catch (error) {
              console.error(`${holding.property.name} 미수령 수익 조회 실패:`, error)
              unclaimedRewards = 0 // 실패하면 0으로 설정
            }

            return {
              id: holding.property.id,
              name: holding.property.name,
              location: holding.property.address.split(' ').slice(0, 2).join(' '),
              image: holding.property.coverImageUrl,
              status: holding.property.status === 'ACTIVE' ? 'active' : 'preparing',
              holdingAmount: holding.amount,
              currentValue: holding.property.pricePerToken * holding.amount,
              unclaimedRewards: unclaimedRewards, // 블록체인에서 가져온 실제 값
              symbol: 'NPT', // TODO: API에서 symbol 추가 필요
              propertyData: holding.property,
            }
          })
        )

        setAssets(transformedAssets)
      } catch (error) {
        console.error('포트폴리오 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [])

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0)
  const averageYield = 6.8

  const handleClaim = (id: string) => {
    const asset = assets.find(a => a.id === id)
    if (asset) {
      setClaimAsset(asset)
      setIsClaimPanelOpen(true)
    }
  }

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setTimeout(() => setSelectedAsset(null), 300)
  }

  const handleCloseClaimPanel = () => {
    setIsClaimPanelOpen(false)
    setTimeout(() => setClaimAsset(null), 300)
  }

  const handleClaimMonth = (month: string, amount: number) => {
    alert(`${month} 수익 KRWT${amount.toLocaleString()}를 클레임합니다!`)
    // TODO: 실제 클레임 로직 구현
  }

  const handleDetailPanelClaim = () => {
    if (selectedAsset) {
      // Detail panel 닫기
      setIsPanelOpen(false)
      // Claim panel 열기
      setClaimAsset(selectedAsset)
      setIsClaimPanelOpen(true)
      // Detail panel 상태 초기화
      setTimeout(() => setSelectedAsset(null), 300)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Topbar />

      <section className="px-4 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">내 포트폴리오</h1>
            <p className="text-gray-400 text-sm">보유 자산 현황과 수익을 관리하세요.</p>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Total Asset Value */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-600 bg-gray-800 p-6 group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#1ABCF7]/10 blur-xl transition-all group-hover:bg-[#1ABCF7]/20"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-black border border-gray-600 text-[#1ABCF7]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-400">총 자산 가치</span>
              </div>
              <div className="text-2xl font-bold text-white">KRWT {totalAssetValue.toLocaleString()}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-[#1ABCF7]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>+12.5% (전월 대비)</span>
              </div>
            </div>

            {/* Cumulative Rewards */}
            {/* <div className="relative overflow-hidden rounded-2xl border border-gray-600 bg-gray-800 p-6 group">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-purple-500/10 blur-xl transition-all group-hover:bg-purple-500/20"></div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-black border border-gray-600 text-purple-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-400">누적 임대 수익</span>
              </div>
              <div className="text-2xl font-bold text-white">KRWT {cumulativeRewards.toLocaleString()}</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <span>최근 지급: 2023.10.01</span>
              </div>
            </div> */}

            {/* Claimable Rewards */}
            {/* <div className="relative overflow-hidden rounded-2xl border border-[#1ABCF7]/30 bg-linear-to-br from-gray-800 to-[#1ABCF7]/5 p-6 group shadow-[0_0_15px_rgba(26,188,247,0.1)]">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#1ABCF7]/20 blur-xl"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex w-10 h-10 items-center justify-center rounded-full bg-[#1ABCF7] text-black border border-[#1ABCF7] font-bold shadow-[0_0_10px_rgba(26,188,247,0.4)]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white">수령 가능 수익</span>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-[#1ABCF7] shadow-[0_0_5px_#1ABCF7] animate-pulse"></span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">KRWT {totalUnclaimedRewards.toLocaleString()}</div>
            </div> */}

            {/* Average Yield */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-600 bg-gray-800 p-6 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex w-10 h-10 items-center justify-center rounded-full bg-black border border-gray-600 text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-400">평균 수익률 (APY)</span>
              </div>
              <div className="text-2xl font-bold text-white">{averageYield}%</div>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <span>업계 평균 상위 5%</span>
              </div>
            </div>
          </div>

          {/* Asset List */}
          <h3 className="mb-6 text-xl font-bold text-white flex items-center gap-2">
            보유 자산 목록
            <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400">{assets.length}</span>
          </h3>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ABCF7]"></div>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">보유한 자산이 없습니다</p>
              <p className="text-gray-500 text-sm">마켓플레이스에서 부동산 STO를 구매해보세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <PortfolioAssetCard
                  key={asset.id}
                  {...asset}
                  onClaim={handleClaim}
                  onClick={() => handleAssetClick(asset)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Portfolio Detail Panel */}
      <PortfolioDetailPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        asset={selectedAsset}
        onClaimClick={handleDetailPanelClaim}
      />

      {/* Claim History Panel */}
      <ClaimHistoryPanel
        isOpen={isClaimPanelOpen}
        onClose={handleCloseClaimPanel}
        asset={claimAsset}
        onClaim={handleClaimMonth}
      />
    </div>
  )
}
