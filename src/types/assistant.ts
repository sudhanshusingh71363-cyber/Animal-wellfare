export type AnimalType = 'dog' | 'cat' | 'cow' | 'bird' | 'other';

export type TriageUrgency = 'emergency' | 'veterinary_assessment' | 'basic_care';

export interface SymptomChoice {
  id: string;
  label: string;
  description?: string;
  isEmergencyFlag?: boolean;
  emergencyCategory?: string;
}

export interface SymptomQuestion {
  id: string;
  text: string;
  plainLanguageClarification?: string;
  animalType?: AnimalType | 'all';
  concernCategory: string;
  type: 'single_choice' | 'multiple_choice' | 'free_text';
  choices: SymptomChoice[];
  allowNotSure?: boolean;
  requiredForTriage?: boolean;
  order: number;
}

export interface UserAnswer {
  questionId: string;
  questionText: string;
  selectedChoiceIds: string[];
  selectedChoiceLabels: string[];
  freeTextAnswer?: string;
  answeredAt: string;
  isUnknown?: boolean;
}

export interface EmergencyIndicator {
  code: string;
  title: string;
  description: string;
  sourceQuestionId: string;
  severity: 'critical' | 'high' | 'moderate';
}

export interface TriageResultData {
  urgency: TriageUrgency;
  urgencyTitle: string;
  urgencySubtitle: string;
  animalType: AnimalType;
  concernCategory: string;
  emergencyIndicators: EmergencyIndicator[];
  unknownAnswersCount: number;
  identifiedRisks: string[];
  safeInterimSteps: string[];
  whatNotToDo: string[];
  whenToEscalate: string[];
  reasonForReferral?: string;
  disclaimer: string;
  generatedAt: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  timestamp: string;
  question?: SymptomQuestion;
  triageResult?: TriageResultData;
  isEmergencyAlert?: boolean;
  imageUrl?: string;
  imageObservation?: string;
}

export interface ConversationState {
  sessionId: string;
  animalType: AnimalType;
  selectedCategory: string;
  answers: Record<string, UserAnswer>;
  currentQuestionIndex: number;
  isCompleted: boolean;
  emergencyTriggered: boolean;
  triageResult?: TriageResultData;
  uploadedImageUrl?: string;
  uploadedImageAnalysis?: string;
}
