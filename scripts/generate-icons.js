const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    // Ensure icons directory exists
    const iconsDir = path.join(__dirname, '..', 'icons');
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Generate main icon in different sizes
    for (const size of sizes) {
      await sharp(path.join(iconsDir, 'icon.svg'))
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`Generated icon-${size}x${size}.png`);
    }

    // Generate add icon
    await sharp(path.join(iconsDir, 'add.svg'))
      .resize(96, 96)
      .png()
      .toFile(path.join(iconsDir, 'add-96x96.png'));
    console.log('Generated add-96x96.png');

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 