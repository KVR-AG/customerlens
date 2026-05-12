import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersonaProvider } from '@/hooks/usePersona'
import { AppLayout } from '@/components/shell/AppLayout'
import { LoginPage } from '@/pages/Login/LoginPage'
import { HomePage } from '@/pages/Home/HomePage'
import { MetricsExplorerPage } from '@/pages/MetricsExplorer/MetricsExplorerPage'
import { CampaignBuilderPage } from '@/pages/CampaignBuilder/CampaignBuilderPage'
import { ActionQueuePage } from '@/pages/ActionQueue/ActionQueuePage'
import { CalendarPage } from '@/pages/Calendar/CalendarPage'
import { TalkToDataPage } from '@/pages/TalkToData/TalkToDataPage'
import { AdminPage } from '@/pages/Admin/AdminPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PersonaProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<AppLayout />}>
              <Route path="/home"      element={<HomePage />} />
              <Route path="/metrics"   element={<MetricsExplorerPage />} />
              <Route path="/campaigns" element={<CampaignBuilderPage />} />
              <Route path="/actions"   element={<ActionQueuePage />} />
              <Route path="/calendar"  element={<CalendarPage />} />
              <Route path="/chat"      element={<TalkToDataPage />} />
              <Route path="/admin"     element={<AdminPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PersonaProvider>
    </QueryClientProvider>
  )
}
