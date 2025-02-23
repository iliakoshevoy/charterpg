interface AircraftImageMapping {
  [key: string]: {
    interior: string;
    exterior: string;
  };
}

const aircraftImageMapping: AircraftImageMapping = {
  'CHALLENGER 605': {
    interior: '/aircraft-images/interior/CL605interior.jpg',
    exterior: ''
  },
  'CHALLENGER 650': {
    interior: '/aircraft-images/interior/CL605interior.jpg',
    exterior: ''
  },
  'CHALLENGER 604': {
    interior: '/aircraft-images/interior/CL605interior.jpg',
    exterior: ''
  },
'CHALLENGER 300': {
    interior: '/aircraft-images/interior/CL300interior.jpg',
    exterior: ''
  },
  'CHALLENGER 350': {
      interior: '/aircraft-images/interior/CL300interior.jpg',
      exterior: ''
    },
  'PHENOM 100': {
      interior: '/aircraft-images/interior/Phenom100interior.jpg',
      exterior: ''
    },
    'PHENOM 100E': {
        interior: '/aircraft-images/interior/Phenom100interior.jpg',
        exterior: ''
      },
      'PHENOM 100EV': {
          interior: '/aircraft-images/interior/Phenom100interior.jpg',
          exterior: ''
        },
        'PHENOM 100EX': {
            interior: '/aircraft-images/interior/Phenom100interior.jpg',
            exterior: ''
          },
          'PILATUS PC-24': {
              interior: '/aircraft-images/interior/PC-24interior.jpg',
              exterior: ''
            },
            'PILATUS PC-12': {
                interior: '/aircraft-images/interior/PC-12interior.jpg',
                exterior: ''
              },
              'PILATUS PC-12NGX': {
                  interior: '/aircraft-images/interior/PC-12NGXinterior.jpeg',
                  exterior: ''
                }
};

export const getAircraftImages = (modelName: string) => {
  return aircraftImageMapping[modelName] || null;
};

// Constants for image processing
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// New function to process and validate File objects
export async function processImageFile(file: File): Promise<string> {
  console.log('Processing image file:', {
    name: file.name,
    type: file.type,
    size: Math.round(file.size / 1024) + 'KB',
    lastModified: new Date(file.lastModified).toISOString()
  });

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`File size exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`);
  }

  // Validate mime type
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type. Accepted types: ${ACCEPTED_MIME_TYPES.join(', ')}`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64String = reader.result as string;
      console.log('File processed:', {
        resultLength: base64String.length,
        mimeType: base64String.split(',')[0],
        isBase64Valid: base64String.startsWith('data:image/')
      });
      resolve(base64String);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

// Modified version of existing imageUrlToBase64 function
export async function imageUrlToBase64(url: string): Promise<string> {
  try {
    console.log('Processing URL:', url);
    
    // Handle local paths
    if (url.startsWith('/')) {
      const fullUrl = `${window.location.origin}${url}`;
      console.log('Converting local path to full URL:', fullUrl);
      url = fullUrl;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    console.log('Image blob:', {
      size: Math.round(blob.size / 1024) + 'KB',
      type: blob.type
    });

    // Validate blob
    if (blob.size > MAX_IMAGE_SIZE) {
      throw new Error(`Image size exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)}MB limit`);
    }

    if (!ACCEPTED_MIME_TYPES.includes(blob.type)) {
      throw new Error(`Invalid image type. Accepted types: ${ACCEPTED_MIME_TYPES.join(', ')}`);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        console.log('URL conversion complete:', {
          resultLength: base64String.length,
          mimeType: base64String.split(',')[0],
          isBase64Valid: base64String.startsWith('data:image/')
        });
        resolve(base64String);
      };
      reader.onerror = (error) => {
        console.error('Error converting blob to base64:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error processing image URL:', error);
    throw error;
  }
}

// Utility function to normalize image data
export function normalizeImageData(imageData: string): string {
  try {
    // Check if it's already a valid base64 image
    if (imageData.startsWith('data:image/')) {
      return imageData;
    }

    // If it's a raw base64 string, add proper prefix
    if (imageData.match(/^[A-Za-z0-9+/=]+$/)) {
      return `data:image/jpeg;base64,${imageData}`;
    }

    throw new Error('Invalid image data format');
  } catch (error) {
    console.error('Error normalizing image data:', error);
    throw error;
  }
}