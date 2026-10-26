import React, { useState, useEffect } from 'react';
import { VeterinaryClinic, ClinicSearchParams } from '../../types/clinic';
import { searchNearbyClinics } from '../../lib/clinicService';
import { ClinicCard } from './ClinicCard';
import {
  MapPin,
  Search,
  Navigation,
  AlertCircle,
  ShieldCheck,
  Phone,
  Filter,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Leaflet marker icons
const defaultPinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const emergencyPinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const NearbyClinics: React.FC = () => {
  const [clinics, setClinics] = useState<VeterinaryClinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [sourceNotice, setSourceNotice] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoDenied, setGeoDenied] = useState(false);
  const [searchedCity, setSearchedCity] = useState('New Delhi');

  // Initial load with default city
  useEffect(() => {
    executeSearch({ city: 'New Delhi', emergencyOnly });
  }, []);

  const executeSearch = async (params: ClinicSearchParams) => {
    setLoading(true);
    try {
      const res = await searchNearbyClinics(params);
      setClinics(res.clinics);
      setSourceNotice(res.sourceNotice);
    } catch (err) {
      console.error('Failed to search clinics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setGeoDenied(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        executeSearch({
          latitude,
          longitude,
          emergencyOnly,
        });
      },
      (err) => {
        console.warn('Geolocation permission denied or timed out:', err);
        setGeoDenied(true);
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearchedCity(searchInput.trim());
    executeSearch({
      city: searchInput.trim(),
      emergencyOnly,
    });
  };

  const handleToggleEmergency = () => {
    const nextVal = !emergencyOnly;
    setEmergencyOnly(nextVal);
    if (userLocation) {
      executeSearch({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        emergencyOnly: nextVal,
      });
    } else {
      executeSearch({
        city: searchedCity,
        emergencyOnly: nextVal,
      });
    }
  };

  // Center map around user location or first clinic or default
  const mapCenterLat = userLocation?.lat || (clinics.length > 0 ? clinics[0].latitude : 28.6139);
  const mapCenterLng = userLocation?.lng || (clinics.length > 0 ? clinics[0].longitude : 77.209);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-1 rounded-full">
          Verified Veterinary Directory
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-forestDark mt-3">
          Find Nearby Veterinary Care
        </h1>
        <p className="text-sm sm:text-base text-brand-muted mt-2">
          Discover verified animal hospitals, emergency trauma units, and local veterinary clinics.
        </p>
      </div>

      {/* Location Access & Search Bar */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 sm:p-6 shadow-card mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Quick Location Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleUseMyLocation}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-brand-forest text-white text-xs sm:text-sm font-semibold hover:bg-brand-forestLight transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>{userLocation ? 'Update My Location' : 'Use My Location'}</span>
            </button>

            <button
              onClick={handleToggleEmergency}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                emergencyOnly
                  ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                  : 'bg-white text-brand-charcoal border-brand-border hover:bg-brand-sage/20'
              }`}
            >
              <AlertCircle className={`w-4 h-4 ${emergencyOnly ? 'text-red-600' : 'text-brand-muted'}`} />
              <span>24/7 Emergency Only</span>
            </button>
          </div>

          {/* Manual City / PIN Code Search Form */}
          <form onSubmit={handleManualSearch} className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter city or PIN code (e.g. Delhi, Mumbai, 110024)..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-brand-border focus:outline-hidden focus:border-brand-forest focus:ring-1 focus:ring-brand-forest bg-brand-offwhite text-brand-charcoal"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-charcoal hover:bg-black text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Search
            </button>
          </form>
        </div>

        {/* Location Denied Banner */}
        {geoDenied && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Location access was denied or timed out. Please enter your city or PIN code manually above.
              </span>
            </div>
          </div>
        )}

        {/* Source & Transparency Notice */}
        {sourceNotice && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-forest shrink-0" />
            <span>{sourceNotice}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Map + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Map */}
        <div className="lg:col-span-6 bg-white border border-brand-border rounded-2xl shadow-card overflow-hidden h-[420px] lg:h-[620px] sticky top-24">
          <div className="p-3 bg-brand-offwhite border-b border-brand-border flex items-center justify-between text-xs text-brand-muted">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-brand-charcoal">Map View</span>
            </div>
            <span>Showing {clinics.length} clinics</span>
          </div>

          <div className="w-full h-[calc(100%-41px)]">
            <MapContainer
              key={`${mapCenterLat}-${mapCenterLng}-${clinics.length}`}
              center={[mapCenterLat, mapCenterLng]}
              zoom={12}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {clinics.map((clinic) => (
                <Marker
                  key={clinic.id}
                  position={[clinic.latitude, clinic.longitude]}
                  icon={clinic.hasEmergencyService ? emergencyPinIcon : defaultPinIcon}
                >
                  <Popup>
                    <div className="p-1 max-w-xs text-brand-charcoal">
                      <h4 className="font-bold text-sm">{clinic.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{clinic.address}</p>
                      {clinic.hasEmergencyService && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          24/7 Emergency
                        </span>
                      )}
                      <div className="mt-2 pt-2 border-t flex gap-2">
                        {clinic.phone && (
                          <a
                            href={`tel:${clinic.emergencyPhone || clinic.phone}`}
                            className="text-xs text-white bg-green-700 px-2 py-1 rounded"
                          >
                            Call
                          </a>
                        )}
                        <a
                          href={clinic.googleMapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-700 underline"
                        >
                          Directions
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Right Side: List of Clinic Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-brand-charcoal">
              Verified Clinics {clinics.length > 0 ? `(${clinics.length})` : ''}
            </h2>
            {emergencyOnly && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Filtered: Emergency Only
              </span>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-brand-border">
              <div className="w-8 h-8 border-3 border-brand-forest border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs text-brand-muted">Searching verified veterinary clinics...</p>
            </div>
          ) : clinics.length > 0 ? (
            <div className="space-y-4">
              {clinics.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-2xl border border-brand-border shadow-subtle">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-base text-brand-charcoal">
                No Verified Clinics Found Nearby
              </h3>
              <p className="text-xs text-brand-muted mt-1 max-w-md mx-auto leading-relaxed">
                We could not find verified veterinary listings in this immediate area. Please try searching with a broader city name or open Google Maps directly.
              </p>
              <div className="mt-5">
                <a
                  href={`https://www.google.com/maps/search/veterinary+clinic+near+me`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-forest hover:bg-brand-forestLight text-white text-xs font-semibold shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Search on Google Maps</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
