import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

function HomePlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <p className="text-ink font-serif text-xl">Nourish — Step 1 scaffold. Preferences screen next.</p>
    </div>
  )
}

function PlanPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="text-ink font-mono text-sm">/plan — Plan page (Step 3)</p>
    </div>
  )
}

function ShoppingPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <p className="text-ink font-mono text-sm">/shopping — Shopping page (Step 4)</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePlaceholder />} />
        <Route path="/plan" element={<PlanPlaceholder />} />
        <Route path="/shopping" element={<ShoppingPlaceholder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
