import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../layouts/Topbar'
import { instance } from '../utils/axiosInstance'
import bank1 from '../assets/bank1.png'
import bank2 from '../assets/bank2.png'
import bank3 from '../assets/bank3.png'
import bank4 from '../assets/bank4.png'

type Step = 'plaid' | 'done'
type PlaidScreen = 'select' | 'login' | 'connecting' | 'success'

const BANKS = [
  { name: '국민은행', logo: bank1 },
  { name: '우리은행', logo: bank2 },
  { name: '하나은행', logo: bank3 },
  { name: '토스뱅크', logo: bank4 },
]

export default function Accredited() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('plaid')
  const [modalOpen, setModalOpen] = useState(false)
  const [plaidScreen, setPlaidScreen] = useState<PlaidScreen>('select')
  const [selectedBank, setSelectedBank] = useState('')
  const [username, setUsername] = useState('user_good')
  const [password, setPassword] = useState('pass_good')

  const handleBankSelect = (bank: string) => {
    setSelectedBank(bank)
    setPlaidScreen('login')
  }

  const handleLogin = async () => {
    setPlaidScreen('connecting')
    await new Promise(r => setTimeout(r, 2200))
    setPlaidScreen('success')
    await new Promise(r => setTimeout(r, 1000))
    setModalOpen(false)
    await instance.post('/api/v1/users/me/credit-check')
    setStep('done')
  }

  const handleOpenModal = () => {
    setPlaidScreen('select')
    setSelectedBank('')
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#10131e]">
      <Topbar />

      <div className="max-w-xl mx-auto px-6 py-16">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center gap-3 mb-10">
          {(['plaid', 'done'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                step === s || (step === 'done' && i < 2)
                  ? 'bg-[#1ABCF7] border-[#1ABCF7] text-black'
                  : 'border-white/20 text-white/30'
              }`}>{i + 1}</div>
              <span className={`text-xs font-medium ${step === s ? 'text-white' : 'text-white/30'}`}>
                {s === 'plaid' ? '금융 자산 인증' : '인증 완료'}
              </span>
              {i < 1 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Step 1: Plaid 연동 */}
        {step === 'plaid' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">투자 적격자 인증</h1>
              <p className="text-sm text-gray-400">Plaid를 통해 금융 자산을 확인합니다.</p>
            </div>

            <div className="bg-[#1c1f2b] border border-white/10 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00B09B] flex items-center justify-center">
                  <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
                    <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm3 18h-6v-2h2v-6h-2v-2h4v8h2v2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Plaid</p>
                  <p className="text-gray-400 text-xs">Sandbox 모드 — 테스트 계좌 사용</p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
                  SANDBOX
                </span>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                {[
                  '은행 계좌 연동으로 자산 검증',
                  '테스트 환경에서 샌드박스 계좌 사용',
                  '투자 적격자(Accredited Investor) 확인',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-[#1ABCF7] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-xl p-3 text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-300">Sandbox 테스트 계정</p>
                <p>ID: <span className="text-white font-mono">user_good</span></p>
                <p>PW: <span className="text-white font-mono">pass_good</span></p>
              </div>
            </div>

            <button
              onClick={handleOpenModal}
              className="w-full bg-[#00B09B] text-white font-bold py-3.5 text-sm rounded-xl hover:bg-[#009688] transition-colors flex items-center justify-center gap-2"
            >
              Plaid로 자산 인증하기
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
                <h1 className="text-2xl font-bold text-white mb-1">투자 적격자 인증 완료</h1>
                <p className="text-sm text-gray-400">Plaid 금융 자산 인증이 성공적으로 완료되었습니다.</p>
              </div>
            </div>

            <div className="bg-[#1c1f2b] border border-white/10 p-5 space-y-3 rounded-xl">
              {[
                { label: '인증 상태', value: '적격' },
                { label: '투자 적격자 여부', value: 'Accredited Investor' },
                { label: '인증 제공자', value: 'Plaid' },
                { label: '연동 은행', value: selectedBank },
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

      {/* Plaid 목업 모달 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[420px] bg-white rounded-2xl overflow-hidden shadow-2xl">

            {/* 모달 헤더 */}
            <div className="bg-[#1B4F8A] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-sm">Plaid</span>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 은행 선택 */}
            {plaidScreen === 'select' && (
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Connect your bank</h2>
                <p className="text-sm text-gray-500 mb-5">Select your financial institution to verify your assets.</p>
                <div className="space-y-2">
                  {BANKS.map(bank => (
                    <button
                      key={bank.name}
                      onClick={() => handleBankSelect(bank.name)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-[#1B4F8A] hover:bg-blue-50 transition-all text-left"
                    >
                      <img src={bank.logo} alt={bank.name} className="w-9 h-9 rounded-lg object-contain shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{bank.name}</span>
                      <svg className="ml-auto w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-5">
                  Secured by <span className="font-semibold text-gray-600">Plaid</span> · 256-bit encryption
                </p>
              </div>
            )}

            {/* 로그인 */}
            {plaidScreen === 'login' && (
              <div className="p-6">
                <button onClick={() => setPlaidScreen('select')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{selectedBank}</h2>
                <p className="text-sm text-gray-500 mb-5">Enter your online banking credentials.</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B4F8A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1B4F8A] transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogin}
                  className="w-full mt-5 bg-[#1B4F8A] text-white font-bold py-3 text-sm rounded-lg hover:bg-[#163f6e] transition-colors"
                >
                  Submit
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  Secured by <span className="font-semibold text-gray-600">Plaid</span> · 256-bit encryption
                </p>
              </div>
            )}

            {/* 연결 중 */}
            {plaidScreen === 'connecting' && (
              <div className="p-10 flex flex-col items-center gap-5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4F8A]" />
                <div className="text-center">
                  <p className="text-gray-900 font-bold">Connecting to {selectedBank}...</p>
                  <p className="text-sm text-gray-500 mt-1">Verifying your account information</p>
                </div>
              </div>
            )}

            {/* 연결 완료 */}
            {plaidScreen === 'success' && (
              <div className="p-10 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-bold">Successfully connected!</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedBank} account verified</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
