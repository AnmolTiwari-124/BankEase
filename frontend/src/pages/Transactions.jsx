import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { transactionService } from '../services/transactionService'
import { accountService } from '../services/accountService'
import { Card, EmptyState, Loading, PageTitle, StatusBadge } from '../components/UI'
import { dateTime, money } from '../utils/format'

export default function Transactions(){
 const [items,setItems]=useState([]); const [accounts,setAccounts]=useState([]); const [loading,setLoading]=useState(true); const [search,setSearch]=useState(''); const [category,setCategory]=useState('');
 const load=async()=>{setLoading(true);try{const [t,a]=await Promise.all([transactionService.list({search:search||undefined,category:category||undefined}),accountService.list()]);setItems(t.data);setAccounts(a)}finally{setLoading(false)}}
 useEffect(()=>{load()},[])
 const ownNumbers=new Set(accounts.map(a=>a.account_number))
 return <><PageTitle title="Transactions" subtitle="Search and review your transaction history."/><Card className="mb-5 p-4"><div className="grid gap-3 sm:grid-cols-[1fr_180px]"><input className="input" placeholder="Search reference or account" value={search} onChange={e=>setSearch(e.target.value)}/><select className="input" value={category} onChange={e=>setCategory(e.target.value)}><option value="">All types</option><option value="debit">Debits</option><option value="credit">Credits</option></select></div><button onClick={load} className="secondary-button mt-3">Search</button></Card><Card className="overflow-hidden">{loading?<Loading/>:items.length?<div className="divide-y">{items.map(t=>{const debit=ownNumbers.has(t.sender_account);return <div key={t.id} className="flex items-center justify-between gap-4 px-5 py-4"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-full ${debit?'bg-rose-50 text-rose-600':'bg-emerald-50 text-emerald-600'}`}>{debit?<ArrowUpRight size={18}/>:<ArrowDownLeft size={18}/>}</span><div><div className="font-semibold">{t.reference}</div><div className="mt-1 text-xs text-slate-500">{dateTime(t.created_at)} • {t.sender_account} → {t.receiver_account}</div></div></div><div className="text-right"><div className="font-bold">{debit?'−':'+'}{money(t.amount)}</div><div className="mt-1"><StatusBadge status={t.status}/></div></div></div>})}</div>:<EmptyState title="No transactions found" message="Try changing your search or filters."/>}</Card></>
}
