import { useEffect, useRef } from 'react'
import './Tesseract.css'

const VERTICES_4D = []
for (let i = 0; i < 16; i++) {
  VERTICES_4D.push([
    i & 1 ? 1 : -1,
    i & 2 ? 1 : -1,
    i & 4 ? 1 : -1,
    i & 8 ? 1 : -1,
  ])
}

const EDGES = []
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    let diff = 0
    for (let k = 0; k < 4; k++) if (VERTICES_4D[i][k] !== VERTICES_4D[j][k]) diff++
    if (diff === 1) EDGES.push([i, j])
  }
}

function rotate4D(v, angleXW, angleYZ, angleXY) {
  let [x, y, z, w] = v

  // XW plane
  let cos = Math.cos(angleXW), sin = Math.sin(angleXW)
  ;[x, w] = [x * cos - w * sin, x * sin + w * cos]

  // YZ plane
  cos = Math.cos(angleYZ); sin = Math.sin(angleYZ)
  ;[y, z] = [y * cos - z * sin, y * sin + z * cos]

  // XY plane
  cos = Math.cos(angleXY); sin = Math.sin(angleXY)
  ;[x, y] = [x * cos - y * sin, x * sin + y * cos]

  return [x, y, z, w]
}

function project4Dto3D(v, w_dist = 2.5) {
  const [x, y, z, w] = v
  const s = 1 / (w_dist - w)
  return [x * s, y * s, z * s]
}

function project3Dto2D(v, z_dist = 3) {
  const [x, y, z] = v
  const s = 1 / (z_dist - z)
  return [x * s, y * s, s]
}

export default function Tesseract() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let t = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      t += 0.004

      const projected = VERTICES_4D.map(v => {
        const r4 = rotate4D(v, t * 0.7, t * 0.5, t * 0.3)
        const p3 = project4Dto3D(r4)
        const [px, py, depth] = project3Dto2D(p3)
        return {
          x: px * Math.min(width, height) * 0.3 + width / 2,
          y: py * Math.min(width, height) * 0.3 + height / 2,
          depth,
        }
      })

      EDGES.forEach(([a, b]) => {
        const pa = projected[a]
        const pb = projected[b]
        const avgDepth = (pa.depth + pb.depth) / 2
        const alpha = Math.min(1, Math.max(0.05, (avgDepth - 0.1) * 1.2))

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgba(170, 59, 255, ${alpha * 0.7})`
        ctx.lineWidth = alpha * 1.5
        ctx.stroke()
      })

      projected.forEach(({ x, y, depth }) => {
        const r = Math.max(1, depth * 3)
        const alpha = Math.min(1, (depth - 0.1) * 1.5)
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 130, 255, ${alpha})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="tesseract-canvas" />
}