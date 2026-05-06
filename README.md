<div align="center">

# ⎛⎝ ≽ > ⩊ < ≼ ⎠⎞ resources-hydra

**Live Coding Visual · Pixel Sorting · Audio Reactive · GLSL Custom Shader**

[![Hydra](https://img.shields.io/badge/built%20with-Hydra%20Synth-ff00cc?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHoiLz48L3N2Zz4=)](https://hydra.ojack.xyz)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GLSL](https://img.shields.io/badge/GLSL-Shader-00ffaa?style=for-the-badge)](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

> *A custom Hydra visual experiment combining real-time audio analysis, pixel sorting and luminance-based UV remapping via a hand-written GLSL shader.*
>
> <br/>

🔴 **[▶ Open live demo in Hydra](https://hydra.ojack.xyz/?code=...)** &nbsp;|&nbsp; 📁 **[Browse source](https://github.com/GeorgePires/resources-hydra)**

</div>

---

### 🖼️ Image Source

```js
s1.initImage("https://raw.githubusercontent.com/.../pixel-code.png")
```

A pixel art image is loaded as the input texture (`s1`). The project includes two image options: `pixel-code.png` and `pixel-gpires.png`.

---

### ✨ The `lumaSlice` Shader — Core of the Project

```js
setFunction({
  name: 'lumaSlice',
  type: 'coord',       // coordinate-type shader (UV remapping)
  inputs: [
    { name: 'sourceTex', type: 'sampler2D' },            // reference texture for luminance
    { name: 'pixelRes',  type: 'float', default: '20' }, // pixel grid resolution
    { name: 'levels',    type: 'float', default: '4'  }, // number of brightness steps
  ],
  glsl: `...`
})
```

**What the GLSL does, step by step:**

| Step | Operation | Visual result |
|------|-----------|---------------|
| **1. Pixelation** | `floor(_st * pixelRes) + 0.5` | Snaps UVs to a grid → pixelated look |
| **2. Sampling** | `texture2D(sourceTex, pixelUV)` | Reads the color of each grid cell |
| **3. Luminance** | `_luminance(colorSample.rgb)` | Converts RGB → brightness value (0.0–1.0) |
| **4. Quantization** | `floor(luma * levels) * invLevels` | Reduces brightness to `N` discrete steps |
| **5. Local UV** | `fract(_st * pixelRes)` | Coordinates inside each cell |
| **6. Slice** | `localUV.x += lumaQuant` | Shifts X by brightness → sorting effect |

The result is that **brighter pixels are horizontally offset** relative to darker ones, creating a glitchy pixel sorting effect.

```glsl
// Inverse of levels/used to normalize quantization steps
float invLevels = 1.0 / levels;

// --- Pixelation step ---
// Snap UV coordinates to a grid to create a pixelated look
vec2 pixelCoord = floor(_st * pixelRes) + 0.5;
vec2 pixelUV = pixelCoord / pixelRes;

// Sample color from the pixelated UV
vec4 colorSample = texture2D(sourceTex, pixelUV);

// --- Luminance quantization ---
// Convert RGB to luminance
float luma = _luminance(colorSample.rgb);

// Reduce luminance to discrete steps
float lumaQuant = floor(luma * levels) * invLevels;

// --- Local UV space ---
// Get repeating local coordinates inside each pixel cell
vec2 localUV = fract(_st * pixelRes);

// Compress X axis based on number of levels
localUV.x *= invLevels;

// --- Luminance-based horizontal shift ---
// Offset X coordinate according to quantized luminance
// This creates the "slice/sorting" visual effect
localUV.x += lumaQuant;

return localUV;
```

---

### 🌊 Background — Modulated Oscillator

```js
osc(10, 0.1, 0.1)
  .modulate(noise(2), 0.5)      // distorts with organic noise
  .rotate(() => a.fft[2] * 0.5) // rotation reactive to mid-high (fft[2])
  .out(o1)                       // output to buffer o1
```

A sine wave oscillator serves as a dynamic background texture in buffer `o1`, used as the input for the `lumaSlice` shader.

---

### 🎨 Final Visual Pipeline

```js
src(s1)                                          // 1. source: pixel art image
  .lumaSlice(o1, () => a.fft[1] * 10 + 35, 7)   // 2. pixel sorting reactive to mid (fft[1])
  .scale(() => 1 - (a.fft[3] * 0.2))            // 3. zoom reactive to high (fft[3])
  .colorama(() => a.fft[1] * 0.5)               // 4. reactive palette rotation
  .hue(() => time * 0.3 + a.fft[2])             // 5. continuous hue shift
  .color(2, 1, 2)                                // 6. boost R and B channels (magenta tone)
  .brightness(() => a.fft[2] * 0.1)             // 7. pulsing brightness
  .contrast(1.4)                                 // 8. elevated contrast for impact
  .out(o2)                                       // 9. renders to o2

render(o2)
```

---

### Luma-based UV Slice (Pixel Sorting Effect)

```glsl
// Inverse of levels/used to normalize quantization steps
float invLevels = 1.0 / levels;

// --- Pixelation step ---
// Snap UV coordinates to a grid to create a pixelated look
vec2 pixelCoord = floor(_st * pixelRes) + 0.5;
vec2 pixelUV = pixelCoord / pixelRes;

// Sample color from the pixelated UV
vec4 colorSample = texture2D(sourceTex, pixelUV);

// --- Luminance quantization ---
// Convert RGB to luminance
float luma = _luminance(colorSample.rgb);

// Reduce luminance to discrete steps
float lumaQuant = floor(luma * levels) * invLevels;

// --- Local UV space ---
// Get repeating local coordinates inside each pixel cell
vec2 localUV = fract(_st * pixelRes);

// Compress X axis based on number of levels
localUV.x *= invLevels;

// --- Luminance-based horizontal shift ---
// Offset X coordinate according to quantized luminance
// This creates the "slice/sorting" visual effect
localUV.x += lumaQuant;

return localUV;
```

**Description:**
This function creates a pixel-sorted visual effect by:
- Pixelating the input texture
- - Quantizing luminance into discrete levels
  - - Remapping horizontal UV coordinates based on brightness
