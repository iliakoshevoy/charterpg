// proposalConfig.ts

export const pdfConfig = {
  // Page titles and headers
  titles: {
    main: "Charter Proposal",
    flightDetails: "Flight Details",
    flightRoute: "Flight Route",
    legPrefix: "Leg", // Will be combined with number
    optionPrefix: "Option", // Will be combined with number
  },

  // Field labels
  labels: {
    customerPrefix: "Prepared for:",
    passengers: "Number of Passengers:",
    departureDate: "Departure Date:",
    departureTime: "Departure Time:",
    route: "Route:",
    comments: "Additional Comments:",
    
    // Aircraft option labels
    aircraftType: "Aircraft Type:",
    yearManufacture: "Year of Manufacture:",
    price: "Price:",
    passengerCapacity: "Passenger Capacity:",
    notes: "Notes:",
    cabinDimensions: "Cabin Dimensions:",
    baggageVolume: "Baggage Volume:"
  },

  // Footer text
  footer: {
    prefix: "Private Jet Charter Proposal •"
  }
};