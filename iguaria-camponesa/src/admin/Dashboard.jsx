import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { supabase } from '../lib/supabase'

const PageHeader = ({ title, sub }) => (
  <div className="mb-8">
    <p className="font-cinzel text-[0.65rem] tracking-[0.35em] text-dourado uppercase mb-1">{sub}</p>
    <h1 className="font-playfair text-3xl text-creme">{title}</h1>
    <div className="w-10 h-[2px] bg-dourado mt-3" />
  </div>
)

const StatCard = ({ icon: Icon, label, value, sub, color = 'dourado' }) => (
  <div className="bg-castanho border border-dourado/20 p-6 relative overflow-hidden
                  hover:border-dourado/50 transition-colors duration-300">
    <div className="absolute top-0 left-0 right-0 h-[2px]"
      style={{ background: `linear-gradient(to right, transparent, #C8892A, transparent)` }} />
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 border border-dourado/30 flex items-center justify-center`}>
        <Icon size={18} className="text-dourado" strokeWidth={1.6} />
      </div>
    </div>
    <p className="font-cinzel text-[0.6rem] tracking-[0.2em] text-dourado/70 uppercase mb-1">{label}</p>
    <p className="font-playfair text-4xl text-creme mb-1">{value ?? '—'}</p>
    {sub && <p className="font-lora italic text-[0.8rem] text-creme/50">{sub}</p>}
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-castanho border border-dourado/40 px-4 py-3 text-sm">
      <p className="font-cinzel text-[0.6rem] tracking-widest text-dourado uppercase mb-1">{label}</p>
      <p className="font-playfair text-xl text-creme">{payload[0].value} reservas</p>
    </div>
  )
}

export default function Dashboard() {
  const [stats,   setStats]   = useState({ hoje: null, semana: null, proxima: null })
  const [chart,   setChart]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    const today  = new Date().toISOString().split('T')[0]
    const monday = (() => {
      const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().split('T')[0]
    })()
    const sunday = (() => {
      const d = new Date(monday); d.setDate(d.getDate() + 6); return d.toISOString().split('T')[0]
    })()

    const [resHoje, resSemana, resProxima, resChart] = await Promise.all([
      supabase.from('reservas').select('id', { count: 'exact' })
        .eq('data', today).neq('estado', 'Cancelada'),
      supabase.from('reservas').select('id', { count: 'exact' })
        .gte('data', monday).lte('data', sunday).neq('estado', 'Cancelada'),
      supabase.from('reservas').select('nome,data,hora,pessoas')
        .gte('data', today).neq('estado', 'Cancelada')
        .order('data', { ascending: true }).order('hora', { ascending: true }).limit(1),
      supabase.from('reservas').select('data')
        .gte('data', (() => { const d = new Date(); d.setDate(d.getDate()-13); return d.toISOString().split('T')[0] })())
        .lte('data', today).neq('estado', 'Cancelada'),
    ])

    // Build 14-day chart data
    const counts = {}
    resChart.data?.forEach(r => { counts[r.data] = (counts[r.data] ?? 0) + 1 })
    const chartData = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i))
      const key = d.toISOString().split('T')[0]
      return {
        data: d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }),
        total: counts[key] ?? 0,
      }
    })

    const proxima = resProxima.data?.[0]
    setStats({
      hoje:    resHoje.count ?? 0,
      semana:  resSemana.count ?? 0,
      proxima: proxima
        ? `${proxima.nome} · ${proxima.hora} · ${proxima.pessoas}`
        : 'Nenhuma prevista',
      proximaData: proxima
        ? new Date(proxima.data + 'T12:00:00').toLocaleDateString('pt-PT', { weekday:'short', day:'numeric', month:'short' })
        : null,
    })
    setChart(chartData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-7 h-7 border-2 border-dourado border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader title="Dashboard" sub="— Visão geral —" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard icon={CalendarCheck} label="Reservas hoje"    value={stats.hoje}   sub="confirmadas + pendentes" />
        <StatCard icon={Users}         label="Esta semana"      value={stats.semana} sub="seg – dom" />
        <StatCard icon={Clock}         label="Próxima reserva"  value={stats.proximaData ?? '—'} sub={stats.proxima} />
      </div>

      {/* Chart */}
      <div className="bg-castanho border border-dourado/20 p-6 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={18} className="text-dourado" strokeWidth={1.6} />
          <span className="font-cinzel text-[0.68rem] tracking-[0.2em] text-dourado uppercase">
            Reservas — últimos 14 dias
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chart} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(200,137,42,0.1)" />
            <XAxis
              dataKey="data"
              tick={{ fill: '#E8D5A3', fontSize: 11, fontFamily: 'Cinzel' }}
              tickLine={false} axisLine={{ stroke: 'rgba(200,137,42,0.2)' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#E8D5A3', fontSize: 11, fontFamily: 'Cinzel' }}
              tickLine={false} axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,137,42,0.07)' }} />
            <Bar dataKey="total" fill="#C8892A" radius={[3, 3, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { to: '/admin/reservas',     label: 'Ver reservas' },
          { to: '/admin/pratos-do-dia',label: 'Pratos do dia' },
          { to: '/admin/calendario',   label: 'Calendário' },
        ].map(({ to, label }) => (
          <Link key={to} to={to}
            className="flex items-center justify-between px-5 py-4
                       border border-dourado/20 text-creme/60
                       hover:border-dourado hover:text-dourado
                       font-cinzel text-[0.65rem] tracking-[0.15em] uppercase
                       transition-all duration-200 group"
          >
            {label}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  )
}
