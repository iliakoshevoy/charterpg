// utils/imageCompression.ts
export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
              reject(new Error('Could not create canvas context'));
              return;
          }

          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200; // Max width or height

          if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                  height = height * (maxDimension / width);
                  width = maxDimension;
              } else {
                  width = width * (maxDimension / height);
                  height = maxDimension;
              }
          }

          canvas.width = width;
          canvas.height = height;

          // Ensure PNG transparency is maintained
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const quality = outputType === 'image/png' ? 1.0 : 0.7; // PNG does not need compression

          canvas.toBlob(
              (blob) => {
                  if (blob) {
                      const compressedFile = new File([blob], file.name, {
                          type: outputType,
                          lastModified: Date.now(),
                      });
                      resolve(compressedFile);
                  } else {
                      reject(new Error('Blob creation failed'));
                  }
              },
              outputType,
              quality
          );
      };

      img.onerror = (error) => reject(error);
  });
};