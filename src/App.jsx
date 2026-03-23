import './App.css'
import Tesseract from './Tesseract'

function App() {
  return (
    <>
      <Tesseract />
      {/* HERO */}
      <section id="hero">
        <div className="hero-text">
          <p className="hero-tag">Graphics Programmer & Developer</p>
          <h1>Your Name</h1>
          <p className="hero-sub">
            I build real-time rendering systems, games, and tools.
            Passionate about low-level graphics, Vulkan, and pushing pixels.
          </p>
          <div className="hero-links">
            <a href="https://github.com/yourusername" target="_blank" className="btn">GitHub</a>
            <a href="#contact" className="btn btn-outline">Contact</a>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section id="projects">
        <h2>Projects</h2>
        <div className="projects-grid">
          <div className="card">
            <h3>Voxel Renderer</h3>
            <p>Minecraft-style voxel engine built with Vulkan. Focused on real-time rendering performance.</p>
            <span className="tag">Vulkan</span>
            <span className="tag">C++</span>
          </div>
          <div className="card">
            <h3>Algorithm Visualizer</h3>
            <p>Final project — visualizes user-written algorithms in real time using Godot with Python scripting.</p>
            <span className="tag">Godot</span>
            <span className="tag">Python</span>
          </div>
          <div className="card">
            <h3>Game Projects</h3>
            <p>Multiple game projects including two team-developed games and one solo project.</p>
            <span className="tag">Game Dev</span>
            <span className="tag">C++</span>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <footer id="contact">
        <h2>Contact</h2>
        <p>Open to opportunities — feel free to reach out.</p>
        <div className="contact-links">
          <a href="mailto:you@email.com">you@email.com</a>
          <a href="https://github.com/yourusername" target="_blank">GitHub</a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank">LinkedIn</a>
        </div>
        <p className="footer-note">© 2026 Your Name</p>
      </footer>
    </>
  )
}

export default App