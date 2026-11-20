import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Landing from '../pages/Landing'
import { Login, Register } from '../pages/Auth'
import Dashboard from '../pages/Dashboard'
import Accounts from '../pages/Accounts'
import Beneficiaries from '../pages/Beneficiaries'
import Transfer from '../pages/Transfer'
import Transactions from '../pages/Transactions'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'
import { AdminDashboard, AdminCustomers, AdminAccounts, AdminTransactions, AdminAudit } from '../pages/Admin'
import NotFound from '../pages/NotFound'

export default function AppRoutes(){
 return <AuthProvider><Routes>
  <Route path="/" element={<Landing/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
  <Route element={<ProtectedRoute/>}><Route element={<DashboardLayout/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/accounts" element={<Accounts/>}/><Route path="/beneficiaries" element={<Beneficiaries/>}/><Route path="/transfer" element={<Transfer/>}/><Route path="/transactions" element={<Transactions/>}/><Route path="/notifications" element={<Notifications/>}/><Route path="/profile" element={<Profile/>}/></Route></Route>
  <Route element={<ProtectedRoute role="ADMIN"/>}><Route element={<DashboardLayout admin/>}><Route path="/admin/dashboard" element={<AdminDashboard/>}/><Route path="/admin/customers" element={<AdminCustomers/>}/><Route path="/admin/accounts" element={<AdminAccounts/>}/><Route path="/admin/transactions" element={<AdminTransactions/>}/><Route path="/admin/audit" element={<AdminAudit/>}/></Route></Route>
  <Route path="*" element={<NotFound/>}/>
 </Routes></AuthProvider>
}
