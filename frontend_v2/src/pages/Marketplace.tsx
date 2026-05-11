import { useState, useEffect } from 'react'
import Topbar from '../layouts/Topbar'
import SearchBar from '../components/marketplace/SearchBar'
import FilterBar from '../components/marketplace/FilterBar'
import PropertyCard from '../components/marketplace/PropertyCard'
import PropertyDetailPanel from '../components/marketplace/PropertyDetailPanel'
import STOPurchasePanel from '../components/marketplace/STOPurchasePanel'
import arrowdownIcon from '../assets/arrowdown.svg'
import PropertyMap from '../components/marketplace/PropertyMap'
import { getProperties, getBuildingTypeLabel, getBuildingTypeColor } from '../apis/properties'
import { getPropertyBasicInfo } from '../apis/blockchain/contracts/propertyToken'
import type { PropertyBasicInfo } from '../apis/blockchain/contracts/propertyToken'

interface Property {
  id: string
  name: string
  location: string
  locationDetail: string
  type: string
  typeColor: string
  image: string
  occupancyRate: number
  monthlyRent: number
  totalValue: number
  stoPrice: number
  fundingPercentage: number
  investors: number
  description: string
  highlights: string[]
  dividendCycle: string
  nextDividend: string
  latitude?: number
  longitude?: number
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: 'mock-1',
    name: '강남 프라임 오피스',
    location: '서울 강남구',
    locationDetail: '서울특별시 강남구 테헤란로 152',
    type: '오피스',
    typeColor: 'bg-blue-500',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800',
    occupancyRate: 95,
    monthlyRent: 85000000,
    totalValue: 12000000000,
    stoPrice: 100000,
    fundingPercentage: 72,
    investors: 1243,
    description: '강남 핵심 업무지구에 위치한 프리미엄 오피스 빌딩. 대형 IT 기업 앵커 테넌트 입주.',
    highlights: ['주요 임차인: 삼성SDS, 카카오', '전용면적: 4500㎡', '주차 공간: 200면'],
    dividendCycle: '매월',
    nextDividend: '15일 후',
  },
  {
    id: 'mock-2',
    name: '판교 테크노밸리 지식산업센터',
    location: '경기 성남시',
    locationDetail: '경기도 성남시 분당구 판교역로 235',
    type: '지식산업센터',
    typeColor: 'bg-purple-500',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    occupancyRate: 98,
    monthlyRent: 62000000,
    totalValue: 8500000000,
    stoPrice: 50000,
    fundingPercentage: 58,
    investors: 876,
    description: '판교 테크노밸리 내 최신 지식산업센터. 스타트업 및 IT 기업 밀집 지역.',
    highlights: ['주요 임차인: 카카오게임즈, 크래프톤', '전용면적: 3200㎡', '주차 공간: 150면'],
    dividendCycle: '매월',
    nextDividend: '22일 후',
  },
  {
    id: 'mock-3',
    name: '해운대 마린시티 상업시설',
    location: '부산 해운대구',
    locationDetail: '부산광역시 해운대구 마린시티2로 33',
    type: '상업시설',
    typeColor: 'bg-green-500',
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800',
    occupancyRate: 89,
    monthlyRent: 38000000,
    totalValue: 5200000000,
    stoPrice: 30000,
    fundingPercentage: 41,
    investors: 532,
    description: '해운대 마린시티 랜드마크 상업시설. 관광객 및 고소득 거주자 밀집 상권.',
    highlights: ['주요 임차인: 스타벅스, CGV', '전용면적: 2100㎡', '주차 공간: 80면'],
    dividendCycle: '매월',
    nextDividend: '8일 후',
  },
]

