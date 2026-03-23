import { useState } from 'react'
import Tesseract from '../Tesseract.jsx'
import '../App.css'
import PROJECTS from '../data/Projects.js'
import ProjectCard from '../projects/ProjectCard.jsx'
import TECH from '../data/Tech.js'
import AsciiName from '../Components/AsciiName.jsx'

const CATEGORIES = [
  { key: 'lang',      label: 'Languages' },
  { key: 'framework', label: 'Frameworks' },
  { key: 'engine',    label: 'Engines & Tools' },
]

export default function Home() {
  const [openId, setOpenId] = useState(null)

  return (
    <>
      <Tesseract />

      {/* HERO + TECH SIDE BY SIDE */}
      <section id="hero">
        <div className="hero-layout">

          {/* LEFT — hero text */}
          <div className="hero-text">
            <AsciiName text="BilloDoom" />
            <p className="hero-tag">Graphics Programmer & Developer</p>
            <h1>Filip Tudja</h1>
            <p className="hero-sub">
              I build real-time rendering systems, games, and tools.
              Passionate about low-level graphics, Vulkan, and making quirked up pixels bust it down.
            </p>
            <div className="hero-links">
              <a href="https://github.com/BilloDoom" target="_blank" className="btn">GitHub</a>
              <a href="#contact" className="btn btn-outline">Contact</a>
            </div>
            <a href="/projects" className="btn btn-projects">
              <span className="btn-projects-label">Projects</span>
              <span className="btn-projects-arrow">→</span>
            </a>
          </div>

          {/* RIGHT — tech */}
          <div className="hero-tech">
            {CATEGORIES.map(({ key, label }) => (
              <div className="tech-category" key={key}>
                <h3 className="tech-category-label">{label}</h3>
                <div className="tech-grid">
                  {TECH.filter(t => t.category === key).map(({ name, icon }) => (
                    <div className="tech-item" key={name}>
                      <i className={`${icon} colored`}></i>
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <h2>Projects</h2>
        <div className="projects-grid">
          {PROJECTS.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              openId={openId}
              onOpen={setOpenId}
            />
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <footer id="contact">
        <h2>Contact</h2>
        <p>Open to opportunities — feel free to reach out.</p>
        <div className="contact-links">
          <a href="mailto:ftudja554@gmail.com">ftudja554@gmail.com</a>
          <a href="https://github.com/BilloDoom" target="_blank">GitHub</a>
        </div>
        <p className="footer-note">© 2026 Filip Tudja</p>
      </footer>
    </>
  )
}