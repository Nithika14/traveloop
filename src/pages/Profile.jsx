import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { User, Mail, MapPin, Save } from 'lucide-react'

export default function Profile() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    city: user?.city || '',
    country: user?.country || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put(`/users/${user.id}`, form)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setLoading(false) }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6" style={{fontFamily:'Sora'}}>Profile</h1>

      <div className="bg-[#16213E] rounded-2xl p-8 border border-purple-900/30">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.firstName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-400 text-sm flex items-center gap-1"><Mail size={12}/> {user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[['firstName','First Name'],['lastName','Last Name']].map(([key,label]) => (
              <div key={key}>
                <label className="text-sm text-gray-400 mb-1 block">{label}</label>
                <input value={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))}
                  className="input-field" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['city','City'],['country','Country']].map(([key,label]) => (
              <div key={key}>
                <label className="text-sm text-gray-400 mb-1 block">{label}</label>
                <input value={form[key]} onChange={e => setForm(f=>({...f,[key]:e.target.value}))}
                  className="input-field" />
              </div>
            ))}
          </div>

          <button onClick={handleSave} disabled={loading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg transition">
            <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}