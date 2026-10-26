import { AnimalType } from './assistant';

export type RescueStatus = 'pending' | 'under_review' | 'dispatched' | 'resolved' | 'unable_to_locate' | 'cancelled';

export interface RescueReport {
  id: string;
  referenceNumber: string; // e.g. PAW-2026-ABCD
  animalType: AnimalType;
  animalDescription?: string;
  problemCategory: string;
  severity: 'critical' | 'severe' | 'moderate' | 'mild';
  description: string;
  imageUrl?: string;
  
  // Location
  city: string;
  pinCode?: string;
  addressSummary: string;
  latitude?: number;
  longitude?: number;

  // Contact (Private, optional)
  reporterName?: string;
  reporterPhone?: string;
  reporterConsentToContact: boolean;

  // Status & Audit
  status: RescueStatus;
  statusNotes?: string;
  assignedOrganizationId?: string;
  assignedOrganizationName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRescueReportInput {
  animalType: AnimalType;
  problemCategory: string;
  severity: 'critical' | 'severe' | 'moderate' | 'mild';
  description: string;
  city: string;
  pinCode?: string;
  addressSummary: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  reporterName?: string;
  reporterPhone?: string;
  reporterConsentToContact: boolean;
}
