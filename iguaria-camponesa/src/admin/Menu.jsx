import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CATS = ['Entradas', 'Carnes', 'Peixes', 'Sobremesas', 'Bebidas']

const EMPTY = { nome: '', descricao: '', preco: '', categoria: 'Carnes', ativo: true, ordem: 0 }

const Toggle = ({ checked, onChange }) => (
  <button type="button" onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                ${checked ? 'bg-dourado' : 'bg-creme/15'}`}>
    <span className={`h-3 w-3 rounded-full bg-white shadow transform transition-transform
                      ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
  </button>
)

function PratoModal({ prato, cats, onSave, onClose }) {
  const [form, setForm] = useState(prato ?? { ...EMPTY })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const [submitErro, setSubmitErro] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setSubmitErro('')
    const payload = {
      nome: form.nome, descricao: form.descricao,
      preco: parseFloat(form.preco) || 0,
      categoria: form.categoria, ativo: form.ativo, ordem: form.ordem,
    }
    const { error } = form.id
      ? await supabase.from('pratos').update(payload).eq('id', form.id)
      : await supabase.from('pratos').insert([payload])
    setSaving(false)
    if (error) { setSubmitErro('Erro ao guardar. Tente novamente.'); return }
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg bg-fundo border border-dourado/30 p-7 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-creme/40 hover:text-creme">
          <X size={18} />
        </button>

        <h2 className="font-playfair text-xl text-creme mb-6">
          {form.id ? 'Editar prato' : 'Novo prato'}
        </h2>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="font-cinzel text-[0.6rem] tracking-[0.18em] text-dourado uppercase">Nome *</label>
              <input value={form.nome} onChange={e => set('nome', e.target.value)}
                required className="input-ardosia" placeholder="Nome do prato" />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="font-cinzel text-[0.6rem] tracking-[0.18em] text-dourado uppercase">Descrição</label>
              <textarea rows={2} value={form.descricao} onChange={e => set('descricao', e.target.value)}
                className="input-ardosia resize-none" placeholder="Descrição breve..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-cinzel text-[0.6rem] tracking-[0.18em] text-dourado uppercase">Preço (€)</label>
              <input type="number" step="0.5" min="0" value={form.preco} onChange={e => set('preco', e.target.value)}
                className="input-ardosia" placeholder="0.00" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-cinzel text-[0.6rem] tracking-[0.18em] text-dourado uppercase">Categoria</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)}
                className="input-ardosia">
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-cinzel text-[0.6rem] tracking-[0.18em] text-dourado uppercase">Ordem</label>
              <input type="number" min="0" value={form.ordem} onChange={e => set('ordem', parseInt(e.target.value)||0)}
                className="input-ardosia" />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <Toggle checked={form.ativo} onChange={v => set('ativo', v)} />
              <span className="font-cinzel text-[0.62rem] tracking-widest text-creme/60 uppercase">
                {form.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
          </div>

          {submitErro && (
            <p className="font-lora italic text-[0.78rem] text-[#c47070]">{submitErro}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-dourado/20 text-creme/50
                         font-cinzel text-[0.62rem] tracking-widest uppercase
                         hover:border-dourado/50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5
                         bg-dourado text-fundo font-cinzel text-[0.62rem] tracking-widest uppercase
                         hover:bg-douradoPale disabled:opacity-50 transition-colors">
              {saving
                ? <span className="w-4 h-4 border-2 border-fundo border-t-transparent rounded-full animate-spin" />
                : <><Check size={14} /> Guardar</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Menu() {
  const [pratos,  setPratos]  = useState([])
  const [cat,     setCat]     = useState('Carnes')
  const [modal,   setModal]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro,    setErro]    = useState('')
  const [confirm, setConfirm] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true); setErro('')
    const { data, error } = await supabase.from('pratos').select('*').order('categoria').order('ordem')
    if (error) setErro('Erro ao carregar menu.')
    setPratos(data ?? [])
    setLoading(false)
  }

  const deletePrato = async (id) => {
    const { error } = await supabase.from('pratos').delete().eq('id', id)
    if (error) { setErro('Erro ao eliminar prato.'); return }
    setPratos(prev => prev.filter(p => p.id !== id))
    setConfirm(null)
  }

  const toggleAtivo = async (id, val) => {
    const { error } = await supabase.from('pratos').update({ ativo: val }).eq('id', id)
    if (error) { setErro('Erro ao atualizar prato.'); return }
    setPratos(prev => prev.map(p => p.id === id ? { ...p, ativo: val } : p))
  }

  const filtered = pratos.filter(p => p.categoria === cat)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Modal */}
      {modal !== null && (
        <PratoModal
          prato={modal === 'new' ? null : modal}
          cats={CATS}
          onSave={() => { setModal(null); load() }}
          onClose={() => setModal(null)}
        />
      )}

      {/* Confirm delete */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-fundo border border-vinho/40 p-7 max-w-sm w-full">
            <p className="font-playfair text-lg text-creme mb-2">Eliminar prato?</p>
            <p className="font-lora italic text-sm text-creme/50 mb-6">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-2.5 border border-dourado/20 text-creme/50
                           font-cinzel text-[0.6rem] tracking-widest uppercase hover:border-dourado/50 transition-colors">
                Cancelar
              </button>
              <button onClick={() => deletePrato(confirm)}
                className="flex-1 py-2.5 bg-vinho text-creme font-cinzel text-[0.6rem]
                           tracking-widest uppercase hover:bg-vinho/80 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-cinzel text-[0.65rem] tracking-[0.35em] text-dourado uppercase mb-1">— Ementa —</p>
          <h1 className="font-playfair text-3xl text-creme">Menu</h1>
          <div className="w-10 h-[2px] bg-dourado mt-3" />
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 px-4 py-2.5 bg-dourado text-fundo
                     font-cinzel text-[0.62rem] tracking-[0.15em] uppercase font-bold
                     hover:bg-douradoPale transition-colors"
        >
          <Plus size={14} /> Novo Prato
        </button>
      </div>

      {erro && (
        <div className="mb-5 px-5 py-3 border border-vinho/40 bg-vinho/10 font-cinzel text-[0.65rem] tracking-[0.15em] text-[#c47070] uppercase">
          {erro}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap mb-7 border-b border-dourado/15 pb-0">
        {CATS.map(c => {
          const count = pratos.filter(p => p.categoria === c).length
          return (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2.5 font-cinzel text-[0.62rem] tracking-[0.15em] uppercase
                          border-b-2 transition-all duration-200 -mb-px
                          ${cat === c
                            ? 'border-dourado text-dourado'
                            : 'border-transparent text-creme/45 hover:text-creme/70'}`}>
              {c}
              <span className={`ml-2 text-[0.55rem] ${cat === c ? 'text-dourado/60' : 'text-creme/25'}`}>
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-7 h-7 border-2 border-dourado border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center border border-dourado/15">
          <p className="font-lora italic text-creme/35">Sem pratos em {cat}.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(p => (
            <div key={p.id}
              className={`flex items-center gap-4 px-5 py-3.5 border transition-colors
                          ${p.ativo ? 'border-dourado/18 bg-castanho' : 'border-creme/8 bg-fundo/30 opacity-60'}`}>
              <Toggle checked={p.ativo} onChange={v => toggleAtivo(p.id, v)} />
              <div className="flex-1 min-w-0">
                <p className="font-playfair text-base text-creme truncate">{p.nome}</p>
                {p.descricao && (
                  <p className="font-lora italic text-[0.78rem] text-creme/45 truncate">{p.descricao}</p>
                )}
              </div>
              <span className="font-cinzel text-sm text-dourado font-bold whitespace-nowrap">
                {p.preco != null ? `${Number(p.preco).toFixed(2)} €` : '—'}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setModal(p)}
                  className="p-1.5 text-creme/35 hover:text-dourado transition-colors" title="Editar">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setConfirm(p.id)}
                  className="p-1.5 text-creme/35 hover:text-vinho transition-colors" title="Eliminar">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
