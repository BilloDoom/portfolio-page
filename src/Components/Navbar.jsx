import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Navbar.css'
import lightbulbOn from '../assets/lightbulb.svg'
import lightbulbOff from '../assets/lightbulb-off.svg'
//        <Link to="/" className={pathname === '/' ? 'active' : ''}>Home</Link>
export default function Navbar() {
  const { pathname } = useLocation()
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">BilloDoom</Link>
      <nav className="navbar-links">

        <Link to="/projects" className={pathname.startsWith('/projects') ? 'active' : ''}>Projects</Link>
        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
          <img
            src={theme === 'dark' ? lightbulbOff : lightbulbOn}
            alt={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          />
        </button>
      </nav>
    </header>
  )
}