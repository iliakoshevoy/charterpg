// src/data/aircraftData.ts

export interface AircraftModel {
    id: string;
    model: string;
    cabinWidth: string | null;
    cabinHeight: string | null;
    baggageVolume: string | null;
    passengerCapacity: string;
  }
  
  function createAircraftId(model: string): string {
    return model
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .trim();
  }
  
  export const aircraftModels: AircraftModel[] = [
    {
      id: createAircraftId("AIRBUS ACJ TWOTWENTY"),
      model: "AIRBUS ACJ TWOTWENTY",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("AIRBUS ACJ318"),
      model: "AIRBUS ACJ318",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("AIRBUS ACJ319"),
      model: "AIRBUS ACJ319",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("AIRBUS ACJ319neo"),
      model: "AIRBUS ACJ319neo",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("AIRBUS ACJ320"),
      model: "AIRBUS ACJ320",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("AIRBUS ACJ320neo"),
      model: "AIRBUS ACJ320neo",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("AIRBUS ACJ330"),
      model: "AIRBUS ACJ330",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("BOEING BBJ"),
      model: "BOEING BBJ",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("BOEING BBJ MAX 8"),
      model: "BOEING BBJ MAX 8",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("BOEING BBJ2"),
      model: "BOEING BBJ2",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("BOEING BBJ3"),
      model: "BOEING BBJ3",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("BOEING BBJ747-8"),
      model: "BOEING BBJ747-8",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("BOEING BBJ787-8"),
      model: "BOEING BBJ787-8",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("BOEING BBJ787-9"),
      model: "BOEING BBJ787-9",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("EMBRAER LINEAGE 1000"),
      model: "EMBRAER LINEAGE 1000",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("EMBRAER LINEAGE 1000E"),
      model: "EMBRAER LINEAGE 1000E",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("SUKHOI SBJ"),
      model: "SUKHOI SBJ",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("DORNIER ENVOY 3"),
      model: "DORNIER ENVOY 3",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "20"
    },
    {
      id: createAircraftId("CHALLENGER 601-1A"),
      model: "CHALLENGER 601-1A",
      cabinWidth: "2.44m",
      cabinHeight: "1.83m",
      baggageVolume: "3.26m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 601-3A"),
      model: "CHALLENGER 601-3A",
      cabinWidth: "2.44m",
      cabinHeight: "1.83m",
      baggageVolume: "3.26m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 601-3R"),
      model: "CHALLENGER 601-3R",
      cabinWidth: "2.44m",
      cabinHeight: "1.83m",
      baggageVolume: "3.26m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 604"),
      model: "CHALLENGER 604",
      cabinWidth: "2.41m",
      cabinHeight: "1.83m",
      baggageVolume: "3.25m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 605"),
      model: "CHALLENGER 605",
      cabinWidth: "2.41m",
      cabinHeight: "1.83m",
      baggageVolume: "3.22m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 650"),
      model: "CHALLENGER 650",
      cabinWidth: "2.41m",
      cabinHeight: "1.83m",
      baggageVolume: "3.20m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 800"),
      model: "CHALLENGER 800",
      cabinWidth: "2.40m",
      cabinHeight: "2.07m",
      baggageVolume: "5.72m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 850"),
      model: "CHALLENGER 850",
      cabinWidth: "2.50m",
      cabinHeight: "1.86m",
      baggageVolume: "5.72m³",
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("CHALLENGER 870"),
      model: "CHALLENGER 870",
      cabinWidth: null,
      cabinHeight: null,
      baggageVolume: null,
      passengerCapacity: "9-12"
    },
    {
      id: createAircraftId("FALCON 2000"),
      model: "FALCON 2000",
      cabinWidth: "2.34m",
      cabinHeight: "1.88m",
      baggageVolume: "3.70m³",
      passengerCapacity: "8-10"
    },
    {
      id: createAircraftId("FALCON 2000DX"),
      model: "FALCON 2000DX",
      cabinWidth: "2.34m",
      cabinHeight: "1.88m",
      baggageVolume: "3.70m³",
      passengerCapacity: "8-10"
    },
    {
      id: createAircraftId("FALCON 2000EX"),
      model: "FALCON 2000EX",
      cabinWidth: "2.34m",
      cabinHeight: "1.88m",
      baggageVolume: "3.70m³",
      passengerCapacity: "8-10"
    },
    {
      id: createAircraftId("FALCON 2000EX EASy"),
      model: "FALCON 2000EX EASy",
      cabinWidth: "2.34m",
      cabinHeight: "1.88m",
      baggageVolume: "3.70m³",
      passengerCapacity: "8-10"
    },
    {
      id: createAircraftId("FALCON 2000LX"),
      model: "FALCON 2000LX",
      cabinWidth: "2.34m",
      cabinHeight: "1.88m",
      baggageVolume: "3.70m³",
      passengerCapacity: "8-10"
    },
    {
      id: createAircraftId("FALCON 2000LXS"),
      model: "FALCON 2000LXS",
      cabinWidth: "2.34m",
      cabinHeight: "1.88m",
      baggageVolume: "3.70m³",
      passengerCapacity: "8-10"
    },
    {
      id: createAircraftId("FALCON 2000S"),
      model: "FALCON 2000S",
      cabinWidth: "2.34m",
      cabinHeight: "1.88m",
      baggageVolume: "3.70m³",
      passengerCapacity: "8-10"
    },
    {
        id: createAircraftId("EMBRAER LEGACY 600"),
        model: "EMBRAER LEGACY 600",
        cabinWidth: "2.10m",
        cabinHeight: "1.82m",
        baggageVolume: "8.10m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("EMBRAER LEGACY 650"),
        model: "EMBRAER LEGACY 650",
        cabinWidth: "2.10m",
        cabinHeight: "1.82m",
        baggageVolume: "8.10m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("EMBRAER LEGACY 650E"),
        model: "EMBRAER LEGACY 650E",
        cabinWidth: "2.10m",
        cabinHeight: "1.82m",
        baggageVolume: "8.10m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("EMBRAER LEGACY SHUTTLE"),
        model: "EMBRAER LEGACY SHUTTLE",
        cabinWidth: null,
        cabinHeight: null,
        baggageVolume: null,
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G-II"),
        model: "GULFSTREAM G-II",
        cabinWidth: null,
        cabinHeight: null,
        baggageVolume: null,
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G-IIB"),
        model: "GULFSTREAM G-IIB",
        cabinWidth: null,
        cabinHeight: null,
        baggageVolume: null,
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G-III"),
        model: "GULFSTREAM G-III",
        cabinWidth: null,
        cabinHeight: null,
        baggageVolume: null,
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G300"),
        model: "GULFSTREAM G300",
        cabinWidth: null,
        cabinHeight: null,
        baggageVolume: null,
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G350"),
        model: "GULFSTREAM G350",
        cabinWidth: null,
        cabinHeight: null,
        baggageVolume: null,
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GLOBAL 5000"),
        model: "GLOBAL 5000",
        cabinWidth: "2.41m",
        cabinHeight: "1.88m",
        baggageVolume: "5.52m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GLOBAL 5500"),
        model: "GLOBAL 5500",
        cabinWidth: "2.41m",
        cabinHeight: "1.88m",
        baggageVolume: "9.2m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 6X"),
        model: "FALCON 6X",
        cabinWidth: "2.58m",
        cabinHeight: "1.98m",
        baggageVolume: "4.40m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 7X"),
        model: "FALCON 7X",
        cabinWidth: "2.34m",
        cabinHeight: "1.88m",
        baggageVolume: "2.80m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 900"),
        model: "FALCON 900",
        cabinWidth: "2.34m",
        cabinHeight: "1.88m",
        baggageVolume: "3.60m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 900C"),
        model: "FALCON 900C",
        cabinWidth: "2.34m",
        cabinHeight: "1.88m",
        baggageVolume: "3.60m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 900DX"),
        model: "FALCON 900DX",
        cabinWidth: "2.37m",
        cabinHeight: "1.90m",
        baggageVolume: "3.60m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 900EX"),
        model: "FALCON 900EX",
        cabinWidth: "2.37m",
        cabinHeight: "1.90m",
        baggageVolume: "2.30m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 900EX EASy"),
        model: "FALCON 900EX EASy",
        cabinWidth: "2.34m",
        cabinHeight: "1.88m",
        baggageVolume: "3.60m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 900LX"),
        model: "FALCON 900LX",
        cabinWidth: "2.37m",
        cabinHeight: "1.90m",
        baggageVolume: "3.60m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G-IV"),
        model: "GULFSTREAM G-IV",
        cabinWidth: "2.24m",
        cabinHeight: "1.88m",
        baggageVolume: "4.79m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G-IVSP"),
        model: "GULFSTREAM G-IVSP",
        cabinWidth: "2.24m",
        cabinHeight: "1.88m",
        baggageVolume: "4.79m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G-V"),
        model: "GULFSTREAM G-V",
        cabinWidth: "2.24m",
        cabinHeight: "1.88m",
        baggageVolume: "6.40m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G450"),
        model: "GULFSTREAM G450",
        cabinWidth: "2.24m",
        cabinHeight: "1.88m",
        baggageVolume: "4.79m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G500"),
        model: "GULFSTREAM G500",
        cabinWidth: "2.24m",
        cabinHeight: "1.88m",
        baggageVolume: "4.95m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GLOBAL 6000"),
        model: "GLOBAL 6000",
        cabinWidth: "2.41m",
        cabinHeight: "1.88m",
        baggageVolume: "5.53m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GLOBAL 6500"),
        model: "GLOBAL 6500",
        cabinWidth: "2.41m",
        cabinHeight: "1.88m",
        baggageVolume: "5.50m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GLOBAL 7500"),
        model: "GLOBAL 7500",
        cabinWidth: "2.44m",
        cabinHeight: "1.89m",
        baggageVolume: "5.52m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GLOBAL EXPRESS"),
        model: "GLOBAL EXPRESS",
        cabinWidth: "2.49m",
        cabinHeight: "1.92m",
        baggageVolume: "5.52m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GLOBAL EXPRESS XRS"),
        model: "GLOBAL EXPRESS XRS",
        cabinWidth: "2.49m",
        cabinHeight: "1.95m",
        baggageVolume: "5.52m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("FALCON 8X"),
        model: "FALCON 8X",
        cabinWidth: "2.34m",
        cabinHeight: "1.88m",
        baggageVolume: "3.96m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G550"),
        model: "GULFSTREAM G550",
        cabinWidth: "2.24m",
        cabinHeight: "1.88m",
        baggageVolume: "6.40m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G600"),
        model: "GULFSTREAM G600",
        cabinWidth: "2.31m",
        cabinHeight: "1.88m",
        baggageVolume: "4.96m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G650"),
        model: "GULFSTREAM G650",
        cabinWidth: "2.59m",
        cabinHeight: "1.96m",
        baggageVolume: "5.55m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM G650ER"),
        model: "GULFSTREAM G650ER",
        cabinWidth: "2.49m",
        cabinHeight: "1.88m",
        baggageVolume: "5.52m³",
        passengerCapacity: "8-10"
      },
      {
        id: createAircraftId("GULFSTREAM GV-SP"),
        model: "GULFSTREAM GV-SP",
        cabinWidth: "2.22m",
        cabinHeight: "1.85m",
        baggageVolume: "4.70m³",
        passengerCapacity: "8-10"
      }
    // ... continuing with the rest of your aircraft
  ];