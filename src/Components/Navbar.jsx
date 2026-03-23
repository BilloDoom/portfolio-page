import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">BilloDoom</Link>
      <nav className="navbar-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/projects" className={pathname.startsWith('/projects') ? 'active' : ''}>Projects</Link>
      </nav>
    </header>
  )
}