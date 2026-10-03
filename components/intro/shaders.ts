// GLSL for the intro globe. Written as GLSL 1 style; three.js upgrades it for WebGL 2.

const worldVaryings = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;
`

export const surfaceVertex = /* glsl */ `
  ${worldVaryings}
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPositionW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

// The planet also passes surface tangents (east and north), which a sphere gives us exactly
export const earthVertex = /* glsl */ `
  ${worldVaryings}
  varying vec3 vTangentW;
  varying vec3 vBitangentW;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPositionW = world.xyz;
    mat3 toWorld = mat3(modelMatrix);
    vNormalW = normalize(toWorld * normal);
    // Direction of increasing longitude (east); undefined at the poles, so fall back to any axis there
    vec3 tangent = vec3(normal.z, 0.0, -normal.x);
    float len = length(tangent);
    tangent = len > 1e-4 ? tangent / len : vec3(1.0, 0.0, 0.0);
    vTangentW = normalize(toWorld * tangent);
    vBitangentW = normalize(toWorld * cross(normal, tangent));
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const earthFragment = /* glsl */ `
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D bumpMap;
  uniform sampler2D oceanMap;
  uniform sampler2D cloudMap;
  uniform vec3 sunDirection;
  uniform float bumpScale;
  uniform vec2 bumpTexel;
  uniform float cloudOffset;
  uniform float nightAmbient;
  ${worldVaryings}
  varying vec3 vTangentW;
  varying vec3 vBitangentW;

  // Terrain relief: central differences of the elevation map in texture space, tilted along the
  // sphere's east/north directions. Smooth at any zoom (no screen-space derivative blockiness).
  vec3 perturbNormal(vec3 normal) {
    float west = texture2D(bumpMap, vUv - vec2(bumpTexel.x, 0.0)).r;
    float east = texture2D(bumpMap, vUv + vec2(bumpTexel.x, 0.0)).r;
    float south = texture2D(bumpMap, vUv - vec2(0.0, bumpTexel.y)).r;
    float north = texture2D(bumpMap, vUv + vec2(0.0, bumpTexel.y)).r;
    vec3 slope = (east - west) * normalize(vTangentW) + (north - south) * normalize(vBitangentW);
    return normalize(normal - bumpScale * slope);
  }

  void main() {
    vec3 normal = normalize(vNormalW);
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    float sunAmount = dot(normal, sunDirection);
    float daylight = smoothstep(-0.1, 0.25, sunAmount);

    vec3 relief = perturbNormal(normal);
    float diffuse = max(dot(relief, sunDirection), 0.0);

    vec3 day = texture2D(dayMap, vUv).rgb;
    float shadow = texture2D(cloudMap, vec2(vUv.x + cloudOffset, vUv.y)).r;
    day *= 1.0 - 0.4 * shadow * daylight;

    vec3 color = day * (diffuse * 1.15 + 0.015);
    // A little moonlight so the night side isn't pitch black
    color += day * nightAmbient * (1.0 - daylight);

    // Sun glint on water only
    float ocean = texture2D(oceanMap, vUv).r;
    vec3 halfway = normalize(sunDirection + viewDir);
    float facingSun = max(dot(normal, halfway), 0.0);
    color += vec3(1.0, 0.9, 0.72) * pow(facingSun, 320.0) * ocean * daylight * 0.5;
    color += vec3(0.25, 0.45, 0.75) * pow(facingSun, 24.0) * ocean * daylight * 0.04;

    // City lights fade in past the terminator (squared so only bright areas show)
    vec3 lights = texture2D(nightMap, vUv).rgb;
    float night = 1.0 - smoothstep(-0.25, 0.05, sunAmount);
    color += lights * lights * vec3(1.0, 0.8, 0.52) * night * 2.4;

    // Thin blue atmosphere on the lit limb
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    color += vec3(0.3, 0.56, 1.0) * fresnel * smoothstep(-0.3, 0.6, sunAmount) * 0.35;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`

export const cloudFragment = /* glsl */ `
  uniform sampler2D cloudMap;
  uniform vec3 sunDirection;
  uniform float opacity;
  ${worldVaryings}

  void main() {
    vec3 normal = normalize(vNormalW);
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    float density = smoothstep(0.12, 0.85, texture2D(cloudMap, vUv).r);
    float light = smoothstep(-0.15, 0.35, dot(normal, sunDirection));
    vec3 color = mix(vec3(0.05, 0.07, 0.12), vec3(1.0), light);
    // Fade toward the limb so the edge of the globe stays soft
    float facing = max(dot(normal, viewDir), 0.0);
    float alpha = density * smoothstep(0.0, 0.35, facing) * opacity * (0.3 + 0.7 * light);
    gl_FragColor = vec4(color, alpha);
    #include <colorspace_fragment>
  }
`

export const atmosphereFragment = /* glsl */ `
  uniform vec3 sunDirection;
  uniform vec3 glowColor;
  ${worldVaryings}

  void main() {
    // Rendered on the back faces of a slightly larger sphere: 0 at the outer edge of the halo,
    // rising toward the planet's limb (where the ray grazes the surface).
    float along = dot(normalize(vNormalW), normalize(vPositionW - cameraPosition));
    float rim = clamp(along / 0.26, 0.0, 1.0);
    // Bright on the sunlit limb, almost gone on the night side
    float sun = 0.05 + 0.95 * smoothstep(-0.3, 0.6, dot(normalize(vNormalW), sunDirection));
    gl_FragColor = vec4(glowColor * pow(rim, 2.6) * sun * 1.1, 1.0);
    #include <colorspace_fragment>
  }
`

export const starVertex = /* glsl */ `
  attribute float size;
  attribute float phase;
  uniform float time;
  uniform float pixelRatio;
  varying float vAlpha;
  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = size * pixelRatio;
    vAlpha = 0.6 + 0.4 * sin(time * (0.8 + phase * 0.25) + phase * 6.2831);
  }
`

export const starFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`
