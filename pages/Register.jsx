import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { Globe } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    city: '',
    country: '',
  })

  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      const res = await api.post('/auth/register', form)

      login(res.data.token, res.data.user)

      toast.success('Account created! Welcome to Traveloop 🌍')

      navigate('/')
    } catch (err) {
      toast.error(
        err.response?.data?.error || 'Registration failed'
      )
    } finally {
      setLoading(false)
    }
  }

  const field = (
    key,
    label,
    type = 'text',
    placeholder = ''
  ) => (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">
        {label}
      </label>

      <input
        type={type}
        required={[
          'firstName',
          'lastName',
          'email',
          'password',
        ].includes(key)}
        value={form[key]}
        onChange={(e) =>
          setForm({ ...form, [key]: e.target.value })
        }
        placeholder={placeholder}
        className="w-full bg-[#1A1A2E] border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Globe className="text-purple-400" size={32} />

            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Sora' }}
            >
              Traveloop
            </h1>
          </div>

          <p className="text-gray-400 text-sm">
            Create your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#16213E] rounded-2xl p-8 border border-purple-900/30 shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              {field(
                'firstName',
                'First Name',
                'text',
                'John'
              )}

              {field(
                'lastName',
                'Last Name',
                'text',
                'Doe'
              )}
            </div>

            {/* Email */}
            {field(
              'email',
              'Email',
              'email',
              'you@example.com'
            )}

            {/* Password */}
            {field(
              'password',
              'Password',
              'password',
              '••••••••'
            )}

            {/* Optional fields */}
            <div className="grid grid-cols-2 gap-3">
              {field(
                'city',
                'City (optional)',
                'text',
                'Dubai'
              )}

              {field(
                'country',
                'Country (optional)',
                'text',
                'UAE'
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all mt-2"
            >
              {loading
                ? 'Creating account...'
                : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}