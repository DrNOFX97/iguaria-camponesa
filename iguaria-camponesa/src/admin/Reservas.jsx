import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ESTADOS = ['Todos', 'Pendente', 'Confirmada', 'Cancelada']

const badgeCls = {
  Pendente:   'bg-dourado/15 text-dourado border border-dourado/30',
  Confirmada: 'bg-[#3a7d44]/20 text-[#6dbf7e] border border-[#6dbf7e]/30',
  Cancelada:  'bg-vinho/20 text-[#c47070] border border-vinho/30',
}

export default function AdminReservas() {
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [filtData, setFiltData] = useState('')
  const [filtEst,  setFiltEst]  = useState('Todos')
  const [search,   setSearch]   = useState('')

  useEffect(() => { loadReservas() }, [])

  const loadReservas = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reservas')
      .select('*')
      .order('data', { ascending: false })
      .order('hora', { ascending: true })
    setRows(data ?? [])
    setLoading(false)
  }

  const updateEstado = async (id, estado) => {
    await supabase.from('reservas').update({ estado }).eq('id', id)
    setRows(prev => prev.map(r => r.id === id ? { ...r, estado } : r))
  }

  const filtered = rows.filter(r => {
    const matchData = !filtData || r.data === filtData
    const matchEst  = filtEst === 'Todos' || r.estado === filtEst
    const matchSrch = !search  ||
      r.nome?.toLowerCase().includes(search.toLowerCase()) ||
      r.telefone?.includes(search)
    return matchData && matchEst && matchSrch
  })

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-cinzel text-[0.65rem] tracking-[0.35em] text-dourado uppercase mb-1">— Gestão —</p>
        <h1 className="font-playfair text-3xl text-creme">Reservas</h1>
        <div className="w-10 h-[2px] bg-dourado mt-3" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-creme/40" />
          <input
            type="text"
            placeholder="Nome ou telefone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-castanho border border-dourado/25 text-creme
                       font-lora text-sm outline-none focus:border-dourado/60
                       placeholder:text-creme/30 w-48"
          />
        </div>

        {/* Date */}
        <input
          type="date"
          value={filtData}
          onChange={e => setFiltData(e.target.value)}
          className="px-3 py-2 bg-castanho border border-dourado/25 text-creme
                     font-lora text-sm outline-none focus:border-dourado/60
                     [color-scheme:dark]"
        />

        {/* Estado pills */}
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map(e => (
            <button
              key={e}
              onClick={() => setFiltEst(e)}
              className={`px-3 py-1.5 font-cinzel text-[0.6rem] tracking-[0.15em] uppercase
                          border transition-all duration-200
                          ${filtEst === e
                            ? 'bg-dourado text-fundo border-dourado'
                            : 'border-dourado/25 text-creme/50 hover:border-dourado/50 hover:text-creme/80'}`}
            >
              {e}
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          onClick={loadReservas}
          className="ml-auto flex items-center gap-2 px-3 py-2 border border-dourado/20
                     text-creme/50 hover:text-dourado hover:border-dourado/50
                     font-cinzel text-[0.6rem] tracking-widest uppercase transition-all duration-200"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Count */}
      <p className="font-cinzel text-[0.6rem] tracking-[0.2em] text-creme/40 uppercase mb-4">
        {filtered.length} reserva{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Table */}
      <div className="overflow-x-auto border border-dourado/15">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-dourado/20 bg-castanho">
              {['Nome','Data','Hora','Pessoas','Notas','Estado','Ações'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-cinzel text-[0.6rem]
                                       tracking-[0.18em] text-dourado uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="text-center py-12">
                <div className="w-6 h-6 border-2 border-dourado border-t-transparent rounded-full animate-spin mx-auto" />
              </td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 font-lora italic text-creme/30">
                Nenhuma reserva encontrada
              </td></tr>
            )}
            {!loading && filtered.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-dourado/10 hover:bg-dourado/5 transition-colors
                            ${i % 2 === 0 ? '' : 'bg-fundo/30'}`}
              >
                <td className="px-4 py-3 font-lora text-sm text-creme">
                  <span className="font-semibold">{r.nome}</span>
                  {r.telefone && <span className="block text-[0.78rem] text-creme/50">{r.telefone}</span>}
                </td>
                <td className="px-4 py-3 font-cinzel text-[0.7rem] text-creme/80">
                  {new Date(r.data + 'T12:00:00').toLocaleDateString('pt-PT', {
                    weekday:'short', day:'numeric', month:'short'
                  })}
                </td>
                <td className="px-4 py-3 font-lora text-sm text-creme/80">{r.hora}</td>
                <td className="px-4 py-3 font-lora text-sm text-creme/80">{r.pessoas}</td>
                <td className="px-4 py-3 font-lora text-[0.8rem] text-creme/50 max-w-[160px] truncate" title={r.notas}>
                  {r.notas || '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2.5 py-1 font-cinzel text-[0.55rem] tracking-[0.15em] uppercase rounded-sm ${badgeCls[r.estado]}`}>
                    {r.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {r.estado !== 'Confirmada' && (
                      <button
                        onClick={() => updateEstado(r.id, 'Confirmada')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#3a7d44]/20 border border-[#6dbf7e]/30
                                   text-[#6dbf7e] font-cinzel text-[0.55rem] tracking-widest uppercase
                                   hover:bg-[#3a7d44]/40 transition-colors"
                        title="Confirmar"
                      >
                        <CheckCircle size={12} /> Confirmar
                      </button>
                    )}
                    {r.estado !== 'Cancelada' && (
                      <button
                        onClick={() => updateEstado(r.id, 'Cancelada')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-vinho/20 border border-vinho/30
                                   text-[#c47070] font-cinzel text-[0.55rem] tracking-widest uppercase
                                   hover:bg-vinho/30 transition-colors"
                        title="Cancelar"
                      >
                        <XCircle size={12} /> Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
