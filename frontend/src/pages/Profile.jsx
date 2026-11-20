import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import { errorMessage } from '../services/api'
import { Card, PageTitle } from '../components/UI'

export default function Profile(){
 const {user,setUser}=useAuth(); const [form,setForm]=useState({full_name:'',phone:''}); const [password,setPassword]=useState({old_password:'',new_password:''});
 useEffect(()=>{setForm({full_name:user?.full_name||'',phone:user?.phone||''})},[user])
 const save=async(e)=>{e.prevent();try{const data=await authService.updateProfile(form);setUser(data);localStorage.setItem('bankease_user',JSON.stringify(data));toast.success('Profile updated')}catch(err){toast.error(errorMessage(err,'Could not update profile'))}}
 const change=async(e)=>{e.prevent();if(password.new_password.length<8){toast.error('New password must be at least 8 characters');return}try{await authService.changePassword(password);setPassword({old_password:'',new_password:''});toast.success('Password changed')}catch(err){toast.error(errorMessage(err,'Could not change password'))}}
 return <><PageTitle title="Profile" subtitle="Manage your personal and security details."/><div className="grid gap-5 lg:grid-cols-2"><Card className="p-6"><h2 className="text-lg font-bold">Personal details</h2><form onSubmit={save} className="mt-5 space-y-4"><label className="block text-sm font-semibold">Full name<input className="input mt-1" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})}/></label><label className="block text-sm font-semibold">Email<input className="input mt-1 bg-slate-50" value={user?.email||''} disabled/></label><label className="block text-sm font-semibold">Phone<input className="input mt-1" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><button className="primary-button">Save changes</button></form></Card><Card className="p-6"><h2 className="text-lg font-bold">Change password</h2><form onSubmit={change} className="mt-5 space-y-4"><label className="block text-sm font-semibold">Current password<input className="input mt-1" type="password" value={password.old_password} onChange={e=>setPassword({...password,old_password:e.target.value})}/></label><label className="block text-sm font-semibold">New password<input className="input mt-1" type="password" value={password.new_password} onChange={e=>setPassword({...password,new_password:e.target.value})}/></label><button className="primary-button">Update password</button></form></Card></div></>
}
