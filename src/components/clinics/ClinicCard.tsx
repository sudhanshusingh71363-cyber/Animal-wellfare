import React from 'react';
import { VeterinaryClinic } from '../../types/clinic';
import { MapPin, Phone, Clock, Navigation, ShieldCheck, AlertCircle } from 'lucide-react';

interface ClinicCardProps {
  clinic: VeterinaryClinic;
  onSelectOnMap?: () => void;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, onSelectOnMap }) => {
  return (
    <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-card hover:border-brand-forest/40 transition-all flex flex-col justify-between group">
      <div>
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          {clinic.hasEmergencyService ? (
            <span className="text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-red-600" />
              Verified 24/7 Emergency
            </span>
          ) : (
            <span className="text-[11px] font-semibold bg-brand-sageLight text-brand-forestDark px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-brand-forest" />
              Verified Clinic
            </span>
          )}

          {clinic.distanceKm !== undefined && (
            <span className="text-xs font-semibold text-brand-forest bg-brand-sageLight/70 px-2.5 py-0.5 rounded-full">
              {clinic.distanceKm} km away
            </span>
          )}
        </div>

        {/* Clinic Name */}
        <h3 className="font-heading font-bold text-base sm:text-lg text-brand-charcoal group-hover:text-brand-forest transition-colors">
          {clinic.name}
        </h3>

        {/* Address */}
        <p className="text-xs text-brand-muted mt-1 flex items-start gap-1.5 leading-relaxed">
          <MapPin className="w-3.5 h-3.5 text-brand-forest shrink-0 mt-0.5" />
          <span>{clinic.address}{clinic.city ? `, ${clinic.city}` : ''}{clinic.pinCode ? ` - ${clinic.pinCode}` : ''}</span>
        </p>

        {/* Hours */}
        {clinic.openingHours && (
          <p className="text-xs text-brand-charcoal/80 mt-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-forest shrink-0" />
            <span className={clinic.isOpen24Hours ? 'font-semibold text-emerald-800' : ''}>
              {clinic.openingHours}
            </span>
          </p>
        )}

        {/* Notes */}
        {clinic.notes && (
          <p className="text-[11px] text-brand-muted/90 italic mt-2 bg-brand-offwhite p-2 rounded-lg border border-brand-border/60">
            {clinic.notes}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-brand-border/70 flex items-center gap-2">
        {clinic.phone ? (
          <a
            href={`tel:${clinic.emergencyPhone || clinic.phone}`}
            className="flex-1 py-2 px-3 rounded-xl bg-brand-forest hover:bg-brand-forestLight text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call {clinic.emergencyPhone ? 'Emergency' : 'Clinic'}</span>
          </a>
        ) : (
          <div className="flex-1 py-2 px-3 rounded-xl bg-brand-offwhite text-brand-muted text-[11px] text-center border border-brand-border">
            Phone not verified
          </div>
        )}

        <a
          href={clinic.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${clinic.name} ${clinic.address}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3.5 rounded-xl border border-brand-border hover:border-brand-forest hover:bg-brand-sageLight text-brand-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-brand-forest" />
          <span>Directions</span>
        </a>
      </div>
    </div>
  );
};
