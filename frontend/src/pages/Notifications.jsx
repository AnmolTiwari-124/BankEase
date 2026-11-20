import { useEffect, useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { notificationService } from '../services/notificationService'
import { Card, EmptyState, Loading, PageTitle } from '../components/UI'
import { dateTime } from '../utils/format'

export default function Notifications(){
 const [items,setItems]=useState([]);const [loading,setLoading]=useState(true)
 const load=()=>notificationService.list().then(setItems).finally(()=>setLoading(false))
 useEffect(()=>{load()},[])
 const mark=async(id)=>{await notificationService.markRead(id);load()}
 const markAll=async()=>{await notificationService.markAllRead();toast.success('All notifications marked as read');load()}
 return <><PageTitle title="Notifications" subtitle="Updates about transfers and account activity." action={<button onClick={markAll} className="secondary-button"><CheckCheck size={17}/>Mark all read</button>}/><Card>{loading?<Loading/>:items.length?<div className="divide-y">{items.map(n=><button key={n.id} onClick={()=>mark(n.id)} className="flex w-full gap-4 px-5 py-5 text-left hover:bg-slate-50"><span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full ${n.is_read?'bg-slate-100 text-slate-400':'bg-blue-50 text-blue'}`}><Bell size={18}/></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div className="font-semibold">{n.title}</div>{!n.is_read&&<span className="mt-1 h-2 w-2 rounded-full bg-blue"/>}</div><p className="mt-1 text-sm text-slate-600">{n.message}</p><div className="mt-2 text-xs text-slate-400">{dateTime(n.created_at)}</div></div></button>)}</div>:<EmptyState title="You're all caught up" message="No notifications to show."/>}</Card></>
}
