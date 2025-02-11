// src/utils/flightMap.ts
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

interface Coordinates {
  lat: string;
  lng: string;
}

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

export const generateFlightMapUrl = (
  departure: Coordinates,
  arrival: Coordinates
): string => {
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
  
  const path = `color:0xFFBE40|weight:3|${departure.lat},${departure.lng}|${arrival.lat},${arrival.lng}`;
  
  const params = {
    size: "620x300",
    maptype: "roadmap",
    path: path,
    key: GOOGLE_MAPS_API_KEY,
  };

  const styleParams = customStyles.map(style => `style=${encodeURIComponent(style)}`).join("&");

  return `${baseUrl}?` + 
    Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&") + 
    `&${styleParams}`;
};