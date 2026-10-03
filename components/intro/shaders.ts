// GLSL ES 3.00 for the illustrated intro globe (WebGL 2)

const header = /* glsl */ `#version 300 es
precision highp float;
`

// ---------- Sky: space gradient plus the atmosphere's halo, computed per ray (one full-screen triangle) ----------

export const skyVertex = /* glsl */ `${header}
layout(location = 0) in vec2 aPosition;
out vec2 vNdc;
void main() {
  vNdc = aPosition;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

export const skyFragment = /* glsl */ `${header}
in vec2 vNdc;
uniform vec3 uCamera;
uniform vec3 uForward;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec2 uTan;
uniform vec3 uSun;
out vec4 outColor;

void main() {
  vec3 ray = normalize(uForward + vNdc.x * uTan.x * uRight + vNdc.y * uTan.y * uUp);
  // Deep navy, warming to violet toward the top of the frame
  float lift = clamp(vNdc.y * 0.35 + 0.5 + vNdc.x * 0.12, 0.0, 1.0);
  vec3 color = mix(vec3(0.012, 0.018, 0.058), vec3(0.075, 0.05, 0.17), lift * lift);
  color *= 1.0 - 0.35 * dot(vNdc * 0.55, vNdc * 0.55);

  // Halo: how far outside the planet this ray passes (0 at the limb)
  float along = max(dot(-uCamera, ray), 0.0);
  vec3 closest = uCamera + ray * along;
  float miss = max(length(closest) - 1.0, 0.0);
  float sunSide = 0.3 + 0.7 * smoothstep(-0.45, 0.55, dot(normalize(closest), uSun));
  float inner = exp(-miss * 70.0);
  float outer = exp(-miss * 11.0);
  color += (vec3(0.62, 0.92, 1.0) * inner * 0.75 + vec3(0.3, 0.5, 1.0) * outer * 0.42) * sunSide;
  outColor = vec4(color, 1.0);
}
`

// ---------- Stars ----------

export const starVertex = /* glsl */ `${header}
layout(location = 0) in vec3 aPosition;
/** size (px), twinkle phase, sparkle (0/1), tint */
layout(location = 1) in vec4 aStar;
uniform mat4 uViewProjection;
uniform float uTime;
uniform float uPixelRatio;
out float vAlpha;
out float vSparkle;
out vec3 vTint;
void main() {
  gl_Position = uViewProjection * vec4(aPosition, 1.0);
  gl_PointSize = aStar.x * uPixelRatio;
  vAlpha = 0.5 + 0.5 * sin(uTime * (0.9 + aStar.y * 1.6) + aStar.y * 40.0);
  vSparkle = aStar.z;
  vTint = mix(vec3(1.0, 0.94, 0.82), vec3(0.78, 0.88, 1.0), aStar.w);
}
`

export const starFragment = /* glsl */ `${header}
in float vAlpha;
in float vSparkle;
in vec3 vTint;
out vec4 outColor;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float core = 1.0 - smoothstep(0.0, mix(1.0, 0.35, vSparkle), length(p));
  // The brightest stars get a four-point sparkle
  float beams = max(0.0, 1.0 - abs(p.x) * 9.0) * (1.0 - abs(p.y)) + max(0.0, 1.0 - abs(p.y) * 9.0) * (1.0 - abs(p.x));
  float alpha = (core * core + beams * vSparkle) * vAlpha;
  outColor = vec4(vTint * alpha, alpha);
}
`

// ---------- The planet ----------

export const planetVertex = /* glsl */ `${header}
layout(location = 0) in vec3 aPosition;
uniform mat4 uModel;
uniform mat4 uViewProjection;
out vec3 vGlobe;
out vec3 vWorld;
void main() {
  vGlobe = aPosition;
  vec4 world = uModel * vec4(aPosition, 1.0);
  vWorld = world.xyz;
  gl_Position = uViewProjection * world;
}
`

export const planetFragment = /* glsl */ `${header}
in vec3 vGlobe;
in vec3 vWorld;
uniform sampler2D uColor;
uniform sampler2D uCoast;
uniform sampler2D uLights;
uniform sampler2D uLocalColor;
uniform sampler2D uLocalCoast;
/** Local patch: west longitude, north latitude, size (all degrees) */
uniform vec3 uLocal;
/** Coast distance ranges (km) of the global and local maps */
uniform vec2 uRange;
uniform vec3 uSun;
uniform vec3 uCamera;
/** The beach, in the globe's own frame */
uniform vec3 uTarget;
/** 1 once the local patch has loaded */
uniform float uLocalReady;
/** Landing ring: 0..1 while it pulses, negative when off */
uniform float uPulse;
/** 0: normal, 1: draw the debug marker, 2: output the marker (red) and the coast distance there (green) */
uniform float uDebug;
uniform vec3 uDeepSea;
uniform vec3 uShelfSea;
uniform vec3 uShallowSea;
uniform vec3 uFoam;
out vec4 outColor;

