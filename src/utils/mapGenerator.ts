// src/utils/mapGenerator.ts
import type { FlightLeg } from '@/types/flight';



export const generateStaticMapURL = (legs: FlightLeg[]) => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";

  const customStyles = [
    "element:geometry|color:0x1d2c4d",
    "feature:landscape.natural|element:geometry|color:0x023e58",
    "feature:poi|element:geometry|color:0x283d6a",
    "feature:water|element:geometry|color:0x0e1626",
    "feature:administrative.country|element:labels.text.fill|color:0xffffff",
    "feature:administrative.country|element:geometry.stroke|color:0x4b6878",
    "element:labels.text.fill|color:0x8ec3b9",
    "element:labels.text.stroke|color:0x1a3646",
    "feature:road|visibility:off",
    "feature:road.highway|visibility:off",
    "feature:transit|visibility:off",
    "feature:poi|visibility:off"
  ];

  // Generate path for all legs
  const pathCoordinates = legs.reduce((acc: string[], leg, index) => {
    if (!leg.coordinates) return acc;
    
    const coords = `${leg.coordinates.departure.lat},${leg.coordinates.departure.lng}`;
    if (index === 0) acc.push(coords);
    
    acc.push(`${leg.coordinates.arrival.lat},${leg.coordinates.arrival.lng}`);
    return acc;
  }, []);

  const path = `color:0xFFBE40|weight:3|${pathCoordinates.join('|')}`;

  // Create URLSearchParams with initial parameters
  const params = new URLSearchParams();
  params.append('size', '620x300');
  params.append('maptype', 'roadmap');
  params.append('path', path);
  if (API_KEY) params.append('key', API_KEY);

  // Add custom styles
  customStyles.forEach(style => {
    params.append('style', style);
  });

  return `${baseUrl}?${params.toString()}`;
};