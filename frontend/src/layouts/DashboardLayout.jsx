import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Bell, CreditCard, LayoutDashboard, LogOut, Menu, PiggyBank, ReceiptText, ShieldCheck, UserRound, Users, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notificationService } from '../services/notificationService'

export default function DashboardLayout({ admin = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!admin) notificationService.list().then(items => setUnread(items.filter(n => !n.is_read).length)).catch(() => {})
  }, [admin])

  const signOut = async () => { await logout(); navigate('/login') }
  const customerItems = [
    ['/dashboard', LayoutDashboard, 'Dashboard'], ['/accounts', PiggyBank, 'Accounts'], ['/beneficiaries', Users, 'Beneficiaries'],
    ['/transfer', CreditCard, 'Transfer'], ['/transactions', ReceiptText, 'Transactions'], ['/notifications', Bell, 'Notifications'], ['/profile', UserRound, 'Profile'],
  ]
  const adminItems = [
    ['/admin/dashboard', LayoutDashboard, 'Dashboard'], ['/admin/customers', Users, 'Customers'], ['/admin/accounts', PiggyBank, 'Accounts'],
    ['/admin/transactions', ReceiptText, 'Transactions'], ['/admin/audit', ShieldCheck, 'Audit Logs'],
  ]
  const items = admin ? adminItems : customerItems

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-navy text-white transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
          <button className="flex items-center gap-3" onClick={() => navigate(admin ? '/admin/dashboard' : '/dashboard')}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue"><PiggyBank size={21}/></span>
            <div className="text-left"><div className="font-bold text-lg">BankEase</div><div className="text-xs text-slate-400">NextGen Net Banking</div></div>
          </button>
          <button className="lg:hidden" onClick={() => setOpen(false)}><X size={20}/></button>
        </div>
        <nav className="p-4 space-y-1">
          {items.map(([to, Icon, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${isActive ? 'bg-blue text-white' : 'text-slate-300 hover:bg-white/10'}`}><Icon size={19}/>{label}{label === 'Notifications' && unread > 0 && <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs">{unread}</span>}</NavLink>)}
        </nav>
        <button onClick={signOut} className="absolute bottom-5 left-4 right-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/10"><LogOut size={19}/>Sign out</button>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b bg-white px-5 lg:px-8">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu/></button>
          <div className="hidden lg:block text-sm text-slate-500">Secure {admin ? 'Administration' : 'Customer'} Portal</div>
          <div className="ml-auto flex items-center gap-3"><div className="text-right"><div className="text-sm font-semibold text-slate-800">{user?.full_name}</div><div className="text-xs text-slate-500">{user?.role === 'ADMIN' ? 'Administrator' : 'Customer'}</div></div><div className="grid h-10 w-10 place-items-center rounded-full bg-blue text-sm font-bold text-white">{user?.full_name?.[0] || 'U'}</div></div>
        </header>
        <div className="p-5 lg:p-8"><Outlet/></div>
      </main>
    </div>
  )
}
