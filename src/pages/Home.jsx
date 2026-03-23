import { useState } from 'react'
import Tesseract from '../Tesseract.jsx'
import '../App.css'
import PROJECTS from '../data/Projects.js'
import ProjectCard from '../projects/ProjectCard.jsx'
import TECH from '../data/Tech.js'

export default function Home() {
  const [openId, setOpenId] = useState(null)

  return (
    <>
      <a href="/projects" className="btn btn-outline">Projects</a>

      <Tesseract />
      {/* HERO */}
      <section id="hero">
        <div className="hero-text">
          <p className="hero-tag">Graphics Programmer & Developer</p>
          <h1>Filip Tudja</h1>
          <p className="hero-sub">
            I build real-time rendering systems, games, and tools.
            Passionate about low-level graphics, Vulkan, and pushing pixels.
          </p>
          <div className="hero-links">
            <a href="https://github.com/BilloDoom" target="_blank" className="btn">GitHub</a>
            <a href="#contact" className="btn btn-outline">Contact</a>
          </div>
        </div>
      </section>



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

      <section id="tech">
        <h2>Tech</h2>
          <div className="tech-grid">
            {TECH.map(({ name, icon }) => (
              <div className="tech-item" key={name}>
                <i className={`${icon} colored`}></i>
                <span>{name}</span>
              </div>
            ))}
          </div>
      </section>

      {/* CONTACT */}
      <footer id="contact">
        <h2>Contact</h2>
        <p>Open to opportunities — feel free to reach out.</p>
        <div className="contact-links">
          <a href="ftudja554@gmail.com">ftudja554@gmail.com</a>
          <a href="https://github.com/BilloDoom" target="_blank">GitHub</a>
        </div>
        <p className="footer-note">© 2026 Filip Tudja</p>
      </footer>
    </>
  )
}