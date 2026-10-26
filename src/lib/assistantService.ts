import {
  AnimalType,
  AssistantMessage,
  ConversationState,
  SymptomQuestion,
  UserAnswer,
  TriageResultData,
} from '../types/assistant';
import { CONCERN_CATEGORIES, getQuestionsForConcern } from './symptomKnowledgeBase';
import { evaluateTriage, DETERMINISTIC_SAFETY_RULES } from './triageEngine';

export const INITIAL_BOT_MESSAGE: AssistantMessage = {
  id: 'msg-init',
  sender: 'bot',
  text: `Hi, I'm PawCare. I'm here to help you take the next safe step for an animal in need.

You don't need to know anything about animals. I'll ask a few simple questions and guide you.

What have you noticed?`,
  timestamp: new Date().toISOString(),
};

/**
 * Creates a brand new conversation state
 */
export function createNewConversationState(animalType: AnimalType = 'dog'): ConversationState {
  return {
    sessionId: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    animalType,
    selectedCategory: '',
    answers: {},
    currentQuestionIndex: 0,
    isCompleted: false,
    emergencyTriggered: false,
  };
}

/**
 * Maps free-text user description to a likely concern category
 */
export function detectCategoryFromText(text: string): { category: string; matchedKeywords: string[] } {
  const lower = text.toLowerCase();
  
  if (lower.includes('vomit') || lower.includes('throw up') || lower.includes('threw up') || lower.includes('puke') || lower.includes('gag') || lower.includes('retch')) {
    return { category: 'vomiting', matchedKeywords: ['vomit', 'throw up'] };
  }
  if (lower.includes('bleed') || lower.includes('wound') || lower.includes('cut') || lower.includes('blood') || lower.includes('hit by') || lower.includes('accident') || lower.includes('limp') || lower.includes('broken')) {
    return { category: 'injury', matchedKeywords: ['bleeding', 'injury'] };
  }
  if (lower.includes('breath') || lower.includes('gasp') || lower.includes('chok') || lower.includes('wheez') || lower.includes('panting heavily')) {
    return { category: 'breathing', matchedKeywords: ['breathing difficulty'] };
  }
  if (lower.includes('poison') || lower.includes('chemical') || lower.includes('pesticide') || lower.includes('rat poison') || lower.includes('swallowed') || lower.includes('lily') || lower.includes('paracetamol')) {
    return { category: 'poisoning', matchedKeywords: ['suspected poison'] };
  }
  if (lower.includes('collapse') || lower.includes('unconscious') || lower.includes('fainted') || lower.includes('cannot stand') || lower.includes('not moving') || lower.includes('limp')) {
    return { category: 'weakness', matchedKeywords: ['collapse', 'unconscious'] };
  }
  if (lower.includes('heat') || lower.includes('sun') || lower.includes('hot') || lower.includes('exhaust') || lower.includes('dehydrat')) {
    return { category: 'heat_stress', matchedKeywords: ['heat stress'] };
  }
  if (lower.includes('eat') || lower.includes('food') || lower.includes('appetite') || lower.includes('starv')) {
    return { category: 'not_eating', matchedKeywords: ['not eating'] };
  }
  if (lower.includes('urine') || lower.includes('pee') || lower.includes('litter') || lower.includes('straining')) {
    return { category: 'urinary_feline', matchedKeywords: ['urinary signs'] };
  }
  if (lower.includes('bloat') || lower.includes('swollen stomach') || lower.includes('swollen belly')) {
    return { category: 'bloat_bovine', matchedKeywords: ['bloat signs'] };
  }
  if (lower.includes('trap') || lower.includes('stuck') || lower.includes('drain') || lower.includes('wire') || lower.includes('well')) {
    return { category: 'trapped', matchedKeywords: ['trapped'] };
  }

  return { category: 'something_else', matchedKeywords: [] };
}

/**
 * Checks whether an immediate emergency is triggered by current answers or free-text
 */
export function checkImmediateEmergency(
  state: ConversationState,
  freeText?: string
): { isEmergency: boolean; indicatorTitle?: string; description?: string } {
  const context = {
    animalType: state.animalType,
    concernCategory: state.selectedCategory,
    answers: state.answers,
    freeTextNotes: freeText,
  };

  for (const rule of DETERMINISTIC_SAFETY_RULES) {
    if (rule.animalType === 'all' || rule.animalType === state.animalType) {
      if (rule.evaluate(context)) {
        return {
          isEmergency: true,
          indicatorTitle: rule.title,
          description: rule.description,
        };
      }
    }
  }

  return { isEmergency: false };
}

/**
 * Processes a user answer, advances question flow, or halts immediately if emergency detected
 */
