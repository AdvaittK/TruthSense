const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

async function generateFavicons() {
  const publicDir = path.join(__dirname, 'public');
  const svgPath = path.join(publicDir, 'favicon.svg');
  
  console.log('Public directory:', publicDir);
  console.log('SVG path:', svgPath);
  
  try {
    // Read the SVG file
    console.log('Reading SVG file...');
    const svgBuffer = await fs.readFile(svgPath);
    
    // Create favicon.ico (16x16, 32x32, 48x48)
    await sharp(svgBuffer)
      .resize(16, 16)
      .toFile(path.join(publicDir, 'favicon-16x16.png'));
    
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    
    await sharp(svgBuffer)
      .resize(48, 48)
      .toFile(path.join(publicDir, 'favicon-48x48.png'));
    
    // Create apple-touch-icon (180x180)
    await sharp(svgBuffer)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    
    // Create larger icons for PWA
    await sharp(svgBuffer)
      .resize(192, 192)
      .toFile(path.join(publicDir, 'icon-192x192.png'));
    
    await sharp(svgBuffer)
      .resize(512, 512)
      .toFile(path.join(publicDir, 'icon-512x512.png'));
      
    console.log('All favicon images generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();
