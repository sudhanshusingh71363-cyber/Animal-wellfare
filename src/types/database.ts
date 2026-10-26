import { AnimalType, TriageUrgency } from './assistant';
import { RescueStatus } from './rescue';

export interface WellnessResource {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  animalType: AnimalType | 'all';
  authoritativeSource: string;
  tags: string[];
  readTimeMinutes: number;
  published: boolean;
  createdAt: string;
}

export interface WellnessQuote {
  id: string;
  quote: string;
  author: string;
  context?: string;
  featured: boolean;
}

export interface SuccessStory {
  id: string;
  title: string;
  animalName: string;
  animalType: AnimalType;
  story: string;
  rescueDate: string;
  recoveryDate?: string;
  imageUrl?: string;
  isDevelopmentSample: boolean; // Transparency rule
  rescueLocation: string;
}

export interface RescueOrganization {
  id: string;
  name: string;
  city: string;
  phone: string;
  email?: string;
  operatingHours?: string;
  activeAreas: string[];
  verified: boolean;
}

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin' | 'veterinary_reviewer' | 'rescue_coordinator';
  lastLoginAt?: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetTable: string;
  targetId: string;
  details: string;
  createdAt: string;
}

export interface TriageRuleRecord {
  id: string;
  name: string;
  animalType: AnimalType | 'all';
  concernCategory: string;
  conditionDescription: string;
  triggeredUrgency: TriageUrgency;
  isEmergencyOverride: boolean;
  active: boolean;
  lastReviewedByVet?: string;
  lastReviewedAt?: string;
}