export function processUserResponse(
  state: ConversationState,
  question: SymptomQuestion,
  selectedChoiceIds: string[],
  selectedChoiceLabels: string[],
  freeTextAnswer?: string
): {
  updatedState: ConversationState;
  nextBotMessage: AssistantMessage;
  isEmergencyAlert: boolean;
} {
  const answer: UserAnswer = {
    questionId: question.id,
    questionText: question.text,
    selectedChoiceIds,
    selectedChoiceLabels,
    freeTextAnswer,
    answeredAt: new Date().toISOString(),
    isUnknown: selectedChoiceIds.includes('not_sure') || selectedChoiceIds.includes('unknown'),
  };

  const newAnswers = { ...state.answers, [question.id]: answer };
  const updatedState: ConversationState = {
    ...state,
    answers: newAnswers,
  };

  // 1. Immediately check for deterministic emergency flag
  const emergencyCheck = checkImmediateEmergency(updatedState, freeTextAnswer);

  if (emergencyCheck.isEmergency) {
    updatedState.emergencyTriggered = true;
    updatedState.isCompleted = true;
    const triageResult = evaluateTriage({
      animalType: updatedState.animalType,
      concernCategory: updatedState.selectedCategory,
      answers: newAnswers,
      freeTextNotes: freeTextAnswer,
    });
    updatedState.triageResult = triageResult;

    const alertMessage: AssistantMessage = {
      id: `alert-${Date.now()}`,
      sender: 'bot',
      text: `⚠️ **EMERGENCY WARNING DETECTED**\n\nBased on what you just shared: **${emergencyCheck.indicatorTitle}** (${emergencyCheck.description}).\n\nWe must not delay with further questions. This animal requires immediate professional veterinary attention. Please see the emergency protocol below and contact a nearby veterinary hospital right away.`,
      timestamp: new Date().toISOString(),
      isEmergencyAlert: true,
      triageResult,
    };

    return {
      updatedState,
      nextBotMessage: alertMessage,
      isEmergencyAlert: true,
    };
  }

  // 2. Fetch the question flow for this concern
  const questions = getQuestionsForConcern(state.animalType, state.selectedCategory);
  const nextIndex = state.currentQuestionIndex + 1;

  if (nextIndex < questions.length) {
    // Present next question
    const nextQuestion = questions[nextIndex];
    updatedState.currentQuestionIndex = nextIndex;

    const nextMessage: AssistantMessage = {
      id: `q-${nextQuestion.id}-${Date.now()}`,
      sender: 'bot',
      text: nextQuestion.text,
      timestamp: new Date().toISOString(),
      question: nextQuestion,
    };

    return {
      updatedState,
      nextBotMessage: nextMessage,
      isEmergencyAlert: false,
    };
  }

  // 3. All questions completed -> generate full triage assessment
  updatedState.isCompleted = true;
  const triageResult = evaluateTriage({
    animalType: updatedState.animalType,
    concernCategory: updatedState.selectedCategory,
    answers: newAnswers,
  });
  updatedState.triageResult = triageResult;

  let completionIntro = `Thank you for carefully answering these questions. Here is your initial safety assessment for the ${state.animalType}:`;

  if (triageResult.urgency === 'veterinary_assessment') {
    completionIntro = `Based on your observations, a physical veterinary assessment is strongly recommended to protect this ${state.animalType}'s health.`;
  } else if (triageResult.urgency === 'basic_care') {
    completionIntro = `No immediate high-risk warning signs were identified. Here are safe, supportive steps you can take right now to help the ${state.animalType} rest comfortably:`;
  }

  const resultMessage: AssistantMessage = {
    id: `result-${Date.now()}`,
    sender: 'bot',
    text: completionIntro,
    timestamp: new Date().toISOString(),
    triageResult,
  };

  return {
    updatedState,
    nextBotMessage: resultMessage,
    isEmergencyAlert: false,
  };
}

/**
 * Optional AI assistance: Analyzes image or complex free text while strictly adhering to safety rules
 */
export async function analyzeWithGeminiIfConfigured(
  userText: string,
  animalType: AnimalType,
  imageBase64?: string
): Promise<{ text: string; safetyNote?: string } | null> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!geminiApiKey || geminiApiKey === 'your-gemini-api-key-here') {
    return null; // Gracefully fall back to deterministic safety engine
  }

  try {
    const prompt = `You are PawCare, a calm, compassionate veterinary first-aid guidance assistant.
An ordinary person with no animal knowledge has found a stray or sick ${animalType}.
User stated: "${userText}"
${imageBase64 ? 'An image was attached.' : ''}

CRITICAL RULES:
1. NEVER diagnose a specific illness.
2. NEVER prescribe human medication (Paracetamol, Ibuprofen are toxic).
3. If signs of breathing struggle, collapse, severe bleeding, or poisoning are present, highlight urgent veterinary help immediately.
4. Keep explanation plain, warm, calm, short (under 3 sentences).
5. State clearly that this is an observational aid, not a veterinary diagnosis.`;

    const payload: any = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    if (imageBase64) {
      // Add inline image part
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      payload.contents[0].parts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      return {
        text: candidate,
        safetyNote: 'AI-assisted observation. Deterministic safety rules apply.',
      };
    }
    return null;
  } catch (err) {
    console.warn('Gemini API call failed, continuing with deterministic triage:', err);
    return null;
  }
}
