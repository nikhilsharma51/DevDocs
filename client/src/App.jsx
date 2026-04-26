// src/App.jsx
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './hooks/useTheme'
import AppRouter from './routes/AppRouter'
import { Toaster } from 'react-hot-toast'

function AppContent() {
  const { isDark } = useTheme()

  return (
    <AuthProvider>
      <AppRouter />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            // Keep toast visuals aligned with active app theme.
            fontSize: '13px',
            borderRadius: '8px',
            border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            background: isDark ? '#111827' : '#ffffff',
            color: isDark ? '#e5e7eb' : '#0f172a',
          },
        }}
      />
    </AuthProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}