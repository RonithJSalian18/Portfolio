/** Minimal WebGL2 helpers for the intro: column-major matrices, programs and textures */

import type { Vec3 } from './geo'

export type Mat4 = Float32Array

export const mat4 = () => new Float32Array(16)

export function perspective(out: Mat4, fovY: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovY / 2)
  out.fill(0)
  out[0] = f / aspect
  out[5] = f
  out[10] = (far + near) / (near - far)
  out[11] = -1
  out[14] = (2 * far * near) / (near - far)
  return out
}

/** View matrix for a camera at `eye` looking at `target` */
export function lookAt(out: Mat4, eye: Vec3, target: Vec3, up: Vec3) {
  let zx = eye[0] - target[0]
  let zy = eye[1] - target[1]
  let zz = eye[2] - target[2]
  let length = Math.hypot(zx, zy, zz) || 1
  zx /= length
  zy /= length
  zz /= length
  let xx = up[1] * zz - up[2] * zy
  let xy = up[2] * zx - up[0] * zz
  let xz = up[0] * zy - up[1] * zx
  length = Math.hypot(xx, xy, xz) || 1
  xx /= length
  xy /= length
  xz /= length
  const yx = zy * xz - zz * xy
  const yy = zz * xx - zx * xz
  const yz = zx * xy - zy * xx
  out[0] = xx
  out[1] = yx
  out[2] = zx
  out[3] = 0
  out[4] = xy
  out[5] = yy
  out[6] = zy
  out[7] = 0
  out[8] = xz
  out[9] = yz
  out[10] = zz
  out[11] = 0
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2])
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2])
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2])
  out[15] = 1
  return out
}

export function multiply(out: Mat4, a: Mat4, b: Mat4) {
  for (let column = 0; column < 4; column++) {
    const b0 = b[column * 4]
    const b1 = b[column * 4 + 1]
    const b2 = b[column * 4 + 2]
    const b3 = b[column * 4 + 3]
    for (let row = 0; row < 4; row++) {
      out[column * 4 + row] = a[row] * b0 + a[4 + row] * b1 + a[8 + row] * b2 + a[12 + row] * b3
    }
  }
  return out
}

/** Rz(tilt) · Ry(spin): the globe's model matrix (matches globeToWorld in geo.ts) */
export function globeMatrix(out: Mat4, tilt: number, spin: number) {
  const ct = Math.cos(tilt)
  const st = Math.sin(tilt)
  const cs = Math.cos(spin)
  const ss = Math.sin(spin)
  out.fill(0)
  // Columns of Rz·Ry
  out[0] = ct * cs
  out[1] = st * cs
  out[2] = -ss
  out[4] = -st
  out[5] = ct
  out[8] = ct * ss
  out[9] = st * ss
  out[10] = cs
  out[15] = 1
  return out
}

/** Model matrix from an orthonormal basis (columns) and a position */
export function basisMatrix(out: Mat4, x: Vec3, y: Vec3, z: Vec3, position: Vec3) {
  out.set([...x, 0, ...y, 0, ...z, 0, ...position, 1])
  return out
}

/** Clip-space position of a world point */
export function project(viewProjection: Mat4, [x, y, z]: Vec3) {
  const m = viewProjection
  const w = m[3] * x + m[7] * y + m[11] * z + m[15]
  return {
    x: (m[0] * x + m[4] * y + m[8] * z + m[12]) / w,
    y: (m[1] * x + m[5] * y + m[9] * z + m[13]) / w,
    w,
  }
}

// ---------- Programs ----------

export interface Program {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation | null>
}

/** Starts compiling; call `finishPrograms` before first use (lets the browser compile in parallel) */
export function startProgram(gl: WebGL2RenderingContext, vertex: string, fragment: string) {
  const program = gl.createProgram()
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vertex],
    [gl.FRAGMENT_SHADER, fragment],
  ] as const) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    gl.attachShader(program, shader)
  }
  gl.linkProgram(program)
  return program
}

/**
 * Waits (without blocking the page) until the programs are linked, then checks them and looks up their
 * uniforms. KHR_parallel_shader_compile lets the GPU driver work in the background meanwhile.
 */
export async function finishPrograms(gl: WebGL2RenderingContext, programs: WebGLProgram[]) {
  const parallel = gl.getExtension('KHR_parallel_shader_compile')
  if (parallel) {
    while (!programs.every((program) => gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR))) {
      await new Promise((resolve) => setTimeout(resolve, 16))
    }
  }
  return programs.map((program): Program => {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl
        .getAttachedShaders(program)
        ?.map((shader) => gl.getShaderInfoLog(shader))
        .join('\n')
      throw new Error(`Globe shader failed: ${gl.getProgramInfoLog(program)}\n${log}`)
    }
    const uniforms: Program['uniforms'] = {}
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
    for (let index = 0; index < count; index++) {
      const name = gl.getActiveUniform(program, index)!.name
      uniforms[name] = gl.getUniformLocation(program, name)
    }
    for (const shader of gl.getAttachedShaders(program) ?? []) {
      gl.detachShader(program, shader)
      gl.deleteShader(shader)
    }
    return { program, uniforms }
  })
}

// ---------- Textures ----------

/** Fetch and decode off the main thread; no color management, so data maps keep their exact values */
export async function loadBitmap(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  return createImageBitmap(await response.blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })
}

export function createTexture(
  gl: WebGL2RenderingContext,
  image: ImageBitmap,
  options: { repeatX?: boolean; anisotropy?: number } = {},
) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, gl.RGB, gl.UNSIGNED_BYTE, image)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.repeatX ? gl.REPEAT : gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const anisotropic = options.anisotropy ? gl.getExtension('EXT_texture_filter_anisotropic') : null
  if (anisotropic && options.anisotropy) {
    const limit = gl.getParameter(anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT) as number
    gl.texParameterf(gl.TEXTURE_2D, anisotropic.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(limit, options.anisotropy))
  }
  image.close()
  return texture
}

export function createBuffer(gl: WebGL2RenderingContext, data: BufferSource, target: number = gl.ARRAY_BUFFER) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, gl.STATIC_DRAW)
  return buffer
}

/** Binds float attributes from one buffer: layout is [location, size, stride (floats), offset (floats)] */
export function attributes(
  gl: WebGL2RenderingContext,
  buffer: WebGLBuffer | null,
  layout: [number, number, number, number][],
  divisor = 0,
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  for (const [location, size, stride, offset] of layout) {
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride * 4, offset * 4)
    gl.vertexAttribDivisor(location, divisor)
  }
}
