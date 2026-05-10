import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Globe } from 'lucide-react'

export default function CreateTrip() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '',
    startDate: '', endDate: '', totalBudget: ''
  })

  const set = (key, val) => setForm(f => ({...f, [key]: val}))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date must be after start date')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/trips', form)
      toast.success('Trip created! Now add your stops 🗺️')
      navigate(`/trips/${res.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-bold text-white mb-6" style={{fontFamily:'Sora'}}>
        Plan a New Trip ✈️
      </h1>

      <div className="bg-[#16213E] rounded-2xl p-8 border border-purple-900/30">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Trip Name */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Trip Name *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Europe Summer 2025"
              className="w-full bg-[#1A1A2E] border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Start Date *</label>
              <input required type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}
                className="w-full bg-[#1A1A2E] border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">End Date *</label>
              <input required type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)}
                className="w-full bg-[#1A1A2E] border border-purple-900/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition" />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Total Budget (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={form.totalBudget} onChange={e => set('totalBudget', e.target.value)}
                placeholder="e.g. 3000"
                className="w-full bg-[#1A1A2E] border border-purple-900/50 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="What's this trip about?"
              className="w-full bg-[#1A1A2E] border border-purple-900/50 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2">
            <Globe size={18} />
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
      </div>
    </div>
  )
}