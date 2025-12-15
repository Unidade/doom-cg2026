#version 120

uniform float uTime;        // tempo em segundos
uniform float uPulseSpeed;   // velocidade da pulsação
uniform float uGlowIntensity; // intensidade do brilho

varying vec2 vTexCoord;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewDir;

void main()
{
    // calcula a distância do centro para criar efeito radial
    float dist = length(vPosition.xy);
    float dist3D = length(vPosition);

    // múltiplas ondas de pulsação para efeito mais interessante e complexo
    float pulse1 = sin(uTime * uPulseSpeed);
    float pulse2 = sin(uTime * uPulseSpeed * 1.5 + 1.0);
    float pulse3 = cos(uTime * uPulseSpeed * 0.8);
    float pulse4 = sin(uTime * uPulseSpeed * 2.2 + 2.5);
    
    // combina as pulsações com pesos diferentes
    float combinedPulse = (pulse1 * 0.4 + pulse2 * 0.3 + pulse3 * 0.2 + pulse4 * 0.1);
    float pulse = combinedPulse * 0.5 + 0.5; // normaliza para 0.0 a 1.0

    // padrão de energia radial (como ondas de energia)
    float energyWaves = sin(dist3D * 8.0 - uTime * uPulseSpeed * 2.0) * 0.5 + 0.5;
    energyWaves = pow(energyWaves, 2.0); // torna mais suave

    // padrão de scan lines (linhas de energia)
    float scanLines = sin(vPosition.y * 15.0 + uTime * uPulseSpeed * 3.0) * 0.5 + 0.5;
    scanLines = pow(scanLines, 4.0); // linhas mais finas e brilhantes

    // transição de cor baseada no tempo (verde -> amarelo -> laranja -> vermelho)
    float colorShift1 = sin(uTime * 0.8) * 0.5 + 0.5;
    float colorShift2 = sin(uTime * 0.6 + 1.5) * 0.5 + 0.5;
    
    vec3 color1 = vec3(0.2, 0.8, 0.3);   // verde
    vec3 color2 = vec3(0.9, 0.7, 0.2);   // amarelo/laranja
    vec3 color3 = vec3(0.9, 0.3, 0.1);    // laranja/vermelho
    
    vec3 dynamicColor = mix(color1, color2, colorShift1 * 0.5);
    dynamicColor = mix(dynamicColor, color3, colorShift2 * 0.3);

    // efeito de fresnel (brilho nas bordas baseado no ângulo de visão)
    float fresnel = 1.0 - abs(dot(normalize(vNormal), normalize(vViewDir)));
    fresnel = pow(fresnel, 2.0); // torna o efeito mais pronunciado nas bordas

    // brilho baseado na pulsação
    float glow = pulse * uGlowIntensity;
    
    // brilho mais intenso nas bordas (efeito de energia)
    float edgeGlow = 1.0 - smoothstep(0.2, 0.8, dist);
    edgeGlow = pow(edgeGlow, 1.5);
    glow += edgeGlow * 0.6;
    
    // adiciona fresnel ao brilho
    glow += fresnel * 0.4;
    
    // adiciona padrões de energia
    glow += energyWaves * 0.3 * pulse;
    glow += scanLines * 0.2 * pulse;

    // cor base com brilho
    vec3 finalColor = dynamicColor * (1.0 + glow * 0.8);

    // adiciona um brilho branco/amarelo nas áreas mais brilhantes
    vec3 highlightColor = vec3(1.0, 1.0, 0.7);
    float highlightIntensity = glow * fresnel * 0.5;
    finalColor = mix(finalColor, highlightColor, highlightIntensity);

    // efeito de "aura" externa (brilho suave ao redor)
    float aura = 1.0 - smoothstep(0.5, 1.2, dist);
    aura = pow(aura, 3.0);
    vec3 auraColor = vec3(0.3, 0.9, 0.5) * pulse;
    finalColor += auraColor * aura * 0.3;

    // adiciona um leve efeito de "energia elétrica" nas bordas
    float electric = sin(dist * 20.0 + uTime * uPulseSpeed * 5.0) * 0.5 + 0.5;
    electric = pow(electric, 8.0); // linhas muito finas
    electric *= edgeGlow;
    finalColor += vec3(1.0, 1.0, 0.9) * electric * 0.4;

    // garante que as cores não ultrapassem 1.0
    finalColor = clamp(finalColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
}
