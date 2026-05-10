import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, Trash2, MapPin, Clock, DollarSign, GripVertical } from 'lucide-react'
import dayjs from 'dayjs'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddStop, setShowAddStop] = useState(false)
  const [stopForm, setStopForm] = useState({ cityName: '', country: '', startDate: '', endDate: '' })
  const [activityForms, setActivityForms] = useState({})

  const fetchTrip = () => {
    api.get(`/trips/${id}`).then(res => setTrip(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchTrip() }, [id])

  const addStop = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/trips/${id}/stops`, { ...stopForm, order: trip.stops.length })
      toast.success('Stop added!')
      setShowAddStop(false)
      setStopForm({ cityName: '', country: '', startDate: '', endDate: '' })
      fetchTrip()
    } catch { toast.error('Failed to add stop') }
  }

  const deleteStop = async (stopId) => {
    if (!confirm('Delete this stop?')) return
    await api.delete(`/stops/${stopId}`)
    toast.success('Stop removed')
    fetchTrip()
  }

  const addActivity = async (stopId) => {
    const form = activityForms[stopId]
    if (!form?.name) return toast.error('Enter activity name')
    try {
      await api.post(`/stops/${stopId}/activities`, {
        name: form.name, type: form.type || 'sightseeing',
        cost: parseFloat(form.cost) || 0,
        duration: parseInt(form.duration) || 60,
        time: form.time || ''
      })
      toast.success('Activity added!')
      setActivityForms(f => ({...f, [stopId]: {}}))
      fetchTrip()
    } catch { toast.error('Failed to add activity') }
  }

  const deleteActivity = async (actId) => {
    await api.delete(`/activities/${actId}`)
    fetchTrip()
  }

  const setAF = (stopId, key, val) => {
    setActivityForms(f => ({...f, [stopId]: {...(f[stopId]||{}), [key]: val}}))
  }

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = trip.stops.findIndex(s => s.id === active.id)
    const newIndex = trip.stops.findIndex(s => s.id === over.id)
    const reordered = arrayMove(trip.stops, oldIndex, newIndex)
    setTrip(t => ({...t, stops: reordered}))
    await Promise.all(reordered.map((s, i) => api.put(`/stops/${s.id}`, { order: i })))
  }

  const totalCost = trip?.stops?.flatMap(s => s.activities).reduce((sum, a) => sum + a.cost, 0) || 0

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!trip) return <div className="p-8 text-white">Trip not found</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <button onClick={() => navigate('/trips')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition text-sm">
        <ArrowLeft size={16} /> Back to Trips
      </button>

      <div className="flex items-start justify-between mb-2">
        <h1 className="text-2xl font-bold text-white" style={{fontFamily:'Sora'}}>{trip.name}</h1>
        <span className="bg-purple-600/20 text-purple-300 text-sm px-3 py-1 rounded-full capitalize">{trip.status}</span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
        <span className="flex items-center gap-1"><Clock size={13} className="text-purple-400" />
          {dayjs(trip.startDate).format('MMM D')} – {dayjs(trip.endDate).format('MMM D, YYYY')}
        </span>
        {trip.totalBudget && (
          <span className="flex items-center gap-1">
            <DollarSign size={13} className="text-green-400" />
            Budget: ${trip.totalBudget.toLocaleString()}
          </span>
        )}
      </div>

      {/* Budget bar */}
      {trip.totalBudget && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Spent: ${totalCost.toFixed(0)}</span>
            <span>Budget: ${trip.totalBudget.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${totalCost > trip.totalBudget ? 'bg-red-500' : 'bg-green-500'}`}
              style={{width: `${Math.min((totalCost / trip.totalBudget) * 100, 100)}%`}} />
          </div>
          {totalCost > trip.totalBudget && (
            <p className="text-red-400 text-xs mt-1">⚠️ Over budget by ${(totalCost - trip.totalBudget).toFixed(0)}</p>
          )}
        </div>
      )}

      {trip.description && <p className="text-gray-400 text-sm mb-6">{trip.description}</p>}

      {/* Stops */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white" style={{fontFamily:'Sora'}}>
          Itinerary ({trip.stops?.length || 0} stops)
        </h2>
        <button onClick={() => setShowAddStop(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm transition">
          <Plus size={15} /> Add Stop
        </button>
      </div>

      {/* Add Stop Form */}
      {showAddStop && (
        <div className="bg-[#16213E] rounded-xl p-5 border border-purple-500/50 mb-4">
          <h3 className="text-white font-medium mb-3">New Stop</h3>
          <form onSubmit={addStop} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input required value={stopForm.cityName} onChange={e => setStopForm(f=>({...f,cityName:e.target.value}))}
                placeholder="City name" className="input-field" />
              <input required value={stopForm.country} onChange={e => setStopForm(f=>({...f,country:e.target.value}))}
                placeholder="Country" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input required type="date" value={stopForm.startDate} onChange={e => setStopForm(f=>({...f,startDate:e.target.value}))}
                className="input-field" />
              <input required type="date" value={stopForm.endDate} onChange={e => setStopForm(f=>({...f,endDate:e.target.value}))}
                className="input-field" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition">Add</button>
              <button type="button" onClick={() => setShowAddStop(false)} className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Sortable Stops */}
      {trip.stops?.length === 0 ? (
        <div className="bg-[#16213E] rounded-xl p-12 text-center border border-purple-900/30">
          <MapPin size={32} className="text-purple-400 mx-auto mb-3" />
          <p className="text-gray-400">No stops yet. Add your first destination!</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={trip.stops.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {trip.stops.map((stop, idx) => (
                <SortableStop key={stop.id} stop={stop} idx={idx}
                  onDelete={() => deleteStop(stop.id)}
                  activityForm={activityForms[stop.id] || {}}
                  setAF={(k, v) => setAF(stop.id, k, v)}
                  onAddActivity={() => addActivity(stop.id)}
                  onDeleteActivity={deleteActivity}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

function SortableStop({ stop, idx, onDelete, activityForm, setAF, onAddActivity, onDeleteActivity }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop.id })
  const style = { transform: CSS.Transform.toString(transform), transition }
  const [showAddActivity, setShowAddActivity] = useState(false)

  const stopCost = stop.activities?.reduce((sum, a) => sum + a.cost, 0) || 0

  return (
    <div ref={setNodeRef} style={style}
      className="bg-[#16213E] rounded-xl border border-purple-900/30 overflow-hidden">
      {/* Stop Header */}
      <div className="flex items-center gap-3 p-4 border-b border-purple-900/20">
        <button {...attributes} {...listeners} className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing">
          <GripVertical size={18} />
        </button>
        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {idx + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-purple-400" />
            <span className="font-semibold text-white" style={{fontFamily:'Sora'}}>{stop.cityName}</span>
            <span className="text-gray-500 text-sm">{stop.country}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {dayjs(stop.startDate).format('MMM D')} – {dayjs(stop.endDate).format('MMM D')}
            {stopCost > 0 && <span className="ml-2 text-green-400">· ${stopCost.toFixed(0)}</span>}
          </p>
        </div>
        <button onClick={onDelete} className="p-1.5 text-gray-500 hover:text-red-400 transition rounded">
          <Trash2 size={15} />
        </button>
      </div>

      {/* Activities */}
      <div className="p-4 space-y-2">
        {stop.activities?.map(act => (
          <div key={act.id} className="flex items-center gap-3 bg-[#1A1A2E] rounded-lg px-3 py-2.5 group">
            <span className="text-lg">{typeEmoji(act.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{act.name}</p>
              <p className="text-gray-500 text-xs">
                {act.time && `${act.time} · `}{act.duration}min
                {act.cost > 0 && ` · $${act.cost}`}
              </p>
            </div>
            <button onClick={() => onDeleteActivity(act.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition p-1">
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {/* Add Activity */}
        {showAddActivity ? (
          <div className="bg-[#1A1A2E] rounded-lg p-3 space-y-2 border border-purple-900/30">
            <input value={activityForm.name || ''} onChange={e => setAF('name', e.target.value)}
              placeholder="Activity name *" className="input-field text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <select value={activityForm.type || 'sightseeing'} onChange={e => setAF('type', e.target.value)}
                className="input-field text-sm">
                {['sightseeing','food','adventure','transport','stay'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input type="time" value={activityForm.time || ''} onChange={e => setAF('time', e.target.value)}
                className="input-field text-sm" />
              <input type="number" placeholder="Cost $" value={activityForm.cost || ''} onChange={e => setAF('cost', e.target.value)}
                className="input-field text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => { onAddActivity(); setShowAddActivity(false) }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs transition">
                Add
              </button>
              <button onClick={() => setShowAddActivity(false)}
                className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs transition">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddActivity(true)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm transition py-1">
            <Plus size={14} /> Add activity
          </button>
        )}
      </div>
    </div>
  )
}

const typeEmoji = (type) => ({
  sightseeing: '🏛️', food: '🍽️', adventure: '🧗', transport: '🚌', stay: '🏨'
}[type] || '📍')