import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return <div className="min-h-screen bg-white text-slate-900">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-white"><WalletCards size={20}/></span><span className="text-xl font-bold">BankEase</span></Link>
      <div className="flex gap-3"><Link className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700" to="/login">Sign in</Link><Link className="rounded-xl bg-blue px-4 py-2 text-sm font-semibold text-white" to="/register">Open account</Link></div>
    </header>
    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div><span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"><Sparkles size={15}/>Next-generation banking</span><h1 className="mt-6 max-w-xl text-5xl font-bold leading-tight tracking-tight lg:text-6xl">Banking made simple, secure, and fast.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">Manage accounts, beneficiaries, transfers, and activity in one thoughtfully designed simulation.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-blue px-5 py-3 font-semibold text-white">Get started <ArrowRight size={18}/></Link><Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold">Sign in</Link></div></div>
        <div className="relative rounded-[2rem] bg-navy p-6 text-white shadow-2xl lg:p-10"><div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-blue/30 blur-2xl"/><div className="relative rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"><div className="flex justify-between"><span className="text-sm text-slate-300">Total balance</span><WalletCards/></div></div></div>
      </section>
      <section className="bg-slate-50 py-16"><div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3"><Feature icon={WalletCards} title="Every account in one place"/><Feature icon={ShieldCheck} title="Protected transfers"/><Feature icon={LockKeyhole} title="Secure authentication"/></div></section>
    </main>
  </div>
}

function Feature({ icon: Icon, title }) { return <div className="rounded-2xl border border-slate-200 bg-white p-6"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={20}/></span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm text-slate-500">A clear, reliable experience designed for everyday banking.</p></div> }
