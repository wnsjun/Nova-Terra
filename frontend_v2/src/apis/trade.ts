import { instance } from '../utils/axiosInstance'

export interface TradeOrder {
  id: string
  propertyId: string
  propertyName: string
  sellerAddress: string
  buyerAddress?: string
  tokenAmount: number
  pricePerToken: number
  filledAmount: number
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  type: 'BUY' | 'SELL'
  createdAt: string
}

export interface CreateOrderRequest {
  propertyId: string
  type: 'BUY' | 'SELL'
  tokenAmount: number
  pricePerToken: number
}

interface TradeOrderListResponse {
  code: number
  message: string
  data: TradeOrder[]
}

interface TradeOrderResponse {
  code: number
  message: string
  data: TradeOrder
}

export const getTradeOrders = async (propertyId?: string): Promise<TradeOrder[]> => {
  try {
    const params = propertyId ? { propertyId } : {}
    const response = await instance.get<TradeOrderListResponse>('/api/v1/trades', { params })
    return response.data.data
  } catch (error) {
    console.error('거래 목록 조회 실패:', error)
    throw error
  }
}

export const getMyTradeOrders = async (): Promise<TradeOrder[]> => {
  try {
    const response = await instance.get<TradeOrderListResponse>('/api/v1/trades/my')
    return response.data.data
  } catch (error) {
    console.error('내 거래 목록 조회 실패:', error)
    throw error
  }
}

export const createOrder = async (data: CreateOrderRequest): Promise<TradeOrder> => {
  try {
    const response = await instance.post<TradeOrderResponse>('/api/v1/trades', data)
    return response.data.data
  } catch (error) {
    console.error('주문 생성 실패:', error)
    throw error
  }
}

export const cancelOrder = async (orderId: string): Promise<void> => {
  try {
    await instance.delete(`/api/v1/trades/${orderId}`)
  } catch (error) {
    console.error('주문 취소 실패:', error)
    throw error
  }
}
