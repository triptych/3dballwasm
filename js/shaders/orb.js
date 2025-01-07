export const orbVertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const orbFragmentShader = `
uniform float time;
uniform vec3 color1;
uniform vec3 color2;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    // Create a fresnel effect
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnelTerm = 1.0 - max(dot(viewDirection, vNormal), 0.0);
    fresnelTerm = pow(fresnelTerm, 3.0);

    // Create moving patterns using noise-like effects
    float pattern = sin(vUv.x * 10.0 + time * 0.5) * cos(vUv.y * 10.0 + time * 0.3);
    pattern += sin(vUv.x * 20.0 - time * 0.2) * cos(vUv.y * 20.0 + time * 0.4) * 0.5;
    pattern = pattern * 0.5 + 0.5; // Normalize to 0-1 range

    // Mix colors based on pattern and fresnel
    vec3 finalColor = mix(color1, color2, pattern);
    finalColor = mix(finalColor, vec3(1.0), fresnelTerm * 0.7);

    // Add pulsing glow
    float pulse = sin(time * 0.5) * 0.5 + 0.5;
    finalColor *= 1.0 + pulse * 0.2;

    gl_FragColor = vec4(finalColor, 0.9);
}
`;
