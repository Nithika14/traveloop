import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { Plus, MapPin, Calendar, Trash2, Eye } from 'lucide-react'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

const TABS = ['upcoming', 'ongoing', 'completed']

export default function MyTrips() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchTrips = () => {
    setLoading(true)
    api.get(`/trips?status=${activeTab}`)
      .then(res => setTrips(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrips() }, [activeTab])

  const deleteTrip = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this trip?')) return
    await api.delete(`/trips/${id}`)
    toast.success('Trip deleted')
    fetchTrips()
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white" style={{fontFamily:'Sora'}}>My Trips</h1>
        <button onClick={() => navigate('/trips/new')}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> New Trip
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#16213E] p-1 rounded-xl w-fit mb-6 border border-purple-900/30">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all
              ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Trip List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-[#16213E] rounded-xl animate-pulse" />)}
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-[#16213E] rounded-xl p-16 text-center border border-purple-900/30">
          <p className="text-gray-400 text-lg mb-1">No {activeTab} trips</p>
          <p className="text-gray-600 text-sm mb-4">Start planning your next adventure!</p>
          <button onClick={() => navigate('/trips/new')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm transition">
            Create Trip
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map(trip => (
            <div key={trip.id}
              className="bg-[#16213E] rounded-xl p-5 border border-purple-900/30 hover:border-purple-500/40 transition-all flex items-center justify-between group">
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                <h3 className="font-semibold text-white group-hover:text-purple-300 transition mb-1" style={{fontFamily:'Sora'}}>
                  {trip.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-purple-400" />
                    {trip.stops?.length || 0} stop{trip.stops?.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-purple-400" />
                    {dayjs(trip.startDate).format('MMM D')} – {dayjs(trip.endDate).format('MMM D, YYYY')}
                  </span>
                  {trip.totalBudget && (
                    <span className="text-green-400">💰 ${trip.totalBudget.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => navigate(`/trips/${trip.id}`)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-600/30 transition">
                  <Eye size={16} />
                </button>
                <button onClick={(e) => deleteTrip(trip.id, e)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}