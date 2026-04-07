import { useEffect, useState, useRef } from 'react'
import { Upload, Star, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const BUCKET = 'galeria'

export default function Galeria() {
  const [fotos,    setFotos]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [uploading,setUploading]= useState(false)
  const [drag,     setDrag]     = useState(false)
  const [preview,  setPreview]  = useState(null)   // foto for fullscreen
  const [msg,      setMsg]      = useState('')
  const inputRef = useRef()

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('galeria')
      .select('*')
      .order('destaque', { ascending: false })
      .order('criado_em', { ascending: false })
    setFotos(data ?? [])
    setLoading(false)
  }

  const uploadFiles = async (files) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const ext  = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: '3600', upsert: false,
      })
      if (upErr) { setMsg(`Erro: ${upErr.message}`); continue }

      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
      await supabase.from('galeria').insert([{ url: publicUrl, storage_path: path, destaque: false, ordem: 0 }])
    }
    setUploading(false); setMsg('Upload concluído!'); load()
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false)
    uploadFiles(e.dataTransfer.files)
  }

  const toggleDestaque = async (id, val) => {
    await supabase.from('galeria').update({ destaque: val }).eq('id', id)
    setFotos(prev => prev.map(f => f.id === id ? { ...f, destaque: val } : f))
  }

  const removeFoto = async (foto) => {
    if (foto.storage_path) {
      await supabase.storage.from(BUCKET).remove([foto.storage_path])
    }
    await supabase.from('galeria').delete().eq('id', foto.id)
    setFotos(prev => prev.filter(f => f.id !== foto.id))
    if (preview?.id === foto.id) setPreview(null)
  }

  useEffect(() => { if (msg) { const t = setTimeout(() => setMsg(''), 3500); return () => clearTimeout(t) } }, [msg])

  const destaques = fotos.filter(f => f.destaque)
  const normais   = fotos.filter(f => !f.destaque)

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Fullscreen preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button className="absolute top-5 right-5 text-white/60 hover:text-white">
            <X size={28} />
          </button>
          <img src={preview.url} alt="" className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-cinzel text-[0.65rem] tracking-[0.35em] text-dourado uppercase mb-1">— Imagens —</p>
          <h1 className="font-playfair text-3xl text-creme">Galeria</h1>
          <div className="w-10 h-[2px] bg-dourado mt-3" />
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-dourado text-fundo
                     font-cinzel text-[0.62rem] tracking-[0.15em] uppercase font-bold
                     hover:bg-douradoPale disabled:opacity-50 transition-colors"
        >
          {uploading
            ? <span className="w-4 h-4 border-2 border-fundo border-t-transparent rounded-full animate-spin" />
            : <Upload size={14} />
          }
          Upload
        </button>
        <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
          onChange={e => uploadFiles(e.target.files)} />
      </div>

      {/* Toast */}
      {msg && (
        <div className="mb-5 px-5 py-3 border border-dourado/40 bg-castanho
                        font-cinzel text-[0.65rem] tracking-[0.15em] text-dourado uppercase">
          {msg}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-sm py-10 flex flex-col items-center gap-3 mb-8
                    cursor-pointer transition-all duration-300
                    ${drag ? 'border-dourado bg-dourado/10' : 'border-dourado/20 hover:border-dourado/50'}`}
      >
        <Upload size={28} className={drag ? 'text-dourado' : 'text-creme/25'} strokeWidth={1.5} />
        <p className="font-cinzel text-[0.65rem] tracking-[0.2em] uppercase text-creme/40">
          {drag ? 'Soltar aqui' : 'Arrastar imagens · ou clicar para selecionar'}
        </p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-7 h-7 border-2 border-dourado border-t-transparent rounded-full animate-spin" />
        </div>
      ) : fotos.length === 0 ? (
        <div className="py-16 text-center border border-dourado/15">
          <p className="font-lora italic text-creme/35">Sem imagens. Faz upload acima.</p>
        </div>
      ) : (
        <>
          {/* Destaques */}
          {destaques.length > 0 && (
            <div className="mb-8">
              <p className="font-cinzel text-[0.6rem] tracking-[0.25em] text-dourado uppercase mb-4 flex items-center gap-2">
                <Star size={12} fill="currentColor" /> Destaques ({destaques.length})
              </p>
              <Grid fotos={destaques} onPreview={setPreview} onToggle={toggleDestaque} onRemove={removeFoto} />
            </div>
          )}

          {/* Restantes */}
          {normais.length > 0 && (
            <div>
              {destaques.length > 0 && (
                <p className="font-cinzel text-[0.6rem] tracking-[0.25em] text-creme/35 uppercase mb-4">
                  Restantes ({normais.length})
                </p>
              )}
              <Grid fotos={normais} onPreview={setPreview} onToggle={toggleDestaque} onRemove={removeFoto} />
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Grid({ fotos, onPreview, onToggle, onRemove }) {
  const [confirm, setConfirm] = useState(null)
  return (
    <>
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-fundo border border-vinho/40 p-6 max-w-xs w-full">
            <p className="font-playfair text-lg text-creme mb-4">Remover imagem?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)}
                className="flex-1 py-2 border border-dourado/20 text-creme/50
                           font-cinzel text-[0.58rem] tracking-widest uppercase hover:border-dourado/50">
                Cancelar
              </button>
              <button onClick={() => { onRemove(confirm); setConfirm(null) }}
                className="flex-1 py-2 bg-vinho text-creme font-cinzel text-[0.58rem]
                           tracking-widest uppercase hover:bg-vinho/80">
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {fotos.map(foto => (
          <div key={foto.id} className="relative group aspect-square overflow-hidden border border-dourado/12">
            <img
              src={foto.url}
              alt=""
              className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-110"
              onClick={() => onPreview(foto)}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end justify-between p-2">
              <button
                onClick={() => onToggle(foto.id, !foto.destaque)}
                title={foto.destaque ? 'Remover destaque' : 'Marcar destaque'}
                className={`opacity-0 group-hover:opacity-100 p-1.5 transition-all duration-200
                            ${foto.destaque
                              ? 'text-dourado'
                              : 'text-white/70 hover:text-dourado'}`}
              >
                <Star size={16} fill={foto.destaque ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setConfirm(foto)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-white/70 hover:text-[#c47070] transition-all duration-200"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {foto.destaque && (
              <div className="absolute top-2 left-2">
                <Star size={14} fill="#C8892A" className="text-dourado drop-shadow" />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
