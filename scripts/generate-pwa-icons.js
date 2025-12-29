const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generatePWAIcons() {
  const logoPath = path.join(__dirname, '..', 'public', 'verible-logo.png');
  const publicDir = path.join(__dirname, '..', 'public');

  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error('Logo file not found at:', logoPath);
    return;
  }

  try {
    // Generate 192x192 icon
    await sharp(logoPath)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 29, g: 41, b: 115, alpha: 1 } // #1D2973 background
      })
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));

    console.log('Generated icon-192.png');

    // Generate 512x512 icon
    await sharp(logoPath)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 29, g: 41, b: 115, alpha: 1 } // #1D2973 background
      })
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    console.log('Generated icon-512.png');

    // Generate Apple touch icon (180x180)
    await sharp(logoPath)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 29, g: 41, b: 115, alpha: 1 } // #1D2973 background
      })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    console.log('Generated apple-touch-icon.png');

    console.log('All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generatePWAIcons();