const float PI = 3.14159265359;
const float DEGREES = 57.29577951308;

/** Inverse of latLngToVector in geo.ts: unit vector → latitude/longitude (degrees) */
vec2 latLngOf(vec3 p) {
  return vec2(asin(clamp(p.y, -1.0, 1.0)), atan(-p.z, p.x)) * DEGREES;
}

/** Equirectangular texture coordinates: u from 180°W, v from 90°N (as the images are stored) */
vec2 globeUv(vec2 latLng) {
  return vec2(latLng.y / 360.0 + 0.5, 0.5 - latLng.x / 180.0);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec3 p = normalize(vGlobe);
  vec2 latLng = latLngOf(p);
  vec2 uv = globeUv(latLng);

  // Gradients that don't jump at the date line: use whichever u is continuous here
  vec2 wrapped = vec2(fract(uv.x + 0.5) - 0.5, uv.y);
  vec2 dxA = dFdx(uv);
  vec2 dyA = dFdy(uv);
  vec2 dxB = dFdx(wrapped);
  vec2 dyB = dFdy(wrapped);
  bool useB = abs(dxB.x) + abs(dyB.x) < abs(dxA.x) + abs(dyA.x);
  vec2 dx = useB ? dxB : dxA;
  vec2 dy = useB ? dyB : dyA;

  // Ground size of a pixel (km), from the seam-safe gradients
  float latitudeScale = cos(latLng.x / DEGREES);
  float kmPerPixel = 111.32 * max(length(dx * vec2(360.0 * latitudeScale, 180.0)), length(dy * vec2(360.0 * latitudeScale, 180.0)));

  vec3 albedo = textureGrad(uColor, uv, dx, dy).rgb;
  float coast = (textureGrad(uCoast, uv, dx, dy).r - 0.5) * 2.0 * uRange.x;

  // The sharper patch around the beach: feathered into the global map at its edges, and only used up
  // close (from afar its extra detail would show as a square)
  vec2 local = vec2(latLng.y - uLocal.x, uLocal.y - latLng.x) / uLocal.z;
  vec2 localDx = dx * vec2(360.0, 180.0) / uLocal.z;
  vec2 localDy = dy * vec2(360.0, 180.0) / uLocal.z;
  float inside = min(min(local.x, 1.0 - local.x), min(local.y, 1.0 - local.y));
  float patchWeight = smoothstep(0.0, 0.07, inside) * (1.0 - smoothstep(4.0, 10.0, kmPerPixel)) * uLocalReady;
  vec3 localAlbedo = textureGrad(uLocalColor, clamp(local, 0.0, 1.0), localDx, localDy).rgb;
  float localCoast = (textureGrad(uLocalCoast, clamp(local, 0.0, 1.0), localDx, localDy).r - 0.5) * 2.0 * uRange.y;
  albedo = mix(albedo, localAlbedo, patchWeight);
  coast = mix(coast, localCoast, patchWeight);

  // Coastline and sea bands; minimum widths in pixels keep them visible from far away
  float land = smoothstep(-0.7 * kmPerPixel, 0.7 * kmPerPixel, coast);
  float depth = -coast;
  float shallowEdge = max(26.0, 2.2 * kmPerPixel);
  float shelfEdge = max(105.0, 5.0 * kmPerPixel);
  float shallow = 1.0 - smoothstep(shallowEdge - kmPerPixel, shallowEdge + kmPerPixel, depth);
  float shelf = 1.0 - smoothstep(shelfEdge - kmPerPixel, shelfEdge + kmPerPixel, depth);
  vec3 sea = mix(mix(uDeepSea, uShelfSea, shelf), uShallowSea, shallow);
  float foamWidth = max(1.5, 1.2 * kmPerPixel);
  float foam = (1.0 - smoothstep(foamWidth * 0.4, foamWidth, depth)) * (1.0 - smoothstep(2.0, 5.0, kmPerPixel));
  sea = mix(sea, uFoam, foam * 0.85);
  vec3 base = mix(sea, albedo, land);

  // Three-step cel shading with cool shadows
  vec3 normal = normalize(vWorld);
  vec3 view = normalize(uCamera - vWorld);
  float light = dot(normal, uSun);
  float edge = max(fwidth(light), 1e-4);
  float bright = smoothstep(0.3 - edge, 0.3 + edge, light);
  float day = smoothstep(-0.03 - edge, -0.03 + edge, light);
  vec3 mid = base * vec3(0.78, 0.83, 0.97);
  vec3 shadow = base * vec3(0.26, 0.3, 0.52) + vec3(0.012, 0.016, 0.055);
  vec3 color = mix(shadow, mix(mid, base, bright), day);

  // Cartoon sun glint on the water: a crisp highlight inside a soft sheen. The highlight belongs to the
  // view from space; close to the surface it would be a huge white disc, so it fades out
  float facing = dot(normal, normalize(uSun + view));
  float glintEdge = max(fwidth(facing), 1e-5);
  float water = (1.0 - land) * day;
  float glint = smoothstep(0.9993 - glintEdge, 0.9993 + glintEdge, facing) * smoothstep(4.0, 9.0, kmPerPixel);
  color = mix(color, vec3(1.0, 0.97, 0.88), glint * water * 0.9);
  color += vec3(0.2, 0.3, 0.42) * smoothstep(0.975, 0.997, facing) * water * 0.35;

  // City lights on the night side: warm dots up close, a soft glow from afar
  float night = 1.0 - smoothstep(-0.12, 0.04, light);
  vec2 grid = latLng.yx / 0.42;
  vec2 cell = floor(grid);
  float density = textureLod(uLights, globeUv((cell.yx + 0.5) * 0.42), 0.0).r;
  vec2 spot = vec2(hash(cell), hash(cell + 19.7)) * 0.56 + 0.22;
  float lit = step(hash(cell + 7.3), density * 1.15);
  float radius = mix(0.09, 0.2, hash(cell + 3.1)) * (0.6 + 0.6 * density);
  float distanceToDot = length((fract(grid) - spot) * vec2(cos(latLng.x / DEGREES), 1.0));
  float dotEdge = max(fwidth(distanceToDot), 1e-4);
  float dots = (1.0 - smoothstep(radius - dotEdge, radius + dotEdge, distanceToDot)) * lit;
  float cellPixels = 1.0 / max(max(fwidth(grid.x), fwidth(grid.y)), 1e-4);
  float glow = textureGrad(uLights, uv, dx, dy).r;
  float lights = mix(glow * 0.55, dots, smoothstep(2.5, 6.0, cellPixels)) * land;
  color += vec3(1.0, 0.78, 0.42) * lights * night * 1.25;

  // Glowing rim, strongest on the sunlit limb
  float rim = pow(1.0 - max(dot(normal, view), 0.0), 2.6);
  color += vec3(0.44, 0.84, 1.0) * rim * (0.22 + 0.7 * smoothstep(-0.25, 0.55, light));

  // Angle from the beach (degrees); the chord form stays precise for tiny angles
  float fromBeach = 2.0 * asin(min(1.0, length(p - uTarget) * 0.5)) * DEGREES;
  float angleEdge = max(fwidth(fromBeach), 1e-6);
  if (uPulse >= 0.0) {
    float ring = 1.0 - smoothstep(angleEdge, angleEdge * 2.4, abs(fromBeach - mix(0.06, 0.9, uPulse)));
    float pin = 1.0 - smoothstep(0.045 - angleEdge, 0.045 + angleEdge, fromBeach);
    color = mix(color, vec3(1.0, 0.54, 0.44), max(ring * (1.0 - uPulse), pin) * 0.95);
  }
  if (uDebug > 1.5) {
    outColor = vec4(step(fromBeach, 0.03), clamp(0.5 + coast / 120.0, 0.0, 1.0), 0.0, 1.0);
    return;
  }
  if (uDebug > 0.5) {
    float marker = (1.0 - smoothstep(angleEdge, angleEdge * 2.0, abs(fromBeach - 0.15))) + step(fromBeach, 0.03);
    color = mix(color, vec3(1.0, 0.1, 0.85), min(marker, 1.0));
  }
  outColor = vec4(color, 1.0);
}
`

// ---------- Clouds: flattened low-poly puffs, one tone per facet ----------

export const cloudVertex = /* glsl */ `${header}
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
/** Puff center (cloud-layer frame, already at cloud height) and radius */
layout(location = 2) in vec4 aPuff;
uniform mat4 uModel;
uniform mat4 uViewProjection;
out vec3 vNormal;
out vec3 vWorld;
out vec3 vUp;
const float SQUASH = 0.62;
void main() {
  vec3 up = normalize(aPuff.xyz);
  vec3 side = normalize(cross(abs(up.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0), up));
  vec3 ahead = cross(up, side);
  vec3 offset = aPosition * aPuff.w;
  vec3 position = aPuff.xyz + side * offset.x + up * offset.y * SQUASH + ahead * offset.z;
  vec3 normal = side * aNormal.x + up * (aNormal.y / SQUASH) + ahead * aNormal.z;
  vec4 world = uModel * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormal = mat3(uModel) * normal;
  vUp = mat3(uModel) * up;
  gl_Position = uViewProjection * world;
}
`

export const cloudFragment = /* glsl */ `${header}
in vec3 vNormal;
in vec3 vWorld;
in vec3 vUp;
uniform vec3 uSun;
uniform vec3 uCamera;
out vec4 outColor;
void main() {
  vec3 normal = normalize(vNormal);
  float light = dot(normal, uSun);
  vec3 color = light > 0.18 ? vec3(1.0) : light > -0.12 ? vec3(0.86, 0.89, 0.98) : vec3(0.66, 0.7, 0.9);
  // Puffs over the night side take the same cool shadow tint as the ground there (moonlit)
  float day = smoothstep(-0.14, 0.08, dot(normalize(vUp), uSun));
  color *= mix(vec3(0.34, 0.39, 0.58), vec3(1.0), day);
  float rim = pow(1.0 - max(dot(normal, normalize(uCamera - vWorld)), 0.0), 3.0);
  color += vec3(0.16, 0.2, 0.3) * rim * day;
  outColor = vec4(color, 1.0);
}
`

// ---------- Satellites: flat colors, two tones ----------

export const craftVertex = /* glsl */ `${header}
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec3 aColor;
uniform mat4 uModel;
uniform mat4 uViewProjection;
out vec3 vNormal;
out vec3 vColor;
void main() {
  vNormal = mat3(uModel) * aNormal;
  vColor = aColor;
  gl_Position = uViewProjection * uModel * vec4(aPosition, 1.0);
}
`

export const craftFragment = /* glsl */ `${header}
in vec3 vNormal;
in vec3 vColor;
uniform vec3 uSun;
out vec4 outColor;
void main() {
  float light = dot(normalize(vNormal), uSun);
  vec3 color = vColor * (light > 0.0 ? 1.0 : 0.55) * vec3(1.0, 1.0, light > 0.0 ? 1.0 : 1.12);
  outColor = vec4(color, 1.0);
}
`

// ---------- Blinking beacons on the craft ----------

export const beaconVertex = /* glsl */ `${header}
layout(location = 0) in vec3 aPosition;
/** rgb, brightness */
layout(location = 1) in vec4 aGlow;
uniform mat4 uViewProjection;
uniform float uPixelRatio;
out vec4 vGlow;
void main() {
  gl_Position = uViewProjection * vec4(aPosition, 1.0);
  gl_PointSize = (6.0 + 10.0 * aGlow.a) * uPixelRatio;
  vGlow = aGlow;
}
`

export const beaconFragment = /* glsl */ `${header}
in vec4 vGlow;
out vec4 outColor;
void main() {
  float d = length(gl_PointCoord * 2.0 - 1.0);
  float alpha = (1.0 - smoothstep(0.0, 1.0, d)) * (0.15 + 0.85 * vGlow.a);
  alpha = alpha * alpha;
  outColor = vec4(vGlow.rgb * alpha, alpha);
}
`
