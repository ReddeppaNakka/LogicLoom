import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Shell from './components/Shell'
import { useApp } from './store/useApp'

const Onboarding = lazy(() => import('./pages/Onboarding'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Gates = lazy(() => import('./pages/Gates'))
const GateDetail = lazy(() => import('./pages/GateDetail'))
const ConceptPage = lazy(() => import('./pages/ConceptPage'))
const Patterns = lazy(() => import('./pages/Patterns'))
const PatternDetail = lazy(() => import('./pages/PatternDetail'))
const Calendar = lazy(() => import('./pages/Calendar'))
const Trainer = lazy(() => import('./pages/Trainer'))
const Problems = lazy(() => import('./pages/Problems'))
const Log = lazy(() => import('./pages/Log'))
const SettingsPage = lazy(() => import('./pages/Settings'))
const Scratchpad = lazy(() => import('./pages/Scratchpad'))
const Boss = lazy(() => import('./pages/Boss'))

function Loading() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="eyebrow eyebrow-system glow-pulse">Loading the System…</div>
    </div>
  )
}

export default function App() {
  const onboarded = useApp((s) => s.profile.onboarded)
  if (!onboarded) {
    return (
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="*" element={<Onboarding />} />
        </Routes>
      </Suspense>
    )
  }
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gates" element={<Gates />} />
          <Route path="/gates/:gateId" element={<GateDetail />} />
          <Route path="/learn/:conceptId" element={<ConceptPage />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/patterns/:patternId" element={<PatternDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/log" element={<Log />} />
          <Route path="/scratchpad" element={<Scratchpad />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/boss/:questId" element={<Boss />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
