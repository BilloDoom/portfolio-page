import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, Suspense } from 'react'
import PROJECTS from '../data/Projects'
import './Projects.css'
import Tesseract from '../Tesseract.jsx'

function PanelSlot({ project, isActive, zIndex }) {
  const [Panel, setPanel] = useState(null)
  const [state, setState] = useState('closed') // closed | opening | open | closing

  useEffect(() => {
    if (isActive) {
      if (!Panel) {
        project.component().then(m => {
          setPanel(() => m.default)
          requestAnimationFrame(() => setState('opening'))
          setTimeout(() => setState('open'), 4000)
        })
      } else {
        setState('opening')
        setTimeout(() => setState('open'), 4000)
      }
    } else {
      if (state === 'open' || state === 'opening') {
        setState('closing')
        setTimeout(() => setState('closed'), 4000)
      }
    }
  }, [isActive])

  if (state === 'closed' && !isActive) return null

  return (
    <div
      className={`panel-slot panel-slot--${state}`}
      style={{ zIndex }}
    >
      <Suspense fallback={<p className="panel-loading">Loading...</p>}>
        {Panel && <Panel />}
      </Suspense>
    </div>
  )
}

export default function Projects() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentId = location.pathname.split('/projects/')[1] || null

  return (
    <div className="projects-page">
      <Tesseract />

      <nav className="projects-nav">
        <ul>
          {PROJECTS.map((p, i) => {
            const isActive = p.id === currentId
            return (
              <li
                key={p.id}
                className={`projects-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(isActive ? '/projects' : `/projects/${p.id}`)}
              >
                <span className="nav-title">{p.title}</span>
              </li>
            )
          })}
        </ul>
      </nav>

      <main className="projects-content">
        {!currentId && (
          <p className="projects-hint">← Select a project</p>
        )}
        {PROJECTS.map((p, i) => (
          <PanelSlot
            key={p.id}
            project={p}
            isActive={p.id === currentId}
            zIndex={p.id === currentId ? 10 : 5}
          />
        ))}
      </main>
    </div>
  )
}