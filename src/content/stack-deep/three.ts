import type { TechDeep } from '../stack-types'

export const threeDeep: TechDeep = {
  analogy:
    'A film set. You place objects on a stage, hang lights, and position a camera. Nothing is a picture until the camera takes a frame, and it takes sixty frames a second. Move an object between frames and it appears to move. Three.js is the set: the scene is the stage, meshes are the props, and the renderer is the camera crew turning it all into pixels through the graphics card.',

  origins: `Three.js was created by **Ricardo Cabello**, known online as **Mr.doob**, and first published in **April 2010**. It began as an ActionScript library for Flash, was ported to JavaScript, and gained a WebGL renderer the following year when browsers started shipping the API.

The problem it solved was that **WebGL** is brutally low-level. It exposes the graphics card through a state machine of buffers, shaders and draw calls inherited from OpenGL ES. Drawing a single lit cube takes a few hundred lines. Three.js wraps that in a scene graph: you create a \`Mesh\` from a \`Geometry\` and a \`Material\`, add it to a \`Scene\`, point a \`Camera\` at it, and call \`renderer.render\`. The library writes the shaders, manages the buffers and sorts the draw calls.

Three.js became the default way to do 3D on the web. Google's Chrome Experiments popularised it, and the library has powered everything from NASA's Eyes on the Solar System to product configurators and the award-winning marketing sites that fill Awwwards. Its ecosystem includes **react-three-fiber**, a React renderer for Three scenes, and **drei**, a set of ready-made helpers. In 2024 to 2025 the library added a **WebGPU** renderer and a node-based material system for the next generation of graphics APIs, alongside the WebGL renderer this app uses.`,

  concepts: [
    {
      title: 'Scene, camera, renderer: the minimum',
      body: `Every Three.js program has three objects. The \`Scene\` is a container for everything visible. The \`Camera\` defines a viewpoint and a projection; \`PerspectiveCamera\` mimics an eye with a field of view, \`OrthographicCamera\` has no perspective. The \`WebGLRenderer\` owns a canvas and a WebGL context and draws a scene from a camera into it. Calling \`render\` once produces one frame.`,
      lang: 'ts',
      code: `import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)

renderer.render(scene, camera)     // one frame, currently empty`,
    },
    {
      title: 'Mesh = geometry + material',
      body: `A \`Geometry\` is the shape: a list of vertices and how they form triangles. A \`Material\` is the surface: colour, shininess, transparency, how it reacts to light. A \`Mesh\` binds one of each and has a position, rotation and scale. \`BoxGeometry\` and \`SphereGeometry\` are built in; models from Blender arrive as \`BufferGeometry\` via a loader. Materials range from \`MeshBasicMaterial\` (ignores light) to \`MeshStandardMaterial\` (physically based, needs lights).`,
      lang: 'ts',
      code: `const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x4da3ff, roughness: 0.4, metalness: 0.2 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const light = new THREE.DirectionalLight(0xffffff, 2)
light.position.set(3, 5, 4)
scene.add(light, new THREE.AmbientLight(0xffffff, 0.3))`,
    },
    {
      title: 'The render loop',
      body: `A single frame is a picture. Animation is a loop: update something, render, wait for the next frame. \`requestAnimationFrame\` (or \`renderer.setAnimationLoop\`) runs the loop in step with the display. Use the elapsed time from a \`Clock\`, not a fixed increment, so motion runs at the same speed on a 60 Hz and a 144 Hz screen.`,
      lang: 'ts',
      code: `const clock = new THREE.Clock()

renderer.setAnimationLoop(() => {
  const t = clock.getElapsedTime()        // seconds since start
  cube.rotation.y = t * 0.6               // frame-rate independent
  cube.position.y = Math.sin(t) * 0.3
  renderer.render(scene, camera)
})

// stop it (on unmount): renderer.setAnimationLoop(null)`,
    },
    {
      title: 'Points and particles',
      body: `A \`Points\` object draws a vertex per point as a small square or sprite, using a \`PointsMaterial\`. Thousands of points cost one draw call because the whole set lives in a single buffer on the GPU. To animate them you update the position array and set \`needsUpdate\` on the attribute, or better, drive movement in a shader from time so the CPU never touches the array. This is how the ambient particle field in this app is drawn.`,
      lang: 'ts',
      code: `const N = 2000
const positions = new Float32Array(N * 3)
for (let i = 0; i < N * 3; i++) positions[i] = (Math.random() - 0.5) * 20

const geo = new THREE.BufferGeometry()
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const mat = new THREE.PointsMaterial({ size: 0.04, color: 0x4da3ff, transparent: true, opacity: 0.8 })
scene.add(new THREE.Points(geo, mat))

// per frame: drift upward and wrap
const p = geo.attributes.position
for (let i = 1; i < N * 3; i += 3) { p.array[i] += 0.005; if (p.array[i] > 10) p.array[i] = -10 }
p.needsUpdate = true`,
    },
    {
      title: 'Transforms and the scene graph',
      body: `Every \`Object3D\` has a \`position\`, a \`rotation\` (or \`quaternion\`) and a \`scale\`, and can hold children. A child's transform is relative to its parent, so rotating a \`Group\` rotates everything in it. This hierarchy is the scene graph. Under the hood each object has a local matrix built from those three properties and a world matrix that multiplies up the chain; the renderer uploads the world matrix for each mesh to the GPU.`,
      lang: 'ts',
      code: `const solarSystem = new THREE.Group()
const sun = new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshBasicMaterial({ color: 0xffcc33 }))
const earthOrbit = new THREE.Group()
const earth = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial({ color: 0x3388ff }))
earth.position.x = 4
earthOrbit.add(earth)
solarSystem.add(sun, earthOrbit)
scene.add(solarSystem)

// per frame: rotating the orbit group carries the earth around the sun
earthOrbit.rotation.y += 0.01`,
    },
    {
      title: 'Resize, pixel ratio and disposal',
      body: `Three does not watch the window. On resize, update the camera aspect, call \`updateProjectionMatrix\`, and \`renderer.setSize\`. Cap the pixel ratio at 2; a 3x phone screen would otherwise render nine times the pixels for no visible gain. When the scene goes away (a React unmount), dispose geometries, materials and textures and call \`renderer.dispose()\`. GPU memory is not garbage-collected.`,
      lang: 'ts',
      code: `function onResize() {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}
addEventListener('resize', onResize)

function cleanup() {
  removeEventListener('resize', onResize)
  renderer.setAnimationLoop(null)
  geo.dispose(); mat.dispose()
  renderer.dispose()
  renderer.domElement.remove()
}`,
    },
    {
      title: 'Shaders: writing the GPU program yourself',
      body: `Every material compiles to two small programs that run on the GPU. The **vertex shader** runs once per vertex and decides where it lands on screen. The **fragment shader** runs once per pixel and decides its colour. \`ShaderMaterial\` lets you write them in GLSL and pass values in as \`uniforms\`. It is how you get effects Three does not ship: wobbling surfaces, custom glows, particles that move entirely on the GPU.`,
      lang: 'ts',
      code: `const mat = new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0x4da3ff) } },
  vertexShader: \`
    uniform float uTime;
    void main() {
      vec3 p = position;
      p.y += sin(p.x * 3.0 + uTime) * 0.1;          // ripple
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }\`,
  fragmentShader: \`
    uniform vec3 uColor;
    void main() { gl_FragColor = vec4(uColor, 1.0); }\`,
})
// per frame: mat.uniforms.uTime.value = clock.getElapsedTime()`,
    },
  ],

  visual: {
    title: 'One frame, from scene graph to pixels',
    intro: 'A scene with a cube and a light. Follow what happens inside a single renderer.render call, from JavaScript objects to the graphics card.',
    frames: [
      {
        caption: 'The scene graph as JavaScript objects. Each has a local transform; nothing is drawn yet.',
        frame: `  Scene
   ├─ DirectionalLight   pos (3, 5, 4)
   ├─ AmbientLight
   └─ Group              rot.y = 0.6
       └─ Mesh "cube"    pos (0, 0.3, 0)
            ├─ BoxGeometry   (24 vertices, 12 triangles)
            └─ MeshStandardMaterial  color #4da3ff

  Camera  pos (0, 0, 5)  fov 60`,
      },
      {
        caption: 'Step 1: update world matrices. Each object multiplies its local matrix by its parent\'s, top down.',
        frame: `  updateMatrixWorld()

  Group.matrixWorld = Scene * local(rot.y 0.6)
  cube.matrixWorld  = Group.matrixWorld * local(pos 0,0.3,0)

  so the cube is both lifted 0.3 and turned 0.6 rad,
  though its own rotation is zero`,
      },
      {
        caption: 'Step 2: frustum culling and sorting. Objects outside the camera\'s view pyramid are skipped; the rest are sorted by material and depth.',
        frame: `  camera frustum
        \\           /
         \\  cube   /      inside  -> keep
          \\  ■    /
           \\     /        (a mesh behind the camera
            \\   /          or far past 100 units
             \\ /           is culled here)
              ●  camera

  render list: [ cube ]   opaque first, transparent after`,
      },
      {
        caption: 'Step 3: for each mesh, bind its geometry buffers and compiled shader program, upload uniforms, issue a draw call.',
        frame: `  GPU
  ┌───────────────────────────────────────────┐
  │ program: MeshStandardMaterial (compiled)  │
  │ uniforms: modelViewMatrix, projection,    │
  │           light dir, color, roughness     │
  │ buffers:  position (24 x 3 floats)        │
  │           normal, uv, index (36)          │
  │                                           │
  │ gl.drawElements(TRIANGLES, 36)            │
  └───────────────────────────────────────────┘
  draw calls this frame: 1`,
      },
      {
        caption: 'Step 4: the vertex shader places 24 vertices; the rasteriser fills triangles; the fragment shader lights each pixel. The canvas shows the result.',
        frame: `  vertex shader  x24  ->  screen positions
  rasterise      12 triangles -> ~40,000 fragments
  fragment shader x40,000 -> lit colour per pixel

  canvas
  ┌────────────────────────┐
  │                        │
  │        ▄▄▄▄▄           │
  │       ██████▌          │   lit face brighter,
  │       ██████▌          │   shaded face darker
  │        ▀▀▀▀▀           │
  └────────────────────────┘
  ~1 ms, then requestAnimationFrame again`,
      },
    ],
  },

  internals: `## What WebGL actually is

WebGL is a JavaScript binding to OpenGL ES 2.0 (WebGL 1) and 3.0 (WebGL 2). It gives you a canvas-backed context with a small vocabulary: create buffers and upload arrays to them, compile shader source into programs, set uniforms, bind buffers to attributes, and issue draw calls. There is no concept of a mesh, a light or a camera. Every one of those is something Three.js builds on top by generating shader code and managing GPU state for you.

## The renderer's frame

\`WebGLRenderer.render\` does a fixed sequence. It updates every object's world matrix, projects the camera to get a view-projection matrix, walks the scene collecting renderable objects into a render list while culling those outside the frustum, sorts the list (opaque objects front-to-back to let the depth buffer reject hidden pixels early, transparent objects back-to-front so blending is correct), then for each item sets up the program and buffers and draws. Lights are collected first because the shaders of lit materials need the light count and parameters as uniforms.

## Materials compile to shaders

\`MeshStandardMaterial\` is not a shader; it is a description. On first use the renderer assembles a GLSL program from dozens of shader chunks (lighting, fog, shadows, colour space, morph targets) selected by the material's settings and the scene's lights, then caches the compiled program keyed by those settings. Two materials with the same settings share a program. This is why the first frame of a complex scene can stall: shader compilation is happening.

## Geometry lives on the GPU

A \`BufferGeometry\` holds typed arrays for each attribute: \`position\`, \`normal\`, \`uv\`, and an optional \`index\` so shared vertices are stored once. On first render each array is uploaded to a GPU buffer and left there. Modifying the JavaScript array does nothing until you set \`needsUpdate = true\`, which schedules a re-upload. For animated particles, moving the calculation into a vertex shader driven by a time uniform avoids the upload entirely.

## Transforms and matrices

Each object's \`matrix\` is composed from position, quaternion and scale (TRS). \`matrixWorld\` is parent world matrix times local matrix. The shader receives \`modelViewMatrix\` (world times camera inverse) and \`projectionMatrix\` (perspective), and the vertex shader multiplies each position through both to reach clip space. Normals go through a separate \`normalMatrix\` so lighting is correct under non-uniform scale.

## Colour spaces and tone mapping

Modern Three renders in linear colour internally and converts to sRGB for the canvas, which is why texture colour spaces must be set and why \`renderer.outputColorSpace\` exists. Tone mapping (ACES Filmic is common) compresses high dynamic range lighting into the displayable range. Getting these two right is the difference between a scene that looks like a plastic toy and one that looks lit.

## WebGPU

The WebGPU renderer targets the newer API standardised in 2023, with compute shaders and a lower-overhead command model. Three's node material system (TSL, Three Shading Language) writes shaders in JavaScript and compiles to either WGSL or GLSL, so materials can target both backends. It is the direction of the library, and the WebGL renderer remains for compatibility.

## In a React app

React owns the DOM; Three owns a canvas. The pattern is a component with a \`useEffect\` that creates renderer, scene and loop on mount, and disposes everything in the cleanup. Three's objects live in refs, not state, because they change sixty times a second and re-rendering React for that would be wrong. react-three-fiber is the alternative: it makes Three objects JSX elements and manages the loop and disposal for you.`,

  buildIt: {
    title: 'A particle field like the one behind this app',
    intro: 'Two thousand drifting points with additive glow, in a React component that cleans up after itself. Under a hundred lines including the wrap.',
    steps: [
      {
        title: 'Renderer, scene and camera in a ref',
        body: 'Everything lives in refs and is created in an effect. React never re-renders for animation.',
        lang: 'tsx',
        code: `import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function Particles({ color = '#4da3ff', count = 2000 }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current!
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 100)
    camera.position.z = 8`,
      },
      {
        title: 'The points',
        body: 'Random positions in a box, a small size, and additive blending so overlapping points glow. On light backgrounds use normal blending instead.',
        lang: 'tsx',
        code: `    const pos = new Float32Array(count * 3)
    for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * 16
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color, size: 0.05, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)`,
      },
      {
        title: 'Drift, parallax and the loop',
        body: 'Rotate the whole cloud slowly and nudge it toward the pointer. Time-based so speed is stable on any refresh rate.',
        lang: 'tsx',
        code: `    const clock = new THREE.Clock()
    let mx = 0, my = 0
    const onMove = (e: MouseEvent) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5 }
    addEventListener('mousemove', onMove)

    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime()
      points.rotation.y = t * 0.03 + mx * 0.3
      points.rotation.x = my * 0.2
      renderer.render(scene, camera)
    })`,
      },
      {
        title: 'Resize and cleanup',
        body: 'Cleanup is not optional. Without it, navigating away leaves a running loop and GPU buffers.',
        lang: 'tsx',
        code: `    const ro = new ResizeObserver(() => {
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      removeEventListener('mousemove', onMove)
      renderer.setAnimationLoop(null)
      geo.dispose(); mat.dispose(); renderer.dispose()
      renderer.domElement.remove()
    }
  }, [color, count])

  return <div ref={host} className="absolute inset-0 -z-10" aria-hidden />
}`,
      },
    ],
  },

  inTheWild: [
    { who: 'NASA Eyes on the Solar System', what: 'The browser version of NASA\'s mission visualiser renders planets and spacecraft trajectories with Three.js.' },
    { who: 'Google Chrome Experiments', what: 'The showcase that made WebGL famous ran largely on Three.js, from music videos to data art.' },
    { who: 'Bruno Simon\'s portfolio', what: 'The drive-a-car-around-my-resume site that inspired a generation of 3D web developers, and the author of the most popular Three.js course.' },
    { who: 'Product configurators', what: 'Car, furniture and sneaker customisers from many brands use Three for real-time material and colour changes.' },
    { who: 'react-three-fiber ecosystem', what: 'Vercel, Framer and countless agencies build 3D scenes as React components on top of Three.' },
    { who: 'This app', what: 'The optional animated particle background on non-reading pages, created on mount and disposed on unmount.' },
  ],

  alternatives: [
    { name: 'react-three-fiber', pick: 'A React app with a substantial 3D scene. Three objects become JSX and the loop, resize and disposal are handled.' },
    { name: 'Babylon.js', pick: 'Game-like projects wanting a full engine: physics, GUI, an inspector and a scene editor out of the box.' },
    { name: 'PixiJS', pick: '2D only, extremely fast sprites and particles. Right for 2D games and effects, wrong for anything with a camera in space.' },
    { name: 'CSS and SVG animation', pick: 'Ambient decoration that does not need depth. Cheaper to build and to run, and this app uses it for most motion.' },
    { name: 'Raw WebGL or WebGPU', pick: 'A custom renderer or a learning exercise. Expect to reinvent the scene graph.' },
  ],

  glossary: [
    { term: 'Scene', meaning: 'The root container of everything to draw.' },
    { term: 'Mesh', meaning: 'A geometry plus a material, positioned in the scene.' },
    { term: 'Geometry', meaning: 'Vertex data describing a shape as triangles.' },
    { term: 'Material', meaning: 'How a surface looks and reacts to light; compiles to a shader program.' },
    { term: 'Camera', meaning: 'The viewpoint and projection used to turn 3D positions into 2D.' },
    { term: 'Renderer', meaning: 'The object that owns the canvas and issues GPU draw calls.' },
    { term: 'Render loop', meaning: 'The per-frame cycle of update then render, driven by requestAnimationFrame.' },
    { term: 'Shader', meaning: 'A small GPU program; vertex shaders place points, fragment shaders colour pixels.' },
    { term: 'Uniform', meaning: 'A value passed from JavaScript to a shader, constant for one draw call.' },
    { term: 'Draw call', meaning: 'One GPU command to draw a set of triangles; fewer is faster.' },
    { term: 'Frustum culling', meaning: 'Skipping objects outside the camera\'s view before drawing.' },
    { term: 'Dispose', meaning: 'Freeing GPU memory held by geometries, materials, textures and the renderer.' },
  ],

  quiz: [
    {
      question: 'Which three objects does every Three.js program need to draw anything?',
      options: ['Mesh, Light, Texture', 'Scene, Camera, Renderer', 'Geometry, Material, Shader', 'Canvas, Context, Loop'],
      answerIndex: 1,
      explanation: 'The scene holds objects, the camera defines the view, and the renderer draws the scene from the camera onto a canvas.',
    },
    {
      question: 'You animate with cube.rotation.y += 0.01 per frame. What goes wrong on a 144 Hz monitor?',
      options: ['Nothing', 'It spins 2.4 times faster than on a 60 Hz screen because the increment is per frame, not per second', 'It stutters', 'It runs slower'],
      answerIndex: 1,
      explanation: 'Frame-based increments tie speed to refresh rate. Use elapsed time from a Clock so motion is per second.',
    },
    {
      question: 'Why do 2,000 particles drawn as a Points object cost one draw call rather than 2,000?',
      options: ['Three merges meshes automatically', 'All positions live in one GPU buffer and one command draws every point', 'Points are drawn on the CPU', 'They are instanced meshes'],
      answerIndex: 1,
      explanation: 'A single BufferGeometry attribute holds every position. gl.drawArrays draws them all at once; the vertex shader runs once per point on the GPU.',
    },
    {
      question: 'A React component creates a WebGLRenderer in useEffect but returns no cleanup. What happens after navigating away?',
      options: ['Nothing, garbage collection handles it', 'The animation loop keeps running and GPU memory stays allocated; repeated visits leak', 'React warns', 'The canvas is reused'],
      answerIndex: 1,
      explanation: 'GPU resources and requestAnimationFrame loops are outside the garbage collector. Dispose geometries, materials and the renderer, and stop the loop.',
    },
    {
      question: 'What does the fragment shader decide?',
      options: ['Where each vertex lands on screen', 'The colour of each pixel covered by a triangle', 'Which objects are visible', 'The camera projection'],
      answerIndex: 1,
      explanation: 'Vertex shaders position vertices; the rasteriser fills triangles; fragment shaders run per covered pixel to compute colour, including lighting.',
    },
  ],
}
