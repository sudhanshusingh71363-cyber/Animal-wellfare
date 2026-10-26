import { VeterinaryClinic, ClinicSearchParams } from '../types/clinic';
import { SEED_VERIFIED_CLINICS } from './seedData';

/**
 * Calculates Haversine distance in kilometers between two lat/lng pairs
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Fetch live real veterinary clinics from OpenStreetMap Overpass Turbo API
 */
async function fetchOverpassClinics(
  latitude: number,
  longitude: number,
  radiusMeters = 15000
): Promise<VeterinaryClinic[]> {
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="veterinary"](around:${radiusMeters},${latitude},${longitude});
      way["amenity"="veterinary"](around:${radiusMeters},${latitude},${longitude});
    );
    out center 15;
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const data = await res.json();
    if (!data.elements || !Array.isArray(data.elements)) return [];

    const clinics: VeterinaryClinic[] = data.elements.map((el: any) => {
      const lat = el.lat || el.center?.lat || latitude;
      const lon = el.lon || el.center?.lon || longitude;
      const tags = el.tags || {};
      const name = tags.name || tags['name:en'] || 'Veterinary Clinic / Animal Care';
      const street = tags['addr:street'] || '';
      const housenumber = tags['addr:housenumber'] || '';
      const city = tags['addr:city'] || '';
      const address = [housenumber, street, city].filter(Boolean).join(', ') || tags.description || 'Verified via OpenStreetMap';
      const phone = tags.phone || tags['contact:phone'];
      const emergency = tags.emergency === 'yes' || tags['opening_hours'] === '24/7';

      return {
        id: `osm-${el.id}`,
        name,
        address,
        city: city || 'Local Area',
        pinCode: tags['addr:postcode'],
        phone: phone || undefined,
        hasEmergencyService: emergency,
        isOpen24Hours: tags['opening_hours'] === '24/7',
        openingHours: tags['opening_hours'] || (emergency ? 'Open 24/7 Emergency' : 'Check with clinic'),
        latitude: lat,
        longitude: lon,
        distanceKm: calculateDistanceKm(latitude, longitude, lat, lon),
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`,
        verified: true,
        source: 'osm_overpass',
      };
    });

    return clinics;
  } catch (err) {
    console.warn('Overpass API query failed or timed out:', err);
    return [];
  }
}

/**
 * Searches nearby veterinary clinics using coordinates or manual text (city/PIN code)
 */
export async function searchNearbyClinics(
  params: ClinicSearchParams
): Promise<{ clinics: VeterinaryClinic[]; sourceNotice: string }> {
  const { latitude, longitude, city, pinCode, emergencyOnly } = params;

  let results: VeterinaryClinic[] = [];
  let sourceNotice = '';

  // 1. If GPS coordinates are available, query live OpenStreetMap Overpass
  if (latitude !== undefined && longitude !== undefined) {
    const liveOsmClinics = await fetchOverpassClinics(latitude, longitude, 20000);

    // Merge with verified seed database
    const localSeed = SEED_VERIFIED_CLINICS.map((clinic) => ({
      ...clinic,
      distanceKm: calculateDistanceKm(latitude, longitude, clinic.latitude, clinic.longitude),
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`,
    }));

    // Combine unique
    const seenIds = new Set<string>();
    const combined: VeterinaryClinic[] = [];

    // Prioritize closest clinics
    [...liveOsmClinics, ...localSeed].forEach((c) => {
      const key = `${c.name.toLowerCase().trim()}-${c.latitude.toFixed(3)}`;
      if (!seenIds.has(key)) {
        seenIds.add(key);
        combined.push(c);
      }
    });

    combined.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    results = combined;
    sourceNotice = liveOsmClinics.length > 0
      ? 'Live veterinary clinics retrieved via verified OpenStreetMap & PawCare Registry.'
      : 'Showing verified clinics from the PawCare Registry.';
  } else {
    // 2. City or PIN code search
    const query = (city || pinCode || '').toLowerCase().trim();

    results = SEED_VERIFIED_CLINICS.filter((c) => {
      const matchesCity = c.city.toLowerCase().includes(query);
      const matchesPin = c.pinCode?.includes(query);
      const matchesName = c.name.toLowerCase().includes(query);
      const matchesAddress = c.address.toLowerCase().includes(query);
      return matchesCity || matchesPin || matchesName || matchesAddress;
    }).map((c) => ({
      ...c,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${c.name} ${c.address} ${c.city}`
      )}`,
    }));

    sourceNotice = results.length > 0
      ? `Displaying verified veterinary clinics matching "${query}".`
      : `No verified clinic listings found matching "${query}".`;
  }

  // Filter for emergency only if requested
  if (emergencyOnly) {
    results = results.filter((c) => c.hasEmergencyService || c.isOpen24Hours);
  }

  return {
    clinics: results,
    sourceNotice,
  };
}
