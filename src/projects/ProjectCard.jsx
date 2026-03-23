import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import './ProjectCard.css'

export default function ProjectCard({ project, openId, onOpen }) {
  const isOpen = openId === project.id
  const panelRef = useRef(null)
  const [Panel, setPanel] = useState(null)

  useEffect(() => {
    if (isOpen && !Panel) {
      project.component().then(m => setPanel(() => m.default))
    }
  }, [isOpen])

  return (
    <div className={`project-card ${isOpen ? 'open' : ''}`}>
      <div className="project-header" onClick={() => onOpen(isOpen ? null : project.id)}>
        <div className="project-header-left">
          <h3>{project.title}</h3>
          <p>{project.short}</p>
        </div>
        <div className="project-tags">
          {project.tags.map(t => <span className="tag" key={t}>{t}</span>)}
        </div>
        <span className="project-arrow">{isOpen ? '−' : '+'}</span>
      </div>

      <div className="project-panel" ref={panelRef} style={{ display: isOpen ? 'block' : 'none' }}>
        {isOpen && Panel && <Suspense fallback={<p>Loading...</p>}><Panel /></Suspense>}
      </div>
    </div>
  )
}