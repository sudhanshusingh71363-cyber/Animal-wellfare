import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RescueReport, CreateRescueReportInput } from '../types/rescue';
import { VeterinaryClinic } from '../types/clinic';
import { SEED_VERIFIED_CLINICS, SEED_WELLNESS_RESOURCES, SEED_WELLNESS_QUOTES, SEED_SUCCESS_STORIES } from './seedData';
import { WellnessResource, WellnessQuote, SuccessStory } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local persistent keys
const LOCAL_REPORTS_KEY = 'pawcare_rescue_reports';
const LOCAL_CLINICS_KEY = 'pawcare_custom_clinics';
const LOCAL_ADMIN_KEY = 'pawcare_admin_auth';

function getStoredReports(): RescueReport[] {
  try {
    const raw = localStorage.getItem(LOCAL_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredReports(reports: RescueReport[]) {
  try {
    localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports locally', e);
  }
}

/**
 * Creates a new rescue report (Supabase or Local Fallback)
 */
export async function createRescueReport(
  input: CreateRescueReportInput
): Promise<{ report: RescueReport; isLiveDb: boolean }> {
  const referenceNumber = `PAW-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const now = new Date().toISOString();

  const newReport: RescueReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    referenceNumber,
    animalType: input.animalType,
    problemCategory: input.problemCategory,
    severity: input.severity,
    description: input.description,
    imageUrl: input.imageUrl,
    city: input.city,
    pinCode: input.pinCode,
    addressSummary: input.addressSummary,
    latitude: input.latitude,
    longitude: input.longitude,
    reporterName: input.reporterName,
    reporterPhone: input.reporterPhone,
    reporterConsentToContact: input.reporterConsentToContact,
    status: 'pending',
    statusNotes: 'Report received. Queued for community triage and rescue volunteer verification.',
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rescue_reports')
        .insert({
          reference_number: newReport.referenceNumber,
          animal_type: newReport.animalType,
          problem_category: newReport.problemCategory,
          severity: newReport.severity,
          description: newReport.description,
          image_url: newReport.imageUrl,
          city: newReport.city,
          pin_code: newReport.pinCode,
          address_summary: newReport.addressSummary,
          latitude: newReport.latitude,
          longitude: newReport.longitude,
          reporter_name: newReport.reporterName,
          reporter_phone: newReport.reporterPhone,
          reporter_consent_to_contact: newReport.reporterConsentToContact,
          status: newReport.status,
          status_notes: newReport.statusNotes,
        })
        .select()
        .single();

      if (error) {
        console.warn('Supabase insert failed, saving to local persistent storage:', error.message);
      } else if (data) {
        return { report: { ...newReport, id: data.id }, isLiveDb: true };
      }
    } catch (err) {
      console.warn('Supabase connection error:', err);
    }
  }

  // Fallback: save to localStorage
  const existing = getStoredReports();
  saveStoredReports([newReport, ...existing]);

  return { report: newReport, isLiveDb: false };
}

/**
 * Get rescue report by Reference Number
 */
export async function getRescueReportByRef(
  referenceNumber: string
): Promise<RescueReport | null> {
  const cleanRef = referenceNumber.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rescue_reports')
        .select('id, reference_number, animal_type, problem_category, severity, description, image_url, city, address_summary, status, status_notes, created_at, updated_at')
        .eq('reference_number', cleanRef)
        .single();

      if (data && !error) {
        return {
          id: data.id,
          referenceNumber: data.reference_number,
          animalType: data.animal_type,
          problemCategory: data.problem_category,
          severity: data.severity,
          description: data.description,
          imageUrl: data.image_url,
          city: data.city,
          addressSummary: data.address_summary,
          status: data.status,
          statusNotes: data.status_notes,
          reporterConsentToContact: false, // Hidden for privacy
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (e) {
      console.warn('Error fetching report from Supabase:', e);
    }
  }

  // Check local storage
  const reports = getStoredReports();
  const match = reports.find((r) => r.referenceNumber.toUpperCase() === cleanRef);
  if (match) {
    // Return sanitized copy protecting reporter privacy
    return {
      ...match,
      reporterName: match.reporterName ? `${match.reporterName[0]}***` : undefined,
      reporterPhone: undefined,
    };
  }

  return null;
}

/**
 * Fetch all reports (For Admin Dashboard)
 */
export async function getAllRescueReports(): Promise<RescueReport[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('rescue_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        return data.map((d: any) => ({
          id: d.id,
          referenceNumber: d.reference_number,
          animalType: d.animal_type,
          problemCategory: d.problem_category,
          severity: d.severity,
          description: d.description,
          imageUrl: d.image_url,
          city: d.city,
          pinCode: d.pin_code,
          addressSummary: d.address_summary,
          latitude: d.latitude,
          longitude: d.longitude,
          reporterName: d.reporter_name,
          reporterPhone: d.reporter_phone,
          reporterConsentToContact: d.reporter_consent_to_contact,
          status: d.status,
          statusNotes: d.status_notes,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Error fetching all reports from Supabase:', e);
    }
  }

  return getStoredReports();
}

/**
 * Update rescue report status (For Admin Dashboard)
 */
export async function updateRescueReportStatus(
  reportId: string,
  newStatus: RescueReport['status'],
  notes?: string
): Promise<boolean> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('rescue_reports')
        .update({
          status: newStatus,
          status_notes: notes,
          updated_at: now,
        })
        .eq('id', reportId);

      if (!error) return true;
    } catch (e) {
      console.warn('Error updating report in Supabase:', e);
    }
  }

  // Local update
  const reports = getStoredReports();
  const index = reports.findIndex((r) => r.id === reportId);
  if (index !== -1) {
    reports[index].status = newStatus;
    if (notes !== undefined) reports[index].statusNotes = notes;
    reports[index].updatedAt = now;
    saveStoredReports(reports);
    return true;
  }

  return false;
}
