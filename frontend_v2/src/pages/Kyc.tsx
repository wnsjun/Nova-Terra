import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import Topbar from '../layouts/Topbar'
import { instance } from '../utils/axiosInstance'

type Step = 'stripe' | 'done'

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
const STRIPE_SK = import.meta.env.VITE_STRIPE_SECRET_KEY as string

export default function Kyc() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('stripe')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')

  const handleStripeVerify = async () => {
    setVerifying(true)
    setError('')
    try {
      // 1. VerificationSession 생성 (테스트용 — secret key 프론트 사용)
      const res = await fetch('https://api.stripe.com/v1/identity/verification_sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${STRIPE_SK}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ type: 'document' }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.message ?? 'Stripe 세션 생성 실패')
      }

      const session = await res.json()
      const clientSecret: string = session.client_secret

      // 2. Stripe.js로 인증 모달 열기
      const stripe = await loadStripe(STRIPE_PK)
      if (!stripe) throw new Error('Stripe 로드 실패')

      const { error: stripeError } = await stripe.verifyIdentity(clientSecret)

      if (stripeError) {
        // 사용자가 모달을 닫은 경우(canceled)는 에러로 처리 안 함
        if (stripeError.code !== 'session_canceled') {
          throw new Error(stripeError.message)
        }
        return
      }

      // 3. 인증 통과 → 백엔드 KYC 기록
      await instance.post('/api/v1/users/me/kyc')
      setStep('done')
    } catch (err: any) {
      setError(err.message ?? 'Stripe 인증에 실패했습니다.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#10131e]">
      <Topbar />

      <div className="max-w-xl mx-auto px-6 py-16">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-3 mb-10">
          {(['stripe', 'done'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                step === s || (step === 'done' && i < 2)
                  ? 'bg-[#1ABCF7] border-[#1ABCF7] text-black'
                  : 'border-white/20 text-white/30'
              }`}>{i + 1}</div>
              <span className={`text-xs font-medium ${step === s ? 'text-white' : 'text-white/30'}`}>
                {s === 'stripe' ? 'Stripe 신원 인증' : '인증 완료'}
              </span>
              {i < 1 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Step 1: Stripe Identity 인증 */}
        {step === 'stripe' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">신원 인증 (KYC)</h1>
              <p className="text-sm text-gray-400">Stripe Identity를 통해 신원을 확인합니다.</p>
            </div>

            {/* Stripe 카드 */}
            <div className="bg-[#1c1f2b] border border-white/10 rounded-2xl p-6 space-y-5">
              {/* Stripe 로고 영역 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#635BFF] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Stripe Identity</p>
                  <p className="text-gray-400 text-xs">테스트 모드 — 실제 신분증 불필요</p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                  TEST
                </span>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                {[
                  '신원 정보 실시간 검증',
                  '테스트 환경에서 자동 통과',
                  '검증 결과 온체인 기록',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#1ABCF7] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              onClick={handleStripeVerify}
              disabled={verifying}
              className="w-full bg-[#635BFF] text-white font-bold py-3.5 text-sm rounded-xl hover:bg-[#5850eb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Stripe 인증 진행 중...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                  </svg>
                  Stripe Identity로 인증하기
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: 완료 */}
        {step === 'done' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#1ABCF7]/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1ABCF7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-1">KYC 인증 완료</h1>
                <p className="text-sm text-gray-400">Stripe Identity 인증이 성공적으로 완료되었습니다.</p>
              </div>
            </div>

            <div className="bg-[#1c1f2b] border border-white/10 p-5 space-y-3 rounded-xl">
              {[
                { label: 'KYC 신원 확인', value: '적격' },
                { label: '투자 적격자 여부', value: '적격' },
                { label: '인증 제공자', value: 'Stripe Identity' },
                { label: '국가', value: '대한민국 (KR)' },
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="text-sm font-bold text-[#1ABCF7]">{item.value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/marketplace')}
              className="w-full bg-[#1ABCF7] text-black font-bold py-3.5 text-sm hover:bg-[#1ABCF7]/90 transition-colors rounded-xl"
            >
              마켓플레이스로 이동
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
