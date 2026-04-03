const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SRC_DIR = path.resolve('..');
const DEST_DIR = path.resolve('public/photos');

const photosToProcess = [
  // Braga
  { src: 'braga 060126/1000000484.jpg', dest: 'braga/photo1.webp' },
  { src: 'braga 060126/1000000490.jpg', dest: 'braga/photo2.webp' },
  { src: 'braga 060126/1000000499.jpg', dest: 'braga/photo3.webp' },
  // Discord
  { src: 'dc/WhatsApp Image 2026-01-16 at 17.23.27.jpeg', dest: 'discord/photo1.webp' },
  { src: 'dc/WhatsApp Image 2026-01-16 at 17.24.22.jpeg', dest: 'discord/photo2.webp' },
  { src: 'dc/WhatsApp Image 2026-01-16 at 22.38.05.jpeg', dest: 'discord/photo3.webp' },
  // BXC
  { src: 'bxc 250226/WhatsApp Image 2026-03-01 at 23.19.22.jpeg', dest: 'bxc/photo1.webp' },
  { src: 'bxc 250226/WhatsApp Image 2026-03-01 at 23.19.25.jpeg', dest: 'bxc/photo2.webp' },
  { src: 'bxc 250226/WhatsApp Image 2026-03-01 at 23.19.27.jpeg', dest: 'bxc/photo3.webp' },
  { src: 'bxc 250226/WhatsApp Image 2026-03-01 at 23.19.36.jpeg', dest: 'bxc/photo4.webp' },
  // Paskal 01
  { src: 'paskal 010326/WhatsApp Image 2026-03-01 at 23.01.34.jpeg', dest: 'paskal-01/photo1.webp' },
  { src: 'paskal 010326/WhatsApp Image 2026-03-01 at 23.01.37 (3).jpeg', dest: 'paskal-01/photo2.webp' },
  { src: 'paskal 010326/WhatsApp Image 2026-03-01 at 23.01.40 (3).jpeg', dest: 'paskal-01/photo3.webp' },
  // Fore
  { src: 'fore 030326/WIN_20260303_19_19_50_Pro.jpg', dest: 'fore/photo1.webp' },
  { src: 'fore 030326/WIN_20260303_19_21_15_Pro.jpg', dest: 'fore/photo2.webp' },
  { src: 'fore 030326/WIN_20260303_19_21_30_Pro.jpg', dest: 'fore/photo3.webp' },
  // Sugu
  { src: 'sugu 030326/IMG_20260303_155340_240.jpg', dest: 'sugu/photo1.webp' },
  { src: 'sugu 030326/IMG_20260303_155353_229.jpg', dest: 'sugu/photo2.webp' },
  { src: 'sugu 030326/WIN_20260303_15_32_38_Pro.jpg', dest: 'sugu/photo3.webp' },
  // Paskal 10
  { src: 'paskal 100326/selfie-time-1773145246150.jpg', dest: 'paskal-10/photo1.webp' },
  { src: 'paskal 100326/selfie-time-1773145266259.jpg', dest: 'paskal-10/photo2.webp' },
  { src: 'paskal 100326/selfie-time-1773145296406.jpg', dest: 'paskal-10/photo3.webp' },
  { src: 'paskal 100326/selfie-time-edited_files_1773145982468.jpg', dest: 'paskal-10/photo4.webp' },
  { src: 'paskal 100326/IMG20260310195233.jpg', dest: 'paskal-10/photo5.webp' },
  // Kopitera
  { src: 'kopitera 230326/IMG_20260323_215148_235.jpg', dest: 'kopitera/photo1.webp' },
  { src: 'kopitera 230326/IMG_20260323_215436_272.jpg', dest: 'kopitera/photo2.webp' },
  { src: 'kopitera 230326/IMG_20260323_215722_177.jpg', dest: 'kopitera/photo3.webp' }
];

async function processPhotos() {
  console.log('Starting photo optimization...');
  
  for (const photo of photosToProcess) {
    const srcPath = path.join(SRC_DIR, photo.src);
    const destPath = path.join(DEST_DIR, photo.dest);
    
    // Create destination directory if it doesn't exist
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    if (fs.existsSync(srcPath)) {
      try {
        await sharp(srcPath)
          .resize(600, 600, { fit: 'cover', position: 'attention' })
          .webp({ quality: 80 })
          .toFile(destPath);
        console.log(`✅ Processed: ${photo.dest}`);
      } catch (err) {
        console.error(`❌ Error processing ${photo.src}:`, err.message);
      }
    } else {
      console.warn(`⚠️ Source file not found: ${srcPath}`);
    }
  }
  
  // Copy audio
  const audioSrc = path.join(SRC_DIR, 'videoplayback.m4a');
  const audioDestDir = path.join(DEST_DIR, '../audio');
  const audioDest = path.join(audioDestDir, 'birthday-song.m4a');
  
  if (!fs.existsSync(audioDestDir)) {
    fs.mkdirSync(audioDestDir, { recursive: true });
  }
  
  if (fs.existsSync(audioSrc)) {
    fs.copyFileSync(audioSrc, audioDest);
    console.log(`✅ Copied audio: birthday-song.m4a`);
  } else {
    console.warn(`⚠️ Source audio not found: ${audioSrc}`);
  }
  
  console.log('Done.');
}

processPhotos();
