import React, { useState } from 'react';
import { CreateRescueReportInput } from '../../types/rescue';
import { createRescueReport } from '../../lib/supabase';
import { AnimalType } from '../../types/assistant';
import { ImageUploader } from '../assistant/ImageUploader';
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Send,
  Navigation,
  ShieldCheck,
  Phone,
  User,
  Heart,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RescueReportFormProps {
  onSuccessNavigateToTrack?: (refNumber: string) => void;
}

export const RescueReportForm: React.FC<RescueReportFormProps> = ({
  onSuccessNavigateToTrack,
}) => {
  const [animalType, setAnimalType] = useState<AnimalType>('dog');
  const [problemCategory, setProblemCategory] = useState('Injury / Accident');
  const [severity, setSeverity] = useState<'critical' | 'severe' | 'moderate' | 'mild'>('severe');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [addressSummary, setAddressSummary] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  
  // Contact
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [consentContact, setConsentContact] = useState(true);

  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [copied, setCopied] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleGetCoordinates = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !city.trim() || !addressSummary.trim()) {
      alert('Please fill out the animal description, city, and landmark/address.');
      return;
    }

    setSubmitting(true);

    try {
      const payload: CreateRescueReportInput = {
        animalType,
        problemCategory,
        severity,
        description,
        city,
        pinCode: pinCode.trim() || undefined,
        addressSummary,
        latitude,
        longitude,
        imageUrl,
        reporterName: reporterName.trim() || undefined,
        reporterPhone: reporterPhone.trim() || undefined,
        reporterConsentToContact: consentContact,
      };

      const res = await createRescueReport(payload);
      setSubmittedRef(res.report.referenceNumber);
      setIsLiveDb(res.isLiveDb);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#355E46', '#DCE8D8', '#F1E7D7'],
        });
      } catch (e) {
        // Safe confetti fallback
      }
    } catch (err) {
      console.error('Failed to submit report', err);
      alert('Failed to submit rescue report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyRef = () => {
    if (submittedRef) {
      navigator.clipboard.writeText(submittedRef);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (submittedRef) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 sm:p-8 bg-white border border-brand-border rounded-2xl shadow-elevated text-center animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-1 rounded-full">
          Report Confirmed & Recorded
        </span>

        <h2 className="font-heading font-extrabold text-2xl text-brand-forestDark mt-3">
          Thank You for Being Their Voice!
        </h2>

        <p className="text-xs sm:text-sm text-brand-muted mt-2 max-w-md mx-auto leading-relaxed">
          Your distress report has been registered in the PawCare rescue database. Community rescue volunteers and local coordinators can now locate this animal.
        </p>

        {/* Reference Number Card */}
        <div className="my-6 p-4 rounded-xl bg-brand-offwhite border border-brand-border inline-block max-w-sm w-full">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            Your Tracking Reference ID:
          </span>
          <div className="text-2xl font-mono font-extrabold text-brand-forest mt-1 tracking-wider">
            {submittedRef}
          </div>
          <button
            onClick={handleCopyRef}
            className="mt-2 text-xs font-semibold text-brand-forest hover:text-brand-forestDark flex items-center justify-center gap-1.5 mx-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied Reference!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-brand-muted" />
                <span>Copy Reference ID</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          {onSuccessNavigateToTrack && (
            <button
              onClick={() => onSuccessNavigateToTrack(submittedRef)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-forest text-white text-xs sm:text-sm font-semibold hover:bg-brand-forestLight shadow-xs"
            >
              Track Report Status Now
            </button>
          )}

          <button
            onClick={() => {
              setSubmittedRef(null);
              setDescription('');
              setImageUrl(undefined);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-brand-border text-brand-charcoal text-xs sm:text-sm font-medium hover:bg-brand-offwhite"
          >
            Submit Another Report
          </button>
        </div>

        <div className="mt-6 text-[11px] text-brand-muted">
          Database Status: {isLiveDb ? 'Live Cloud Database' : 'Local Persistent Storage Mode'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-1 rounded-full">
          Community Rescue Dispatch
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-forestDark mt-3">
          Report an Animal in Distress
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-2">
          Help community rescuers, animal welfare organizations, and veterinarians reach a stray animal safely.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Is this an immediate life-or-death crisis?</strong>
          <p className="mt-0.5 text-amber-800">
            If the animal is profusely bleeding, collapsed, or struggling to breathe, do not wait for a report dispatch. Use our{' '}
            <strong className="underline">AI First-Aid Assistant</strong> or call a 24/7 veterinary clinic directly.
          </p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Animal Species & Concern Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
              Animal Type *
            </label>
            <select
              value={animalType}
              onChange={(e) => setAnimalType(e.target.value as AnimalType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm text-brand-charcoal focus:outline-hidden focus:border-brand-forest"
            >
              <option value="dog">Dog (Street / Stray)</option>
              <option value="cat">Cat / Kitten</option>
              <option value="cow">Cow / Bull / Calf</option>
              <option value="bird">Bird / Pigeon / Raptor</option>
              <option value="other">Other Community Animal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
              Problem Category *
            </label>
            <select
              value={problemCategory}
              onChange={(e) => setProblemCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm text-brand-charcoal focus:outline-hidden focus:border-brand-forest"
            >
              <option value="Injury / Accident">Hit-and-Run / Traffic Injury</option>
              <option value="Severe Sickness / Vomiting">Severe Sickness / Vomiting</option>
              <option value="Open Wound / Maggot Infection">Open Wound / Maggot Infestation</option>
              <option value="Stuck / Trapped">Trapped in Drain / Wire / Hazard</option>
              <option value="Severe Dehydration / Heatstroke">Heat Exhaustion / Dehydration</option>
              <option value="Orphaned Young Litters">Orphaned Puppies / Kittens</option>
              <option value="Cruelty / Abandonment">Cruelty / Abandoned Pet</option>
            </select>
          </div>
        </div>

        {/* Severity Indicator */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
            Urgency / Severity Level *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'critical', label: 'Critical', color: 'border-red-300 bg-red-50 text-red-900' },
              { id: 'severe', label: 'Severe', color: 'border-amber-300 bg-amber-50 text-amber-900' },
              { id: 'moderate', label: 'Moderate', color: 'border-yellow-300 bg-yellow-50 text-yellow-900' },
              { id: 'mild', label: 'Mild', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
            ].map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setSeverity(s.id as any)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  severity === s.id
                    ? `${s.color} ring-2 ring-brand-forest`
                    : 'border-brand-border bg-white text-brand-muted hover:border-brand-forest/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
            Detailed Animal Observations *
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe animal appearance (color, collar, markings), exact symptoms (bleeding leg, lethargic), and physical condition..."
            required
            className="w-full p-3.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm text-brand-charcoal focus:outline-hidden focus:border-brand-forest"
          />
        </div>

        {/* Location Details */}
        <div className="space-y-3 pt-2 border-t border-brand-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-forest">
              Location Details *
            </span>
            <button
              type="button"
              onClick={handleGetCoordinates}
              disabled={locating}
              className="text-xs text-brand-forest hover:text-brand-forestDark flex items-center gap-1 font-semibold"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{latitude ? 'GPS Coordinates Captured' : locating ? 'Capturing GPS...' : 'Attach GPS Location'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City / District (e.g. South Delhi, Bandra Mumbai)*"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm focus:outline-hidden focus:border-brand-forest"
              />
            </div>
            <div>
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="PIN Code (Optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm focus:outline-hidden focus:border-brand-forest"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              value={addressSummary}
              onChange={(e) => setAddressSummary(e.target.value)}
              placeholder="Landmarks / Street directions (e.g. Near Metro Pillar 142, under the banyan tree)*"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm focus:outline-hidden focus:border-brand-forest"
            />
          </div>
        </div>

        {/* Optional Photograph Upload */}
        <div className="pt-2 border-t border-brand-border">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
            Upload Animal Photograph (Optional)
          </label>
          <div className="flex items-center gap-4">
            <ImageUploader
              onImageSelected={(url) => setImageUrl(url)}
              onClear={() => setImageUrl(undefined)}
              selectedImageUrl={imageUrl}
            />
            <span className="text-xs text-brand-muted">
              Photos help rescuers identify the correct animal and assess required equipment.
            </span>
          </div>
        </div>

        {/* Contact Information (Confidential) */}
        <div className="pt-2 border-t border-brand-border space-y-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-forest">
              Reporter Details (Confidential)
            </span>
            <p className="text-[11px] text-brand-muted mt-0.5">
              Your contact info is never shown publicly. It is only accessible to verified rescue coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Your Name (Optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm focus:outline-hidden focus:border-brand-forest"
            />
            <input
              type="tel"
              value={reporterPhone}
              onChange={(e) => setReporterPhone(e.target.value)}
              placeholder="Your Phone Number (Optional)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-offwhite text-xs sm:text-sm focus:outline-hidden focus:border-brand-forest"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-charcoal pt-1">
            <input
              type="checkbox"
              checked={consentContact}
              onChange={(e) => setConsentContact(e.target.checked)}
              className="rounded text-brand-forest focus:ring-brand-forest"
            />
            <span>I consent to being contacted by verified animal rescue teams for location clarification.</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-brand-border">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-brand-forest hover:bg-brand-forestLight text-white font-bold text-sm shadow-card flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Rescue Report...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Rescue Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
