import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { accountService } from '../services/accountService'
import { errorMessage } from '../services/api'
import { Card, EmptyState, Loading, PageTitle, StatusBadge } from '../components/UI'
import { money } from '../utils/format'

export default function Accounts(){
 const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [show,setShow]=useState(false); const [type,setType]=useState('SAVINGS'); const [saving,setSaving]=useState(false)
 const load=()=>{setLoading(true);accountService.list().then(setItems).finally(()=>setLoading(false))}
 useEffect(load,[])
 const create=async(e)=>{e.preventDefault();setSaving(true);try{await accountService.create({account_type:type});toast.success('Account created');setShow(false);load()}catch(err){toast.error(errorMessage(err,'Could not create account'))}finally{setSaving(false)}}
 return <><PageTitle title="Accounts" subtitle="View balances and account status." action={<button onClick={()=>setShow(true)} className="primary-button"><Plus size={17}/>New account</button>}/>{loading?<Loading/>:items.length?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map(a=><Card key={a.id} className="p-6"><div className="flex justify-between"><span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue">{a.account_type}</span><StatusBadge status={a.status}/></div><div className="mt-8 text-sm text-slate-500">Available balance</div><div className="mt-1 text-3xl font-bold">{money(a.balance)}</div><div className="mt-7 border-t pt-4 text-sm text-slate-500">Account number<div className="mt-1 font-mono font-semibold text-slate-800">{a.account_number}</div></div></Card>)}</div>:<Card><EmptyState title="No accounts" message="Create your first BankEase account."/></Card>}
 {show&&<div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5"><Card className="w-full max-w-md p-6"><h2 className="text-xl font-bold">Create account</h2><form onSubmit={create} className="mt-5"><label className="block text-sm font-semibold">Account type<select className="input mt-1" value={type} onChange={e=>setType(e.target.value)}><option value="SAVINGS">Savings</option><option value="CURRENT">Current</option></select></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={()=>setShow(false)} className="secondary-button">Cancel</button><button disabled={saving} className="primary-button">{saving?'Creating...':'Create'}</button></div></form></Card></div>}
 </>
}
