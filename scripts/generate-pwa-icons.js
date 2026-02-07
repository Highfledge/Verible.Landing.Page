/**
 * PWA Icon Generator for Verible
 * 
 * Resizes the verible-logo.png into all required PWA icon sizes.
 * Run: node scripts/generate-pwa-icons.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SOURCE_ICON = path.join(__dirname, "..", "public", "verible-logo.png");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "icons");

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const MASKABLE_SIZES = [192, 512];

// Verible brand color for maskable icon background
const BRAND_BG = { r: 255, g: 255, b: 255, alpha: 1 }; // white bg to match logo

async function generateIcons() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Source icon: ${SOURCE_ICON}`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  // Generate regular icons (resized to fit, transparent background preserved)
  for (const size of ICON_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(SOURCE_ICON)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // transparent bg
      })
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-${size}x${size}.png`);
  }

  // Generate maskable icons (with safe zone padding and solid background)
  // Maskable icons need ~10% safe zone padding on each side
  for (const size of MASKABLE_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-maskable-${size}x${size}.png`);
    const innerSize = Math.round(size * 0.8); // 80% of size for safe zone

    // Create the resized logo
    const resizedLogo = await sharp(SOURCE_ICON)
      .resize(innerSize, innerSize, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toBuffer();

    // Composite onto a solid background with padding
    const padding = Math.round((size - innerSize) / 2);
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BRAND_BG,
      },
    })
      .composite([
        {
          input: resizedLogo,
          top: padding,
          left: padding,
        },
      ])
      .png()
      .toFile(outputPath);
    console.log(`Generated: icon-maskable-${size}x${size}.png`);
  }

  // Generate favicon (32x32) 
  const faviconPath = path.join(__dirname, "..", "public", "favicon.png");
  await sharp(SOURCE_ICON)
    .resize(32, 32, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(faviconPath);
  console.log("Generated: favicon.png");

  // Generate apple-touch-icon (180x180)
  const appleTouchPath = path.join(OUTPUT_DIR, "apple-touch-icon.png");
  await sharp(SOURCE_ICON)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(appleTouchPath);
  console.log("Generated: apple-touch-icon.png");

  console.log("\nAll PWA icons generated successfully!");
}

generateIcons().catch((err) => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
