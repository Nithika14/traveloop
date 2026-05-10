import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Plus, MapPin, Calendar, ArrowRight } from 'lucide-react'
import dayjs from 'dayjs'

const featuredCities = [
  { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400', tag: '🗼 Romance' },
  { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', tag: '🍜 Culture' },
  { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', tag: '🌴 Nature' },
  { name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=400', tag: '🗽 City' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/trips').then(res => setTrips(res.data.slice(0, 3))).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden h-52 bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-800 flex items-center px-8">
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage:`url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200')`, backgroundSize:'cover', backgroundPosition:'center'}} />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2" style={{fontFamily:'Sora'}}>
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-purple-200 mb-4">Where are you heading next?</p>
          <button onClick={() => navigate('/trips/new')}
            className="flex items-center gap-2 bg-[#F5A623] hover:bg-yellow-500 text-black font-semibold px-5 py-2.5 rounded-lg transition-all">
            <Plus size={18} /> Plan a Trip
          </button>
        </div>
      </div>

      {/* Featured Cities */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white" style={{fontFamily:'Sora'}}>Top Destinations</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredCities.map(city => (
            <div key={city.name} onClick={() => navigate('/trips/new')}
              className="rounded-xl overflow-hidden cursor-pointer group relative h-36 bg-gray-800">
              <img src={city.image} alt={city.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-white font-semibold text-sm" style={{fontFamily:'Sora'}}>{city.name}</p>
                <p className="text-gray-300 text-xs">{city.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Trips */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white" style={{fontFamily:'Sora'}}>Recent Trips</h2>
          <button onClick={() => navigate('/trips')}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm transition">
            View all <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="flex gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 flex-1 bg-[#16213E] rounded-xl animate-pulse" />)}
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-[#16213E] rounded-xl p-10 text-center border border-purple-900/30">
            <p className="text-gray-400 mb-3">No trips yet!</p>
            <button onClick={() => navigate('/trips/new')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm transition">
              Create your first trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trips.map(trip => (
              <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function TripCard({ trip, onClick }) {
  const statusColors = {
    upcoming: 'bg-blue-500/20 text-blue-300',
    ongoing: 'bg-green-500/20 text-green-300',
    completed: 'bg-gray-500/20 text-gray-300',
  }
  return (
    <div onClick={onClick}
      className="bg-[#16213E] rounded-xl p-5 border border-purple-900/30 hover:border-purple-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-900/20 group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-white group-hover:text-purple-300 transition" style={{fontFamily:'Sora'}}>
          {trip.name}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[trip.status] || statusColors.upcoming}`}>
          {trip.status}
        </span>
      </div>
      <div className="space-y-1.5 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <MapPin size={13} className="text-purple-400" />
          <span>{trip.stops?.length || 0} destination{trip.stops?.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-purple-400" />
          <span>{dayjs(trip.startDate).format('MMM D')} – {dayjs(trip.endDate).format('MMM D, YYYY')}</span>
        </div>
      </div>
    </div>
  )
}