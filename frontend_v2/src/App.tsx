import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

import Onboarding from './pages/Onboarding'
import Marketplace from './pages/Marketplace'
import MarketTrade from './pages/MarketTrade'
import Portfolio from './pages/Portfolio'
import Governance from './pages/Governance'
import Trade from './pages/Trade'
import OAuthCallback from './pages/OAuthCallback'
import Kyc from './pages/Kyc'
import Accredited from './pages/Accredited'

//나중에 지워
import BlockchainTest from './pages/BlockchainTest'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/trade/:id" element={<MarketTrade />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/test" element={<BlockchainTest />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/kyc" element={<Kyc />} />
          <Route path="/accredited" element={<Accredited />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
