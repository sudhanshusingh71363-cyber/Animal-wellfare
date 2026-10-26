export interface VeterinaryClinic {
  id: string;
  name: string;
  address: string;
  city: string;
  pinCode?: string;
  phone?: string;
  emergencyPhone?: string;
  hasEmergencyService: boolean;
  isOpen24Hours: boolean;
  openingHours?: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  googleMapsUrl?: string;
  verified: boolean;
  notes?: string;
  source: 'verified_db' | 'osm_overpass' | 'google_places';
}

export interface ClinicSearchParams {
  latitude?: number;
  longitude?: number;
  city?: string;
  pinCode?: string;
  radiusKm?: number;
  emergencyOnly?: boolean;
}
