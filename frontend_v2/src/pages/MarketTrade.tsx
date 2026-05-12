import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Topbar from '../layouts/Topbar'
import PropertyDetail from '../components/marketplace/PropertyDetail'
import { getPropertyById, getBuildingTypeLabel, getBuildingTypeColor } from '../apis/properties'

export default function MarketTrade() {
  const { id } = useParams()
  const [property, setProperty] = useState<{
    name: string
    location: string
    type: string
    typeColor: string
    image: string
    vacancyRate: string
    annualYield: string
    totalValue: string
    stoPrice: string
    fundingPercentage: number
    investors: number
    symbol: string
    contractAddress: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError(true)
        setLoading(false)
        return
      }

      try {
        const data = await getPropertyById(id)
        setProperty({
          name: data.name,
          location: data.address.split(' ').slice(0, 2).join(' '),
          type: getBuildingTypeLabel(data.buildingType),
          typeColor: getBuildingTypeColor(data.buildingType),
          image: data.coverImageUrl,
          vacancyRate: `${((1 - data.occupancyRate) * 100).toFixed(1)}%`,
          annualYield: `KRWT ${(data.totalMonthlyRent / 10000).toFixed(0)}만`,
          totalValue: `KRWT ${(data.totalValuation / 100000000).toFixed(1)}억`,
          stoPrice: `KRWT ${(data.totalValuation / data.totalTokens).toFixed(0)}`,
          fundingPercentage: 75,
          investors: 1000,
          symbol: 'NPT', // TODO: API에서 symbol 가져오기
          contractAddress: data.id,
        })
      } catch (error) {
        console.error('부동산 상세 조회 실패:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const currentProperty = property

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Topbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ABCF7]"></div>
        </div>
      </div>
    )
  }

  if (error || !currentProperty) {
    return (
      <div className="min-h-screen bg-black">
        <Topbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <p className="text-white text-xl">부동산을 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Topbar />

      <PropertyDetail
        name={currentProperty.name}
        location={currentProperty.location}
        type={currentProperty.type}
        typeColor={currentProperty.typeColor}
        image={currentProperty.image}
        vacancyRate={currentProperty.vacancyRate}
        annualYield={currentProperty.annualYield}
        totalValue={currentProperty.totalValue}
        stoPrice={currentProperty.stoPrice}
        fundingPercentage={currentProperty.fundingPercentage}
        investors={currentProperty.investors}
        symbol={currentProperty.symbol}
        contractAddress={currentProperty.contractAddress}
      />
    </div>
  )
}