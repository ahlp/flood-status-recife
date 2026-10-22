export interface CityConfig {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stations: string[];
}

export const SUPPORTED_CITIES: Record<string, CityConfig> = {
  recife: {
    id: "recife",
    name: "Recife",
    lat: -8.0578,
    lng: -34.8829,
    stations: [
      "RECIFE",
      "JABOATÃO DOS GUARARAPES",
      "OLINDA",
      "SÃO LOURENÇO DA MATA",
      "CAMARAGIBE",
    ],
  },
  olinda: {
    id: "olinda",
    name: "Olinda",
    lat: -7.9995,
    lng: -34.8553,
    stations: ["OLINDA", "RECIFE", "PAULISTA"],
  },
  jaboatao: {
    id: "jaboatao",
    name: "Jaboatão dos Guararapes",
    lat: -8.1803,
    lng: -35.0016,
    stations: ["JABOATÃO DOS GUARARAPES", "RECIFE", "CABO DE SANTO AGOSTINHO"],
  },
};

export const DEFAULT_CITY_ID = "recife";

export function resolveCity(rawCity?: string): CityConfig | null {
  const cityId = (rawCity || DEFAULT_CITY_ID).toLowerCase();
  return SUPPORTED_CITIES[cityId] || null;
}

export function listSupportedCityIds(): string[] {
  return Object.keys(SUPPORTED_CITIES);
}
