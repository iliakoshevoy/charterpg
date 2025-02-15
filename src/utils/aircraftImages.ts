// utils/aircraftImages.ts
interface AircraftImageMapping {
    [key: string]: {
      interior: string;
      exterior: string;
    };
  }
  
  const aircraftImageMapping: AircraftImageMapping = {
    'CHALLENGER 605': {
      interior: '/aircraft-images/interior/CL605interior.png',
      exterior: '/aircraft-images/exterior/CL605exterior.png'
    },
    'CHALLENGER 650': {
      interior: '/aircraft-images/interior/CL605interior.png',
      exterior: '/aircraft-images/exterior/CL605exterior.png'
    },
    'CHALLENGER 604': {
      interior: '/aircraft-images/interior/CL605interior.png',
      exterior: '/aircraft-images/exterior/CL605exterior.png'
    }
  };
  
  export const getAircraftImages = (modelName: string) => {
    return aircraftImageMapping[modelName] || null;
  };
  
  // utils/aircraftImages.ts
export async function imageUrlToBase64(url: string): Promise<string> {
    try {
      console.log('Original URL:', url);
      // If the URL starts with '/', it's a local path
      if (url.startsWith('/')) {
        const fullUrl = `${window.location.origin}${url}`;
        console.log('Full URL:', fullUrl);
        url = fullUrl;
      }
  
      console.log('Fetching image from:', url);
      const response = await fetch(url);
      console.log('Fetch response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Blob size:', blob.size);
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          console.log('Base64 string length:', base64String.length);
          resolve(base64String);
        };
        reader.onerror = (error) => {
          console.error('FileReader error:', error);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }