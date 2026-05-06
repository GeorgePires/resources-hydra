// HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII ⎛⎝ ≽ > ⩊ < ≼ ⎠⎞

a.show()
a.setBins(4)
a.setSmooth(0.5)

// SET IMG: /pixel-code.png OR /pixel-gpires.png
s1.initImage("https://raw.githubusercontent.com/GeorgePires/resources-hydra/refs/heads/main/pixel-code.png")

setFunction({ 
  name: 'lumaSlice',
  type: 'coord',
  inputs: [
    { name: 'sourceTex', type: 'sampler2D', default: NaN },    
    { name: 'pixelRes', type: 'float', default: '20' },
    { name: 'levels', type: 'float', default: '4' },    
  ],
  glsl: `
    float invLevels = 1.0 / levels;
    
    // pixel grid
    vec2 pixelCoord = floor(_st * pixelRes) + 0.5;
    vec2 pixelUV = pixelCoord / pixelRes;
    vec4 colorSample = texture2D(sourceTex, pixelUV);

    // luminância quantizada
    float luma = _luminance(colorSample.rgb);
    float lumaQuant = floor(luma * levels) * invLevels;

    // coordenada
    vec2 localUV = fract(_st * pixelRes);
    localUV.x *= invLevels;

    // deslocamento baseado na luminância
    localUV.x += lumaQuant;
    
    return localUV;
  `
})

osc(10, 0.1, 0.1)
  .modulate(noise(4), 0.5)
  .rotate(() => a.fft[2] * 0.5)
  .out(o1)


src(s1)
  .lumaSlice(o1, () => a.fft[1] * 30 + 20, 7) 
  .scale(() => 1 - (a.fft[0] * 0.4)) 
  .colorama(() => a.fft[1] * 0.5)
  .hue(() => time * 0.1 + a.fft[2]) 
  .color(0, 1, 0.2)
  .brightness(() => a.fft[1] * 0.2)
  .contrast(1.4)
  .out(o2)

render(o2)
