import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Stub silencioso quando as variáveis não estão definidas (dev sem .env.local)
const noop  = () => Promise.resolve({ data: null, error: null, count: 0 })
const noopQ = () => ({ select: noopQ, insert: noopQ, update: noopQ, delete: noopQ, upsert: noopQ, eq: noopQ, neq: noopQ, gte: noopQ, lte: noopQ, order: noopQ, limit: noopQ, single: noop, then: (fn) => fn({ data: null, error: null, count: 0 }) })

const stub = {
  from:    () => noopQ(),
  storage: { from: () => ({ upload: noop, remove: noop, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  auth: {
    getSession:          () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange:   (cb) => { cb('INITIAL_SESSION', null); return { data: { subscription: { unsubscribe: () => {} } } } },
    signInWithPassword:  () => Promise.resolve({ error: { message: 'Supabase não configurado' } }),
    signOut:             () => Promise.resolve({}),
  },
}

export const supabase = (url && key)
  ? createClient(url, key)
  : (console.warn('[Supabase] .env.local não configurado — a correr em modo stub.'), stub)
