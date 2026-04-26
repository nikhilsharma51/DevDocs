
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import ThemeToggleButton from '../components/ui/ThemeToggleButton'

export default function RegisterPage() {
  const { signUp }  = useAuth()
  const navigate    = useNavigate()
  const [authError, setAuthError]   = useState(null)
  const [isLoading, setIsLoading]   = useState(false)
  const [registered, setRegistered] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  // watch password field to validate confirm password
  const password = watch('password')

  async function onSubmit(data) {
    setIsLoading(true)
    setAuthError(null)

    const { error } = await signUp(data.email, data.password, data.name)

    if (error) {
      setAuthError(error.message)
      setIsLoading(false)
      return
    }

    // Supabase sends a confirmation email by default
    // show a success message instead of navigating immediately
    setRegistered(true)
    setIsLoading(false)
  }

  // after signup — show confirmation message
  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggleButton compact />
        </div>

        <div className="w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-[18px] font-medium text-gray-900 mb-2">Check your email</h2>
          <p className="text-[13px] text-gray-500 mb-4">
            We sent a confirmation link to your email. Click it to activate your account.
          </p>
          <Link to="/login" className="text-[13px] text-purple-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative">
      {/* Keep theme switch available on unauthenticated screens. */}
      <div className="absolute top-4 right-4">
        <ThemeToggleButton compact />
      </div>

      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-[22px] font-medium text-gray-900">DevDocs</h1>
          <p className="text-[13px] text-gray-400 mt-1">Create your account</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">

          {authError && (
            <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-[12px] text-red-600">{authError}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Full name
              </label>
              <input
                placeholder="Rohan Sharma"
                {...register('name', { required: 'Name is required' })}
                className="w-full h-9.5 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
              />
              {errors.name && (
                <p className="text-[11px] text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

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
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
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
                  minLength: { value: 6, message: 'At least 6 characters' }
                })}
                className="w-full h-9.5 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
              />
              {errors.password && (
                <p className="text-[11px] text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: val => val === password || 'Passwords do not match'
                })}
                className="w-full h-9.5 bg-gray-50 border border-gray-200 rounded-lg px-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-purple-300 transition-colors"
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full h-9.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>

          </div>

          <p className="text-center text-[12px] text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}