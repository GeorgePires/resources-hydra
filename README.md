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
   
    - <div align="center">

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
