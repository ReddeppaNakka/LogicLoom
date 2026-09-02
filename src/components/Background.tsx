import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Ambient Three.js particle field: slow drifting motes with a faint blue glow,
 * like dust in a dark dungeon. Kept very subtle so it never distracts from reading.
 */
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 8

    const count = 420
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = 0.15 + Math.random() * 0.5
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const sprite = makeSprite()
    const mat = new THREE.PointsMaterial({
      size: 0.12,
      map: sprite,
      transparent: true,
      opacity: 0.55,
      color: new THREE.Color('#7cc0ff'),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // a second, larger and dimmer layer for depth
    const geo2 = geo.clone()
    const mat2 = mat.clone()
    mat2.size = 0.32
    mat2.opacity = 0.12
    const points2 = new THREE.Points(geo2, mat2)
    points2.position.z = -3
    scene.add(points2)

    let w = 0
    let h = 0
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let mx = 0
    let my = 0
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / w - 0.5) * 2
      my = (e.clientY / h - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    let raf = 0
    const start = performance.now()
    const tick = () => {
      const t = (performance.now() - start) / 1000
      const arr = geo.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 1] += speeds[i] * 0.004
        arr[i * 3] += Math.sin(t * 0.3 + i) * 0.0015
        if (arr[i * 3 + 1] > 8) arr[i * 3 + 1] = -8
      }
      geo.attributes.position.needsUpdate = true
      points.rotation.z = Math.sin(t * 0.05) * 0.03
      camera.position.x += (mx * 0.4 - camera.position.x) * 0.02
      camera.position.y += (-my * 0.25 - camera.position.y) * 0.02
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    if (reduce) renderer.render(scene, camera)
    else raf = requestAnimationFrame(tick)

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else if (!reduce) raf = requestAnimationFrame(tick)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
      geo.dispose()
      geo2.dispose()
      mat.dispose()
      mat2.dispose()
      sprite.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" aria-hidden />
}

function makeSprite(): THREE.Texture {
  const size = 64
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(180,220,255,0.6)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}
