import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, Suspense, lazy } from 'react'
import PROJECTS from '../data/Projects'
import './Projects.css'

export default function Projects() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentId = location.pathname.split('/projects/')[1] || null
  const activeIndex = PROJECTS.findIndex(p => p.id === currentId)

  const [Panel, setPanel] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!currentId) {
      setPanel(null)
      setExpanded(false)
      return
    }
    const project = PROJECTS.find(p => p.id === currentId)
    if (!project) return
    setExpanded(false)
    project.component().then(m => {
      setPanel(() => m.default)
      requestAnimationFrame(() => setExpanded(true))
    })
  }, [currentId])

  return (
    <div className="projects-page">
      <Tesseract />

      {/* LEFT LIST */}
      <nav className="projects-nav">
        <a href="/" className="projects-nav-back">← Home</a>
        <ul>
          {PROJECTS.map((p, i) => (
            <li
              key={p.id}
              className={`projects-nav-item ${p.id === currentId ? 'active' : ''}`}
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <span className="nav-index">0{i + 1}</span>
              <span className="nav-title">{p.title}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* RIGHT PANEL */}
      <main className={`projects-content ${expanded ? 'expanded' : ''}`}>
        {activeIndex !== -1 && (
          <div
            className="projects-panel-wrapper"
            style={{ '--origin-index': activeIndex }}
          >
            <Suspense fallback={<p className="panel-loading">Loading...</p>}>
              {Panel && <Panel />}
            </Suspense>
          </div>
        )}
        {!currentId && (
          <p className="projects-hint">← Select a project</p>
        )}
      </main>
    </div>
  )
}