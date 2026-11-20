import { Link } from 'react-router-dom'

export default function NotFound(){return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><div><div className="text-6xl font-bold text-slate-200">404</div><h1 className="mt-4 text-2xl font-bold">Page not found</h1><Link className="primary-button mt-6 inline-flex" to="/">Go home</Link></div></div>}
