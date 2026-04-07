import { useEffect, useState } from 'react'
import { Copy, Save, Plus, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const today = new Date().toISOString().split('T')[0]
const yesterday = (() => { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0] })()

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none
                ${checked ? 'bg-dourado' : 'bg-creme/15'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300
                      ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
)

export default function PratosDodia() {
  const [rows,    setRows]    = useState([])   // { pdd_id, prato_id, nome, preco, ativo, dirty }
  const [pratos,  setPratos]  = useState([])   // all pratos for the "add" dropdown
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState('')
  const [addSel,  setAddSel]  = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const [pddRes, pratosRes] = await Promise.all([
      supabase.from('pratos_do_dia').select('id, ativo, prato_id, pratos(nome, preco)').eq('data', today),
      supabase.from('pratos').select('id, nome, preco, ativo').eq('ativo', true).order('ordem'),
    ])
    if (pddRes.error || pratosRes.error) {
      setMsg('Erro ao carregar dados.')
      setLoading(false); return
    }
    setRows(pddRes.data?.map(p => ({
      pdd_id:   p.id,
      prato_id: p.prato_id,
      nome:     p.pratos?.nome ?? '—',
      preco:    p.pratos?.preco ?? 0,
      ativo:    p.ativo,
      dirty:    false,
    })) ?? [])
    setPratos(pratosRes.data ?? [])
    setLoading(false)
  }

  const copiarOntem = async () => {
    const { data: ontem, error } = await supabase
      .from('pratos_do_dia')
      .select('prato_id, pratos(nome, preco)')
      .eq('data', yesterday)
    if (error) { setMsg('Erro ao copiar de ontem.'); return }
    if (!ontem?.length) { setMsg('Nenhum prato registado ontem.'); return }

    await supabase.from('pratos_do_dia').delete().eq('data', today)
    const { error: insErr } = await supabase.from('pratos_do_dia')
      .insert(ontem.map(p => ({ prato_id: p.prato_id, data: today, ativo: true })))
    if (insErr) { setMsg('Erro ao inserir pratos.'); return }
    setMsg('Copiado de ontem!'); load()
  }

  const toggleAtivo = (pdd_id, val) => {
    setRows(prev => prev.map(r => r.pdd_id === pdd_id ? { ...r, ativo: val, dirty: true } : r))
  }

  const editPreco = (pdd_id, val) => {
    setRows(prev => prev.map(r => r.pdd_id === pdd_id ? { ...r, preco: val, dirty: true } : r))
  }

  const saveAll = async () => {
    setSaving(true)
    const dirty = rows.filter(r => r.dirty)
    const results = await Promise.all([
      ...dirty.map(r => supabase.from('pratos_do_dia').update({ ativo: r.ativo }).eq('id', r.pdd_id)),
      ...dirty.map(r => supabase.from('pratos').update({ preco: parseFloat(r.preco) }).eq('id', r.prato_id)),
    ])
    const hasError = results.some(r => r.error)
    setSaving(false)
    if (hasError) { setMsg('Erro ao guardar algumas alterações.'); return }
    setRows(prev => prev.map(r => ({ ...r, dirty: false })))
    setMsg('Guardado!')
  }

  const removeRow = async (pdd_id) => {
    const { error } = await supabase.from('pratos_do_dia').delete().eq('id', pdd_id)
    if (error) { setMsg('Erro ao remover prato.'); return }
    setRows(prev => prev.filter(r => r.pdd_id !== pdd_id))
  }

  const addPrato = async () => {
    if (!addSel) return
    const prato = pratos.find(p => p.id === addSel)
    if (!prato) return
    const { data, error } = await supabase
      .from('pratos_do_dia')
      .upsert({ prato_id: addSel, data: today, ativo: true }, { onConflict: 'prato_id,data' })
      .select('id, ativo, prato_id')
      .single()
    if (error) { setMsg('Erro ao adicionar prato.'); return }
    if (data) {
      setRows(prev => [...prev, { pdd_id: data.id, prato_id: prato.id, nome: prato.nome, preco: prato.preco, ativo: true, dirty: false }])
    }
    setAddSel('')
  }

  // auto-dismiss message
  useEffect(() => { if (msg) { const t = setTimeout(() => setMsg(''), 3000); return () => clearTimeout(t) } }, [msg])

  const dateLabel = new Date(today + 'T12:00:00')
    .toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-cinzel text-[0.65rem] tracking-[0.35em] text-dourado uppercase mb-1">— Hoje —</p>
          <h1 className="font-playfair text-3xl text-creme capitalize">{dateLabel}</h1>
          <div className="w-10 h-[2px] bg-dourado mt-3" />
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={copiarOntem}
            className="flex items-center gap-2 px-4 py-2.5 border border-dourado/30
                       text-creme/70 hover:text-dourado hover:border-dourado
                       font-cinzel text-[0.62rem] tracking-[0.15em] uppercase transition-all duration-200"
          >
            <Copy size={13} /> Copiar de ontem
          </button>
          <button
            onClick={saveAll}
            disabled={saving || !rows.some(r => r.dirty)}
            className="flex items-center gap-2 px-4 py-2.5 bg-dourado text-fundo
                       font-cinzel text-[0.62rem] tracking-[0.15em] uppercase font-bold
                       hover:bg-douradoPale disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors duration-200"
          >
            {saving
              ? <span className="w-4 h-4 border-2 border-fundo border-t-transparent rounded-full animate-spin" />
              : <Save size={13} />
            }
            Guardar
          </button>
        </div>
      </div>

      {/* Toast */}
      {msg && (
        <div className="mb-5 px-5 py-3 border border-dourado/40 bg-castanho font-cinzel
                        text-[0.65rem] tracking-[0.15em] text-dourado uppercase">
          {msg}
        </div>
      )}

      {/* Add prato */}
      <div className="flex gap-3 mb-6">
        <select
          value={addSel}
          onChange={e => setAddSel(e.target.value)}
          className="flex-1 px-3 py-2.5 bg-castanho border border-dourado/25 text-creme
                     font-lora text-sm outline-none focus:border-dourado/60"
        >
          <option value="">Adicionar prato ao dia...</option>
          {pratos
            .filter(p => !rows.find(r => r.prato_id === p.id))
            .map(p => <option key={p.id} value={p.id}>{p.nome} — {p.preco}€</option>)
          }
        </select>
        <button
          onClick={addPrato}
          disabled={!addSel}
          className="flex items-center gap-2 px-4 py-2.5 bg-castanho border border-dourado/30
                     text-dourado hover:bg-dourado hover:text-fundo
                     font-cinzel text-[0.62rem] tracking-[0.15em] uppercase
                     disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Plus size={14} /> Adicionar
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-7 h-7 border-2 border-dourado border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="py-16 text-center border border-dourado/15">
          <p className="font-lora italic text-creme/35">Nenhum prato para hoje.</p>
          <p className="font-cinzel text-[0.6rem] tracking-widest text-creme/25 uppercase mt-2">
            Adiciona acima ou copia de ontem
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map(r => (
            <div
              key={r.pdd_id}
              className={`flex items-center gap-4 px-5 py-4 border transition-all duration-200
                          ${r.dirty ? 'border-dourado/50 bg-dourado/5' : 'border-dourado/15 bg-castanho'}`}
            >
              {/* Toggle */}
              <Toggle checked={r.ativo} onChange={val => toggleAtivo(r.pdd_id, val)} />

              {/* Name */}
              <span className={`flex-1 font-playfair text-lg transition-colors duration-200
                                ${r.ativo ? 'text-creme' : 'text-creme/35 line-through'}`}>
                {r.nome}
              </span>

              {/* Price */}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={r.preco}
                  onChange={e => editPreco(r.pdd_id, e.target.value)}
                  className="w-20 px-2 py-1 bg-fundo/50 border-b border-dourado/30
                             text-dourado font-cinzel text-sm text-right
                             outline-none focus:border-dourado"
                />
                <span className="font-cinzel text-[0.65rem] text-dourado/60">€</span>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeRow(r.pdd_id)}
                className="text-creme/25 hover:text-vinho transition-colors p-1"
                title="Remover"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
