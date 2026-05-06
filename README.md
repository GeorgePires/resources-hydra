# resources-hydra

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
- Quantizing luminance into discrete levels
- Remapping horizontal UV coordinates based on brightness

**Result:**
A dynamic "slice" or "banding" effect where brighter areas shift differently than darker ones, commonly used in glitch aesthetics and live visuals.
