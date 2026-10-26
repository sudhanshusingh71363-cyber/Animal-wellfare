import React, { useState, useEffect } from 'react';
import { RescueReport, RescueStatus } from '../../types/rescue';
import { getRescueReportByRef } from '../../lib/supabase';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  ShieldCheck,
  Calendar,
  MapPin,
} from 'lucide-react';

interface RescueTrackerProps {
  initialRef?: string;
}

export const RescueTracker: React.FC<RescueTrackerProps> = ({ initialRef }) => {
  const [refInput, setRefInput] = useState(initialRef || '');
  const [report, setReport] = useState<RescueReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  const handleSearch = async (targetRef: string) => {
    const clean = targetRef.trim();
    if (!clean) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await getRescueReportByRef(clean);
      setReport(data);
    } catch (err) {
      console.error('Failed to find report', err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: RescueStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Volunteer Verification',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
        };
      case 'under_review':
        return {
          label: 'Under Active Review',
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: ShieldCheck,
        };
      case 'dispatched':
        return {
          label: 'Rescue Team Dispatched',
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Truck,
        };
      case 'resolved':
        return {
          label: 'Rescued / Resolved',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
        };
      default:
        return {
          label: status.replace('_', ' ').toUpperCase(),
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: AlertCircle,
        };
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-forest bg-brand-sageLight px-3 py-1 rounded-full">
          Live Status Tracker
        </span>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-brand-forestDark mt-3">
          Track Rescue Report
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-2">
          Enter your reference ID to monitor rescue verification, team dispatch, and treatment progress.
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(refInput);
        }}
        className="bg-white border border-brand-border rounded-2xl p-4 shadow-card mb-8 flex items-center gap-3"
      >
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="Enter tracking reference (e.g. PAW-2026-ABCD)..."
            required
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border bg-brand-offwhite text-sm font-mono uppercase focus:outline-hidden focus:border-brand-forest"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-brand-forest hover:bg-brand-forestLight text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
        >
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {/* Result Display */}
      {loading ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-brand-border">
          <div className="w-8 h-8 border-3 border-brand-forest border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-brand-muted">Fetching rescue report status...</p>
        </div>
      ) : report ? (
        <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6 animate-fadeIn">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-brand-border">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                Reference ID
              </span>
              <div className="text-2xl font-mono font-extrabold text-brand-forest">
                {report.referenceNumber}
              </div>
            </div>

            {(() => {
              const badge = getStatusBadge(report.status);
              const Icon = badge.icon;
              return (
                <div
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 ${badge.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{badge.label}</span>
                </div>
              );
            })()}
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-brand-offwhite border border-brand-border text-xs">
            <div>
              <span className="text-brand-muted block">Animal Type</span>
              <strong className="text-brand-charcoal capitalize text-sm">{report.animalType}</strong>
            </div>
            <div>
              <span className="text-brand-muted block">Concern</span>
              <strong className="text-brand-charcoal text-sm">{report.problemCategory}</strong>
            </div>
            <div>
              <span className="text-brand-muted block">Severity</span>
              <strong className="text-brand-charcoal capitalize text-sm">{report.severity}</strong>
            </div>
            <div>
              <span className="text-brand-muted block">Reported On</span>
              <strong className="text-brand-charcoal text-sm">
                {new Date(report.createdAt).toLocaleDateString()}
              </strong>
            </div>
          </div>

          {/* Location & Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-forest mb-1.5">
              Distress Location
            </h4>
            <p className="text-xs sm:text-sm text-brand-charcoal flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-brand-forest shrink-0 mt-0.5" />
              <span>
                {report.addressSummary}, {report.city}
              </span>
            </p>
          </div>

          {/* Status Note */}
          {report.statusNotes && (
            <div className="p-4 rounded-xl bg-brand-sageLight/60 border border-brand-sage text-xs text-brand-forestDark">
              <strong className="block mb-1 font-heading text-sm">Current Dispatch Notes:</strong>
              <p>{report.statusNotes}</p>
            </div>
          )}

          {/* Photo if available */}
          {report.imageUrl && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-forest mb-2">
                Attached Photograph
              </h4>
              <img
                src={report.imageUrl}
                alt="Animal in distress"
                className="w-full max-h-72 object-cover rounded-xl border border-brand-border"
              />
            </div>
          )}

          {/* Privacy Note */}
          <div className="pt-4 border-t border-brand-border text-[11px] text-brand-muted flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-forest" />
            <span>Reporter personal phone numbers and private credentials are protected.</span>
          </div>
        </div>
      ) : searched ? (
        <div className="text-center p-12 bg-white rounded-2xl border border-brand-border shadow-subtle">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-brand-charcoal">
            No Report Found
          </h3>
          <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
            We could not find any active rescue report matching "{refInput}". Please double check your reference format (e.g. PAW-2026-ABCD).
          </p>
        </div>
      ) : null}
    </div>
  );
};
