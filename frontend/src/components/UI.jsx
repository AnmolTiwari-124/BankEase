import { AlertCircle, LoaderCircle } from 'lucide-react'

export function PageTitle({ title, subtitle, action }) {
  return <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-bold text-slate-900">{title}</h1>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>{action}</div>
}

export function Card({ children, className = '' }) { return <section className={`rounded-2xl border border-slate-200 bg-white shadow-card ${className}`}>{children}</section> }

export function Loading({ label = 'Loading...' }) { return <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={18}/>{label}</div> }

export function ErrorState({ message, onRetry }) { return <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"><div className="flex items-center gap-2"><AlertCircle size={18}/><span>{message}</span></div>{onRetry && <button className="mt-3 font-semibold underline" onClick={onRetry}>Try again</button>}</div> }

export function EmptyState({ title, message }) { return <div className="py-12 text-center"><div className="text-lg font-semibold text-slate-700">{title}</div><p className="mt-1 text-sm text-slate-500">{message}</p></div> }

export function StatusBadge({ status }) {
  const ok = ['ACTIVE', 'COMPLETED', 'true', true].includes(status)
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{String(status).replace('_', ' ')}</span>
}