export default function Marketplace() {
  const [visibleCount, setVisibleCount] = useState(6)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [purchaseProperty, setPurchaseProperty] = useState<Property | null>(null)
  const [isPurchasePanelOpen, setIsPurchasePanelOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [blockchainData, setBlockchainData] = useState<Record<string, PropertyBasicInfo>>({})

  // 블록체인데이터 읽기 (배치 처리로 rate limit 회피)
  useEffect(() => {
    const fetchBlockchainData = async () => {
      const BATCH_SIZE = 3  // 한 번에 3개씩 처리
      const DELAY_MS = 500   // 배치 간 500ms 대기

      const newBlockchainData: Record<string, PropertyBasicInfo> = {}

      // 배치로 나눠서 처리
      for (let i = 0; i < properties.length; i += BATCH_SIZE) {
        const batch = properties.slice(i, i + BATCH_SIZE)

        // 배치 내에서는 병렬 처리
        const promises = batch.map(async (property) => {
          if (property.id) {
            try {
              const data = await getPropertyBasicInfo(property.id)
              return { id: property.id, data }
            } catch (error) {
              console.error(`블록체인 데이터 로드 실패 (${property.id}):`, error)
              return null
            }
          }
          return null
        })

        const results = await Promise.all(promises)

        // 성공한 것들만 저장
        results.forEach(result => {
          if (result && result.data) {
            newBlockchainData[result.id] = result.data
          }
        })

        // 중간 결과를 실시간으로 업데이트 (사용자가 빠르게 볼 수 있도록)
        setBlockchainData({ ...newBlockchainData })

        // 마지막 배치가 아니면 대기
        if (i + BATCH_SIZE < properties.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_MS))
        }
      }
    }

    if (properties.length > 0) {
      fetchBlockchainData()
    }
  }, [properties])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties()
        // FUNDING 상태인 부동산만 필터링
        const fundingProperties = data.filter(prop => prop.status === 'FUNDING')
        const transformedProperties: Property[] = fundingProperties.map((prop) => ({
          id: prop.id,
          name: prop.name,
          location: prop.address.split(' ').slice(0, 2).join(' '),
          locationDetail: prop.address,
          type: getBuildingTypeLabel(prop.buildingType),
          typeColor: getBuildingTypeColor(prop.buildingType),
          image: prop.coverImageUrl,
          occupancyRate: prop.occupancyRate,
          monthlyRent: prop.totalMonthlyRent,
          totalValue: prop.totalValuation,
          stoPrice: prop.pricePerToken,
          fundingPercentage: 75,
          investors: 1000,
          description: prop.description,
          highlights: [
            `주요 임차인: ${prop.majorTenants}`,
            `전용면적: ${prop.exclusiveAreaSqm}㎡`,
            `주차 공간: ${prop.parkingSpaces}면`
          ],
          dividendCycle: '매월',
          nextDividend: '15일 후',
          latitude: prop.latitude,
          longitude: prop.longitude,
        }))
        setProperties(transformedProperties)
      } catch (error) {
        console.error('부동산 데이터 로드 실패, 목데이터 사용:', error)
        setProperties(MOCK_PROPERTIES)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6)
  }

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
    setIsPanelOpen(true)
  }

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setTimeout(() => setSelectedProperty(null), 300)
  }

  const handlePurchaseClick = (property: Property) => {
    setPurchaseProperty(property)
    setIsPurchasePanelOpen(true)
  }

  const handleClosePurchasePanel = () => {
    setIsPurchasePanelOpen(false)
    setTimeout(() => setPurchaseProperty(null), 300)
  }

  const handleDetailPanelPurchase = () => {
    if (selectedProperty) {
      // Detail panel 닫기
      setIsPanelOpen(false)
      // Purchase panel 열기
      setPurchaseProperty(selectedProperty)
      setIsPurchasePanelOpen(true)
      // Detail panel 상태 초기화
      setTimeout(() => setSelectedProperty(null), 300)
    }
  }

  const visibleProperties = properties.slice(0, visibleCount)
  const hasMore = visibleCount < properties.length

  return (
    <div className="min-h-screen bg-black">
      <Topbar />

      {/* Full-width map hero */}
      <section className="relative w-full" style={{ marginTop: '0px', height: '100vh' }}>
        <PropertyMap
          properties={properties.filter(p => p.latitude && p.longitude).map(p => ({
            id: p.id,
            name: p.name,
            address: p.locationDetail,
            coverImageUrl: p.image,
            buildingType: p.type,
            occupancyRate: p.occupancyRate,
            totalMonthlyRent: p.monthlyRent,
            totalValuation: p.totalValue,
            pricePerToken: p.stoPrice,
            latitude: p.latitude!,
            longitude: p.longitude!,
          }))}
          onPropertyClick={(id) => {
            const prop = properties.find(p => p.id === id)
            if (prop) handlePropertyClick(prop)
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-4 text-center bg-black/20 pointer-events-none">
          <div className="flex max-w-3xl flex-col gap-4">
            <h1 className="text-4xl font-black leading-tight tracking-tighter text-white md:text-6xl">
              <span className="text-[#1ABCF7]">미래</span>의 부동산을 소유하세요
            </h1>
            <p className="text-lg text-white md:text-xl">
              높은 수익률, 즉각적인 유동성, 블록체인 투명성을 갖춘 프리미엄 토큰화된 부동산에 투자하세요.
            </p>
          </div>
          <div className="pointer-events-auto">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="w-full border-b border-gray-500"></div>
      <FilterBar />
      <div className="w-full border-b border-gray-500"></div>

      <section className="flex-1 px-4 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-baseline justify-between">
            <h3 className="text-2xl font-bold text-white">추천 부동산</h3>
            <a className="text-sm font-medium text-[#1ABCF7] hover:text-[#A020F0] transition-colors hover:underline" href="#">
              전체 보기 ({properties.length})
            </a>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ABCF7]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  totalSupply={blockchainData[property.id]?.totalSupply}
                  maxSupply={blockchainData[property.id]?.maxSupply}
                  remainingSupply={blockchainData[property.id]?.remainingSupply || '0'}
                  symbol={blockchainData[property.id]?.symbol || ''}
                  {...property}
                  onClick={() => handlePropertyClick(property)}
                  onPurchaseClick={() => handlePurchaseClick(property)}
                />
              ))}
            </div>
          )}
          {!loading && hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="cursor-pointer flex items-center gap-2 rounded-full border border-gray-600 bg-gray-800 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-700 hover:border-[#1ABCF7]"
              >
                더 많은 자산 보기
                <img src={arrowdownIcon} alt="dropdown" className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Property Detail Panel */}
      <PropertyDetailPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        property={selectedProperty}
        onPurchaseClick={handleDetailPanelPurchase}
      />

      {/* STO Purchase Panel */}
      <STOPurchasePanel
        isOpen={isPurchasePanelOpen}
        onClose={handleClosePurchasePanel}
        property={purchaseProperty}
        symbol={blockchainData[purchaseProperty?.id ?? '']?.symbol || ''}
      />
    </div>
  )
}
