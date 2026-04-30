import { instance } from '../utils/axiosInstance'

export interface PropertyResponse {
  id: string
  name: string
  description: string
  address: string
  coverImageUrl: string
  buildingType: 'OFFICETEL' | 'COMMERCIAL' | 'APARTMENT' | 'VILLA' | 'DETACHED_HOUSE' | 'MULTI_FAMILY_HOUSE' | 'OFFICE' | 'LAND' | 'FACTORY_WAREHOUSE'
  exclusiveAreaSqm: number
  totalFloors: number
  floor: string
  useApprovalDate: number
  parkingSpaces: number
  direction: string
  roomCount: number
  bathroomCount: number
  managementFee: number
  occupancyRate: number
  majorTenants: string
  totalMonthlyRent: number
  totalValuation: number
  totalTokens: number
  pricePerToken: number
  expenseRate: number
  feeRate: number
  status: 'FUNDING' | 'ACTIVE' | 'COMPLETED'
}

export interface PropertiesApiResponse {
  code: number
  message: string
  data: PropertyResponse[]
}

export interface PropertyDetailApiResponse {
  code: number
  message: string
  data: PropertyResponse
}

export const getProperties = async (): Promise<PropertyResponse[]> => {
  try {
    const response = await instance.get<PropertiesApiResponse>('/api/v1/properties')
    return response.data.data
  } catch (error) {
    console.error('부동산 목록 조회 실패:', error)
    throw error
  }
}

export const getPropertyById = async (propertyId: string): Promise<PropertyResponse> => {
  try {
    const response = await instance.get<PropertyDetailApiResponse>(`/api/v1/properties/${propertyId}`)
    return response.data.data
  } catch (error) {
    console.error('부동산 상세 조회 실패:', error)
    throw error
  }
}

export const getBuildingTypeLabel = (buildingType: PropertyResponse['buildingType']): string => {
  const typeMap: Record<PropertyResponse['buildingType'], string> = {
    OFFICETEL: '오피스텔',
    COMMERCIAL: '상가',
    APARTMENT: '아파트',
    VILLA: '빌라/연립',
    DETACHED_HOUSE: '단독주택',
    MULTI_FAMILY_HOUSE: '다세대주택',
    OFFICE: '사무실/오피스 빌딩',
    LAND: '토지',
    FACTORY_WAREHOUSE: '공장/창고',
  }
  return typeMap[buildingType]
}

export const getBuildingTypeColor = (buildingType: PropertyResponse['buildingType']): string => {
  const colorMap: Record<PropertyResponse['buildingType'], string> = {
    OFFICETEL: 'text-[#1ABCF7] border-[#1ABCF7]/30',
    COMMERCIAL: 'text-orange-400 border-orange-400/30',
    APARTMENT: 'text-blue-400 border-blue-400/30',
    VILLA: 'text-purple-400 border-purple-400/30',
    DETACHED_HOUSE: 'text-green-400 border-green-400/30',
    MULTI_FAMILY_HOUSE: 'text-yellow-400 border-yellow-400/30',
    OFFICE: 'text-[#1ABCF7] border-[#1ABCF7]/30',
    LAND: 'text-emerald-400 border-emerald-400/30',
    FACTORY_WAREHOUSE: 'text-purple-400 border-purple-400/30',
  }
  return colorMap[buildingType]
}

export interface HoldingResponse {
  property: PropertyResponse
  amount: number
}

export interface PortfolioResponse {
  userId: string
  holdings: HoldingResponse[]
}

export interface PortfolioApiResponse {
  code: number
  message: string
  data: PortfolioResponse
}

export const getPortfolio = async (): Promise<HoldingResponse[]> => {
  try {
    const response = await instance.get<PortfolioApiResponse>('/api/v1/portfolio/me')
    return response.data.data.holdings
  } catch (error) {
    console.error('포트폴리오 조회 실패:', error)
    throw error
  }
}

// Governance Proposals
export type ProposalStatus = 'PENDING' | 'ACTIVE' | 'PASSED' | 'FAILED' | 'CANCELLED'

export interface ProposalResponse {
  id: string
  title: string
  description: string
  propertyId: string
  propertyName: string
  proposerName: string
  startAt: number
  endTime: number
  choices: string[]
  status: ProposalStatus
}

export interface ProposalsApiResponse {
  code: number
  message: string
  data: ProposalResponse[]
}

export const getProposalsByProperty = async (propertyId: string): Promise<ProposalResponse[]> => {
  try {
    const response = await instance.get<ProposalsApiResponse>('/api/v1/governance/proposals', {
      params: { propertyId }
    })
    return response.data.data
  } catch (error) {
    console.error('제안 목록 조회 실패:', error)
    throw error
  }
}

export const getProposalStatusLabel = (status: ProposalStatus): string => {
  const statusMap: Record<ProposalStatus, string> = {
    PENDING: '유예 기간',
    ACTIVE: '진행 중',
    PASSED: '통과됨',
    FAILED: '부결됨',
    CANCELLED: '취소됨',
  }
  return statusMap[status]
}

export interface CreateProposalRequest {
  propertyId: string
  title: string
  description: string
  startAt: number
  endAt: number
  onChainProposalId: number
}

export const createProposal = async (data: CreateProposalRequest): Promise<ProposalResponse> => {
  try {
    const response = await instance.post<{ code: number; message: string; data: ProposalResponse }>('/api/v1/governance/proposals', data)
    return response.data.data
  } catch (error) {
    console.error('제안 생성 실패:', error)
    throw error
  }
}

export const mapProposalStatusToUI = (status: ProposalStatus): 'active' | 'passed' | 'rejected' | 'executed' => {
  const statusMap: Record<ProposalStatus, 'active' | 'passed' | 'rejected' | 'executed'> = {
    PENDING: 'active',
    ACTIVE: 'active',
    PASSED: 'passed',
    FAILED: 'rejected',
    CANCELLED: 'rejected',
  }
  return statusMap[status]
}
