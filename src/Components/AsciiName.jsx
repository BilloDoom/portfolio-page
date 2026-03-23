import { useEffect, useRef } from 'react'

//▄▀▌▐▖▗▘▙▚▛▜▝▞▟

const CHARS_DENSE = '█▓▒░'

const CHARS_LIGHT = '▒░▖▗▘▝:,. '

const CHARS_ALL   = '█▓▒░'
const FONT_URL = 'https://fonts.gstatic.com/s/spacemono/v13/i7dPIFZifjKcF5UAWdDRYEF8RQ.woff2'

function densityChar(t) {
  const i = Math.floor((1 - t) * (CHARS_DENSE.length - 1))
  return CHARS_DENSE[Math.max(0, Math.min(CHARS_DENSE.length - 1, i))]
}

function randomChar(set = CHARS_ALL) {
  return set[Math.floor(Math.random() * set.length)]
}

async function rasterizeText(text, fontSize, padding, canvasWidth) {
  const font = new FontFace('AsciiFont', `url(${FONT_URL})`)
  await font.load()
  document.fonts.add(font)

  const offscreen = document.createElement('canvas')
  offscreen.width = canvasWidth
  offscreen.height = fontSize + padding * 2
  const ctx = offscreen.getContext('2d')

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, offscreen.width, offscreen.height)
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${fontSize}px AsciiFont`
  ctx.textBaseline = 'top'

  const measured = ctx.measureText(text)
  const x = (canvasWidth - measured.width) / 2
  ctx.fillText(text, x, padding)

  return {
    imageData: ctx.getImageData(0, 0, offscreen.width, offscreen.height),
    height: offscreen.height,
  }
}

export default function AsciiName({ text = 'BilloDoom' }) {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const CELL = canvas.width < 500 ? 4 : canvas.width < 900 ? 10 : 12
    
    const PADDING = 40
    const SCRAMBLE_RADIUS = 120
    const WAVE_SPEED = 0.4       // canvas-widths per second
    const WAVE_WIDTH = 60        // px — scramble zone around wave front
    const SETTLE_DELAY = 0.3     // seconds after wave passes before cell settles

    let grid = []
    let animId
    let startTime = null
    let waveX = -WAVE_WIDTH      // current wave position in canvas px

    let fireflies = []
    const MAX_FIREFLIES = 60

    function spawnFirefly(x, y) {
      if (fireflies.length >= MAX_FIREFLIES) return
      fireflies.push({
        x,
        y: y + (Math.random() - 0.5) * canvas.height,
        char: randomChar(CHARS_ALL),
        life: 1.0,
        decay: 0.02 + Math.random() * 0.05,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.4,
        charTimer: 0,
      })
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height),
      }
    }

    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    canvas.width = canvas.offsetWidth
    let FONT_SIZE = 100
    const testCtx = document.createElement('canvas').getContext('2d')
    for (let size = 10; size < 1000; size += 2) {
      testCtx.font = `bold ${size}px AsciiFont`
      const m = testCtx.measureText(text)
      const actualWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight
      if (actualWidth >= canvas.width * 0.8) {
        FONT_SIZE = size
        break
      }
    }

    rasterizeText(text, FONT_SIZE, PADDING, canvas.width).then(({ imageData, height: srcH }) => {
      const srcW = imageData.width
      canvas.height = Math.ceil(canvas.width * (srcH / srcW))

      const cols = Math.floor(canvas.width / CELL)
      const rows = Math.floor(canvas.height / CELL)
      const scaleX = srcW / canvas.width
      const scaleY = srcH / canvas.height

      let maxGlyphRow = 0

      grid = []
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const px = Math.floor((col * CELL + CELL / 2) * scaleX)
          const py = Math.floor((row * CELL + CELL / 2) * scaleY)
          const idx = (py * srcW + px) * 4
          const brightness = imageData.data[idx] / 255

          if (brightness > 0.05) maxGlyphRow = row

          grid.push({
            col, row,
            target: brightness > 0.05 ? densityChar(brightness) : null,
            current: ' ',
            brightness,
            passedAt: Math.random() * 0.8,   // timestamp when wave passed this cell
          })
        }
      }

      const underlineRow = maxGlyphRow + 2
      const totalWidth = canvas.width

      const draw = (ts) => {
        if (!startTime) startTime = ts
        const elapsed = (ts - startTime) / 1000

        waveX = (-WAVE_WIDTH) + elapsed * WAVE_SPEED * totalWidth

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.font = `${CELL - 1}px monospace`
        ctx.textBaseline = 'top'

        const mouse = mouseRef.current

        for (const cell of grid) {
          const cx = cell.col * CELL + CELL / 2

          // underline
          if (cell.row === underlineRow && cell.target !== null) {
            if (cx <= waveX) {
              ctx.fillStyle = `rgba(57, 255, 100, 0.6)`
              ctx.fillText('▄', cell.col * CELL, cell.row * CELL)
            }
            continue
          }

          if (cell.target === null) continue

          // wave hasn't reached this cell yet
          if (cx > waveX + WAVE_WIDTH) continue

          // mark when wave first passed
          if (cell.passedAt === null && cx <= waveX) {
            cell.passedAt = elapsed
            cell.current = randomChar(CHARS_ALL)  
          }

          const timeSincePassed = cell.passedAt !== null ? elapsed - cell.passedAt : 0
          const settled = timeSincePassed > SETTLE_DELAY + cell.settleOffset

          // mouse scramble
          const dx = cx - mouse.x
          const dy = (cell.row * CELL + CELL / 2) - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const inMouse = dist < SCRAMBLE_RADIUS

          let char
          let color

          const distFromWave = waveX - cx
          const inWaveZone = distFromWave >= 0 && distFromWave < WAVE_WIDTH

          if (inMouse) {
            // mouse always takes priority, even over unsettled cells
            const falloff = 1 - (dist / SCRAMBLE_RADIUS)
            const scrambleChance = falloff * falloff * 0.6
            if (Math.random() < scrambleChance) cell.current = randomChar(CHARS_ALL)
            char = Math.random() < falloff ? cell.current : (cell.target || cell.current)
            const alpha = 0.4 + falloff * 0.6
            color = `rgba(100, 200, 255, ${alpha})`
          } else if (inWaveZone && !settled) {
            if (Math.random() < 0.5) cell.current = randomChar(CHARS_ALL)
            char = cell.current
            const intensity = 1 - distFromWave / WAVE_WIDTH
            color = `rgba(150, 255, 180, ${0.4 + intensity * 0.6})`
          } else if (!settled) {
            if (Math.random() < 0.3) cell.current = randomChar(CHARS_DENSE)
            char = cell.current
            color = `rgba(100, 255, 130, 0.5)`
          } else {
            char = cell.target
            const alpha = 0.3 + cell.brightness * 0.7
            const green = Math.floor(80 + cell.brightness * 175)
            color = `rgba(57, ${green}, 100, ${alpha})`
          }

          ctx.fillStyle = color
          ctx.fillText(char, cell.col * CELL, cell.row * CELL)
        }

        // spawn fireflies near wave front
        if (waveX >= 0 && waveX <= totalWidth && Math.random() < 0.4) {
          spawnFirefly(
            waveX + (Math.random() - 0.5) * WAVE_WIDTH * 2,
            Math.random() * canvas.height
          )
        }

        // spawn fireflies near mouse when moving
        if (mouse.x > 0 && mouse.x < totalWidth && Math.random() < 0.25) {
          spawnFirefly(
            mouse.x + (Math.random() - 0.5) * SCRAMBLE_RADIUS * 1.5,
            mouse.y + (Math.random() - 0.5) * SCRAMBLE_RADIUS * 1.5
          )
        }

        // update and draw fireflies
        ctx.font = `${CELL - 2}px monospace`
        fireflies = fireflies.filter(f => f.life > 0)
        for (const f of fireflies) {
          f.life -= f.decay
          f.x += f.vx
          f.y += f.vy
          f.charTimer += 0.3
          if (f.charTimer > 1) {
            f.char = randomChar(CHARS_ALL)
            f.charTimer = 0
          }

          const alpha = f.life * 0.7
          const isNearMouse = Math.abs(f.x - mouse.x) < SCRAMBLE_RADIUS * 2
          ctx.fillStyle = isNearMouse
            ? `rgba(100, 200, 255, ${alpha})`
            : `rgba(57, 255, 100, ${alpha * 0.6})`

          ctx.fillText(f.char, f.x, f.y)
        }

        // restore font for next frame
        ctx.font = `${CELL - 1}px monospace`
        
        // draw the wave line itself
        if (waveX >= 0 && waveX <= totalWidth) {
          ctx.strokeStyle = `rgba(57, 255, 100, 0.15)`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(waveX, 0)
          ctx.lineTo(waveX, canvas.height)
          ctx.stroke()
        }

        animId = requestAnimationFrame(draw)
      }

      animId = requestAnimationFrame(draw)
    })

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [text])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        imageRendering: 'pixelated',
        cursor: 'crosshair',
      }}
    />
  )
}