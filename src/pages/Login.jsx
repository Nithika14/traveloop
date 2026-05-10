import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Plane,
} from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      const res = await api.post('/auth/login', form)

      login(res.data.token, res.data.user)

      toast.success(`Welcome back, ${res.data.user.firstName}!`)

      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e1b4b] flex items-center justify-center overflow-hidden relative px-4">

      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-100px] w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-3xl"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-2xl mb-5">
            <Plane className="text-white" size={40} />
          </div>

          <h1
            className="text-5xl font-bold text-white"
            style={{
              fontFamily: 'Sora',
            }}
          >
            Travel
            <span className="text-pink-400">oop</span>
          </h1>

          <p className="text-gray-300 mt-3 text-sm">
            Personalized Travel Planning Experience
          </p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[30px] p-8 shadow-[0_10px_50px_rgba(0,0,0,0.5)]">

          <div className="mb-8">
            <h2
              className="text-3xl font-semibold text-white"
              style={{
                fontFamily: 'Sora',
              }}
            >
              Welcome Back 👋
            </h2>

            <p className="text-gray-300 mt-2">
              Continue planning your dream journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-200 mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className="w-full bg-[#111827]/70 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-200 mb-2 block">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full bg-[#111827]/70 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPass ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="text-sm text-pink-400 hover:text-pink-300"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10"></div>

            <span className="text-gray-400 text-sm">
              OR CONTINUE WITH
            </span>

            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Button */}
          <button className="w-full py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all">
            Continue with Google
          </button>

          {/* Register */}
          <p className="text-center text-gray-300 text-sm mt-7">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-pink-400 hover:text-pink-300 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}