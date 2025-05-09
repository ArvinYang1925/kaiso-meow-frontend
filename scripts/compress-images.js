import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

const files = await imagemin(['./images/*.{jpg,png}'], {
  destination: './compressed',
  plugins: [
    imageminMozjpeg({ quality: 60 }),       // 壓縮 jpg
    imageminPngquant({ quality: [0.5, 0.6] }) // 壓縮 png
  ]
});

console.log('Images compressed:', files);
