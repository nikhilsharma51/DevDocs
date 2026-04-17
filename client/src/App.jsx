// src/App.jsx
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="bottom-right" toastOptions={{
        style: { fontSize: '13px', borderRadius: '10px' }
      }} />
    </AuthProvider>
  )
}