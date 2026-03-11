import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PreferencesPage } from '@/features/preferences/PreferencesPage'
import { PlanPage } from '@/features/plan/PlanPage'
import { ShoppingPage } from '@/features/shopping/ShoppingPage'
import { AppHeader } from '@/components/AppHeader'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 overflow-y-auto pt-4">
          <Routes>
            <Route path="/" element={<PreferencesPage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
