import { useState, useEffect } from 'react'
import { getPropertyInfoByTokenAddress } from '../../apis/blockchain/contracts/tokenFactory'
import {
  getDividendIds,
  getDividendInfo,
  getClaimableDividend,
  isClaimedDividend,
  claimDividend
} from '../../apis/blockchain/contracts/dividendDistributor'
import { getBalanceAtSnapshot } from '../../apis/blockchain/contracts/propertyToken'
import { getWalletAddress } from '../../apis/blockchain/provider'

interface ClaimRecord {
  dividendId: number
  month: string
  totalAmount: number       // 전체 배당 금액 (KRWT)
  myClaimable: number       // 내가 받을 수 있는 금액 (KRWT)
  status: 'unclaimed' | 'claimed' | 'expired'
  claimedDate?: string
  txHash?: string
}

interface ClaimHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  asset: {
    id: string
    name: string
    image?: string
  } | null
  onClaim: (month: string, amount: number) => void
}

export default function ClaimHistoryPanel({ isOpen, onClose, asset, onClaim }: ClaimHistoryPanelProps) {
  const [claimRecords, setClaimRecords] = useState<ClaimRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [claimingId, setClaimingId] = useState<number | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)

  useEffect(() => {
    if (!asset || !isOpen) return

    const loadClaimHistory = async () => {
      try {
        setIsLoading(true)
        setClaimRecords([])

        // 1. TokenFactory에서 dividendAddress 가져오기 (tokenAddress 역방향 조회)
        const propertyInfo = await getPropertyInfoByTokenAddress(asset.id)
        if (!propertyInfo || propertyInfo.dividendAddress === '0x0000000000000000000000000000000000000000') {
          console.warn('DividendDistributor 주소를 찾을 수 없습니다:', asset.id)
          return
        }
        const dividendAddress = propertyInfo.dividendAddress

        // 2. 모든 배당 ID 가져오기
        const dividendIds = await getDividendIds(dividendAddress)
        const userAddress = await getWalletAddress()

        // 3. 각 배당 정보 + 내 수령 가능 금액 병렬 조회
        const records: ClaimRecord[] = await Promise.all(
          dividendIds.map(async (id) => {
            const dividendId = Number(id)
            const [info, myClaimableRaw, isClaimed] = await Promise.all([
              getDividendInfo(dividendAddress, dividendId),
              getClaimableDividend(dividendAddress, dividendId),
              isClaimedDividend(dividendAddress, dividendId),
            ])

            const date = new Date(Number(info.timestamp) * 1000)
            const month = `${date.getFullYear()}년 ${date.getMonth() + 1}월`
            const totalAmount = Number(BigInt(info.totalAmount) / BigInt(10 ** 18))

            // 이미 클레임한 배당금은 getClaimableDividend가 0을 반환하므로
            // dividendPerToken × balanceOfAt(snapshotId)로 직접 계산
            let myClaimable: number
            if (isClaimed && Number(info.snapshotId) > 0) {
              try {
                const balanceAtSnapshot = await getBalanceAtSnapshot(asset.id, userAddress, Number(info.snapshotId))
                const PRECISION = BigInt(10 ** 18)
                const wei = BigInt(info.dividendPerToken) * BigInt(balanceAtSnapshot) / PRECISION
                myClaimable = Number(wei) / 10 ** 18
              } catch {
                myClaimable = 0
              }
            } else {
              myClaimable = Number(BigInt(myClaimableRaw) / BigInt(10 ** 18))
            }

            let status: ClaimRecord['status']
            if (isClaimed) {
              status = 'claimed'
            } else if (!info.active) {
              status = 'expired'
            } else {
              status = 'unclaimed'
            }

            return {
              dividendId,
              month,
              totalAmount,
              myClaimable,
              status,
              claimedDate: isClaimed ? date.toLocaleDateString('ko-KR') : undefined,
            }
          })
        )

        // 최신순 정렬
        records.sort((a, b) => b.dividendId - a.dividendId)
        setClaimRecords(records)
      } catch (error) {
        console.error('클레임 내역 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadClaimHistory()
  }, [asset?.id, isOpen])

  const totalMyClaimed = claimRecords
    .filter(r => r.status === 'claimed')
    .reduce((sum, r) => sum + r.myClaimable, 0)

  const totalMyUnclaimed = claimRecords
    .filter(r => r.status === 'unclaimed')
    .reduce((sum, r) => sum + r.myClaimable, 0)

  const handleClaimClick = async (dividendId: number, month: string, amount: number) => {
    if (!asset) return
    setClaimingId(dividendId)
    setClaimError(null)
    try {
      const propertyInfo = await getPropertyInfoByTokenAddress(asset.id)
      if (!propertyInfo || propertyInfo.dividendAddress === '0x0000000000000000000000000000000000000000') {
        setClaimError('배당 컨트랙트 주소를 찾을 수 없습니다.')
        return
      }
      const txHash = await claimDividend(propertyInfo.dividendAddress, dividendId)

      setClaimRecords(prev =>
        prev.map(r =>
          r.dividendId === dividendId
            ? { ...r, status: 'claimed' as const, claimedDate: new Date().toLocaleDateString('ko-KR'), txHash }
            : r
        )
      )
      onClaim(month, amount)
    } catch (err: unknown) {
      const e = err as { code?: number | string; message?: string; reason?: string }
      if (e.code === 4001 || e.code === 'ACTION_REJECTED') {
        setClaimError('서명이 거부되었습니다.')
      } else {
        setClaimError('클레임 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setClaimingId(null)
    }
  }

  if (!asset) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      ></div>

      {/* Panel */}
      <div
        className={`fixed right-0 z-50 w-full md:w-1/2 overflow-y-auto bg-black border-l border-gray-600 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 left-4 z-10 float-left ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 border border-gray-600 text-white transition-all hover:bg-gray-700 hover:border-[#1ABCF7]"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {asset.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-600">
                  <img src={asset.image} alt={asset.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">수익 클레임 관리</h2>
                <p className="text-gray-400 text-sm">{asset.name}</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 border border-gray-600 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-2">총 수령한 수익</p>
              <p className="text-2xl font-bold text-white">KRWT {totalMyClaimed.toLocaleString()}</p>
            </div>
            <div className="bg-linear-to-br from-gray-800 to-[#1ABCF7]/5 border border-[#1ABCF7]/30 rounded-xl p-5">
              <p className="text-sm text-gray-400 mb-2">미수령 수익</p>
              <p className="text-2xl font-bold text-[#1ABCF7] drop-shadow-[0_0_10px_rgba(26,188,247,0.5)]">
                KRWT {totalMyUnclaimed.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {claimError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {claimError}
            </div>
          )}

          {/* Claim Records */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">클레임 내역</h3>
            <div className="space-y-3">
              {isLoading && (
                <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1ABCF7]"></div>
                  블록체인 데이터 로딩중...
                </div>
              )}
              {!isLoading && claimRecords.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">배당 내역이 없습니다.</p>
                </div>
              )}
              {claimRecords.map((record) => (
                <div
                  key={record.dividendId}
                  className={`bg-gray-800 border rounded-xl p-5 transition-all ${
                    record.status === 'unclaimed'
                      ? 'border-[#1ABCF7]/30 shadow-[0_0_15px_rgba(26,188,247,0.1)]'
                      : 'border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-white">{record.month}</h4>
                        {record.status === 'unclaimed' && (
                          <span className="flex h-2 w-2 rounded-full bg-[#1ABCF7] shadow-[0_0_5px_#1ABCF7] animate-pulse"></span>
                        )}
                        {record.status === 'expired' && (
                          <span className="rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400">만료됨</span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-white">KRWT {record.myClaimable.toLocaleString()}</p>
                        <span className="text-xs text-gray-500">내 수령분</span>
                      </div>
                      {record.status === 'claimed' && record.claimedDate && (
                        <span className="text-xs text-gray-400 mt-1 block">수령일: {record.claimedDate}</span>
                      )}
                    </div>

                    <div className="ml-4">
                      {record.status === 'unclaimed' ? (
                        <button
                          onClick={() => handleClaimClick(record.dividendId, record.month, record.myClaimable)}
                          disabled={claimingId === record.dividendId}
                          className="cursor-pointer flex items-center gap-2 rounded-lg bg-[#1ABCF7] px-6 py-3 text-sm font-bold text-black shadow-[0_0_10px_rgba(26,188,247,0.3)] transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {claimingId === record.dividendId ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                              처리중
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                              </svg>
                              클레임 받기
                            </>
                          )}
                        </button>
                      ) : record.status === 'claimed' ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">완료</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">만료</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-gray-800 border border-gray-600 rounded-xl p-5">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-[#1ABCF7] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-gray-300">
                <p className="font-medium mb-1">안내</p>
                <ul className="space-y-1 text-gray-400">
                  <li>• 클레임은 발생 후 언제든지 가능합니다.</li>
                  <li>• 클레임 시 가스비가 발생할 수 있습니다.</li>
                  <li>• 만료된 배당은 컨트랙트 오너가 회수한 상태입니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
