
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import ThemeToggleButton from '../components/ui/ThemeToggleButton'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const [authError, setAuthError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  async function onSubmit(data) {
    setIsLoading(true)
    setAuthError(null)

    const { error } = await signIn(data.email, data.password)

    if (error) {
      setAuthError(error.message)
      setIsLoading(false)
      return
    }

    // success — AuthContext updates automatically via onAuthStateChange
    // just navigate to dashboard
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      {/* Keep theme switch available on unauthenticated screens. */}
      <div className="absolute top-4 right-4">
        <ThemeToggleButton compact />
      </div>

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-[22px] font-medium text-gray-900">DevDocs</h1>
          <p className="text-[13px] text-gray-400 mt-1">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">

          {/* Auth error from Supabase */}
          {authError && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[12px] text-red-600">{authError}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email'
                  }
                })}
                className="w-full h-9.5 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                className="w-full h-9.5 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
              />
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full h-9.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

          </div>

          {/* Register link */}
          <p className="text-center text-[12px] text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}