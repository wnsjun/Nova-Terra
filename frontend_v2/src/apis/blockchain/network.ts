// ============================================
//       2. 네트워크 전환 (Giwa Sepolia)
// ============================================
/**
 * MetaMask를 Giwa Sepolia 네트워크로 전환
 * chainId: 91342 (0x16506)
 */
export const switchToGiwaSepolia = async (): Promise<void> => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask가 설치되지 않았습니다')
  }

  const chainIdHex = '0x164CE' // 91342

  try {
    // 먼저 네트워크 전환 시도
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIdHex }],
    })
    console.log('✅ Giwa Sepolia로 네트워크 전환 성공!')
  } catch (switchError: unknown) {
    // 네트워크가 MetaMask에 없으면 추가
    const error = switchError as { code?: number; message?: string }
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: chainIdHex,
              chainName: 'Giwa Sepolia',
              nativeCurrency: {
                name: 'Giwa ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia-rpc.giwa.io'], // RPC URL 확인 필요
              blockExplorerUrls: ['https://sepolia-explorer.giwa.io'],
            },
          ],
        })
        console.log('✅ Giwa Sepolia 네트워크 추가 및 전환 성공!')
      } catch (addError) {
        throw new Error('Giwa Sepolia 네트워크 추가 실패: ' + (addError as Error).message)
      }
    } else {
      throw new Error('네트워크 전환 실패: ' + (error.message || '알 수 없는 오류'))
    }
  }
}
