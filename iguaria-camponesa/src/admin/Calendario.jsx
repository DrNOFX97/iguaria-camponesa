import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ESTADOS = ['Disponível', 'Lotado', 'Fechado']
const NEXT = { 'Disponível': 'Lotado', 'Lotado': 'Fechado', 'Fechado': 'Disponível' }

const CORES = {
  Disponível: {
    bg:    'bg-[#3a7d44]/25',
    text:  'text-[#6dbf7e]',
    border:'border-[#6dbf7e]/30',
    dot:   'bg-[#6dbf7e]',
    label: 'Disponível',
  },
  Lotado: {
    bg:    'bg-dourado/15',
    text:  'text-dourado',
    border:'border-dourado/40',
    dot:   'bg-dourado',
    label: 'Lotado',
  },
  Fechado: {
    bg:    'bg-vinho/20',
    text:  'text-[#c47070]',
    border:'border-vinho/30',
    dot:   'bg-vinho',
    label: 'Fechado',
  },
}

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function firstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay()
  return (d + 6) % 7  // Monday = 0
}

export default function Calendario() {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [data,  setData]  = useState({})  // { 'YYYY-MM-DD': estado }
  const [saving,setSaving]= useState(null)

  useEffect(() => { load() }, [year, month])

  const load = async () => {
    const from = `${year}-${String(month+1).padStart(2,'0')}-01`
    const to   = `${year}-${String(month+1).padStart(2,'0')}-${String(daysInMonth(year,month)).padStart(2,'0')}`
    const { data: rows } = await supabase
      .from('calendario')
      .select('data, estado')
      .gte('data', from).lte('data', to)
    const map = {}
    rows?.forEach(r => { map[r.data] = r.estado })
    setData(map)
  }

  const clickDay = async (dateStr) => {
    const current = data[dateStr] ?? 'Disponível'
    const next    = NEXT[current]
    setSaving(dateStr)

    if (next === 'Disponível') {
      // Remove record (default = Disponível)
      await supabase.from('calendario').delete().eq('data', dateStr)
      setData(prev => { const n = { ...prev }; delete n[dateStr]; return n })
    } else {
      await supabase.from('calendario').upsert({ data: dateStr, estado: next }, { onConflict: 'data' })
      setData(prev => ({ ...prev, [dateStr]: next }))
    }
    setSaving(null)
  }

  const prevMonth = () => { if (month === 0) { setYear(y => y-1); setMonth(11) } else setMonth(m => m-1) }
  const nextMonth = () => { if (month === 11) { setYear(y => y+1); setMonth(0) } else setMonth(m => m+1) }

  const todayStr = new Date().toISOString().split('T')[0]
  const totalDays = daysInMonth(year, month)
  const startOffset = firstDayOfMonth(year, month)
  const monthLabel = new Date(year, month, 1)
    .toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })

  // Count by estado
  const counts = Object.values(data).reduce((acc, e) => {
    acc[e] = (acc[e] ?? 0) + 1; return acc
  }, {})

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-cinzel text-[0.65rem] tracking-[0.35em] text-dourado uppercase mb-1">— Disponibilidade —</p>
        <h1 className="font-playfair text-3xl text-creme">Calendário</h1>
        <div className="w-10 h-[2px] bg-dourado mt-3" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-7">
        {ESTADOS.map(e => (
          <div key={e} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${CORES[e].dot}`} />
            <span className="font-cinzel text-[0.6rem] tracking-[0.15em] text-creme/60 uppercase">
              {e} {counts[e] ? `(${counts[e]})` : ''}
            </span>
          </div>
        ))}
        <span className="font-cinzel text-[0.6rem] tracking-[0.15em] text-creme/30 uppercase ml-auto">
          Clica para alternar
        </span>
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth}
          className="p-2 border border-dourado/20 text-creme/60 hover:text-dourado
                     hover:border-dourado/50 transition-all">
          <ChevronLeft size={16} />
        </button>
        <h2 className="font-playfair text-xl text-creme capitalize">{monthLabel}</h2>
        <button onClick={nextMonth}
          className="p-2 border border-dourado/20 text-creme/60 hover:text-dourado
                     hover:border-dourado/50 transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="border border-dourado/15">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-dourado/15">
          {DIAS_SEMANA.map(d => (
            <div key={d} className="py-2 text-center font-cinzel text-[0.58rem] tracking-[0.15em]
                                    text-dourado/60 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Empty offset cells */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`e-${i}`} className="aspect-square border-r border-b border-dourado/8 bg-fundo/20" />
          ))}

          {/* Day cells */}
          {Array.from({ length: totalDays }, (_, i) => {
            const day     = i + 1
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
            const estado  = data[dateStr] ?? 'Disponível'
            const cores   = CORES[estado]
            const isToday = dateStr === todayStr
            const isPast  = dateStr < todayStr
            const isSaving= saving === dateStr

            return (
              <button
                key={day}
                onClick={() => !isPast && clickDay(dateStr)}
                disabled={isPast || isSaving}
                title={`${dateStr} — ${estado}`}
                className={`aspect-square relative border-r border-b border-dourado/8 p-1
                            flex flex-col items-center justify-center gap-1
                            transition-all duration-200 group
                            ${isPast ? 'cursor-default opacity-30' : 'cursor-pointer hover:ring-1 hover:ring-dourado/30'}
                            ${!isPast && estado !== 'Disponível' ? cores.bg : ''}`}
              >
                {isSaving && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-dourado border-t-transparent rounded-full animate-spin" />
                  </span>
                )}
                <span className={`font-cinzel text-sm leading-none z-10
                                  ${isToday ? 'text-dourado font-bold' : isPast ? 'text-creme/30' : 'text-creme/80'}`}>
                  {day}
                </span>
                {!isPast && estado !== 'Disponível' && (
                  <span className={`text-[0.45rem] font-cinzel tracking-[0.05em] uppercase ${cores.text} leading-none z-10`}>
                    {cores.label}
                  </span>
                )}
                {isToday && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-dourado" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <p className="mt-4 font-cinzel text-[0.58rem] tracking-[0.15em] text-creme/25 uppercase text-center">
        Disponível → Lotado → Fechado → Disponível
      </p>
    </div>
  )
}
