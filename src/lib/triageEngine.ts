import {
  AnimalType,
  TriageUrgency,
  TriageResultData,
  UserAnswer,
  EmergencyIndicator,
} from '../types/assistant';

export interface TriageEvaluationContext {
  animalType: AnimalType;
  concernCategory: string;
  answers: Record<string, UserAnswer>;
  freeTextNotes?: string;
}

/**
 * Deterministic Emergency Rule Definition
 */
export interface SafetyRule {
  id: string;
  code: string;
  title: string;
  description: string;
  animalType: AnimalType | 'all';
  concernCategory?: string;
  severity: 'critical' | 'high';
  evaluate: (context: TriageEvaluationContext) => boolean;
}

/**
 * Predefined deterministic clinical safety rules.
 * These rules CANNOT be downgraded or overridden by any LLM output.
 */
export const DETERMINISTIC_SAFETY_RULES: SafetyRule[] = [
  // 1. Unconsciousness / Unresponsiveness
  {
    id: 'rule_unresponsive',
    code: 'UNRESPONSIVE_COLLAPSE',
    title: 'Unresponsive or Collapsed State',
    description: 'The animal is unconscious, collapsed, or unable to wake or respond normally.',
    animalType: 'all',
    severity: 'critical',
    evaluate: ({ answers }) => {
      const respAns = answers['resp_awake'] || answers['general_consciousness'];
      if (respAns?.selectedChoiceIds.includes('no') || respAns?.selectedChoiceIds.includes('collapsed')) {
        return true;
      }
      const otherAns = answers['vomit_other_signs'] || answers['general_other_signs'];
      if (otherAns?.selectedChoiceIds.includes('weakness_collapse')) {
        return true;
      }
      return false;
    },
  },

  // 2. Respiratory Distress / Severe Breathing Difficulty
  {
    id: 'rule_breathing_distress',
    code: 'SEVERE_RESPIRATORY_DISTRESS',
    title: 'Difficulty Breathing or Gasping',
    description: 'The animal is struggling for breath, wheezing, gasping with neck extended, or open-mouth breathing.',
    animalType: 'all',
    severity: 'critical',
    evaluate: ({ answers, animalType }) => {
      const breathAns = answers['resp_breathing'] || answers['general_breathing'];
      if (breathAns?.selectedChoiceIds.includes('no') || breathAns?.selectedChoiceIds.includes('struggling') || breathAns?.selectedChoiceIds.includes('gasping')) {
        return true;
      }
      // For birds: open beak breathing is an immediate red alert
      if (animalType === 'bird' && (breathAns?.selectedChoiceIds.includes('tail_bobbing') || breathAns?.selectedChoiceIds.includes('beak_open'))) {
        return true;
      }
      return false;
    },
  },

  // 3. Suspected Poisoning or Toxic Ingestion
  {
    id: 'rule_suspected_poisoning',
    code: 'SUSPECTED_POISONING',
    title: 'Suspected Toxin or Chemical Ingestion',
    description: 'Possible exposure to rat poison, human medication (paracetamol, ibuprofen), cleaning chemicals, insecticides, or toxic plants.',
    animalType: 'all',
    severity: 'critical',
    evaluate: ({ answers, concernCategory, freeTextNotes }) => {
      if (concernCategory === 'poisoning') return true;
      const signs = answers['vomit_other_signs'] || answers['general_other_signs'] || answers['poison_type'];
      if (signs?.selectedChoiceIds.includes('poison_ingestion') || signs?.selectedChoiceIds.includes('medication_chemical')) {
        return true;
      }
      if (freeTextNotes) {
        const lower = freeTextNotes.toLowerCase();
        if (lower.includes('poison') || lower.includes('pesticide') || lower.includes('rat poison') || lower.includes('paracetamol') || lower.includes('ibuprofen') || lower.includes('phenyl')) {
          return true;
        }
      }
      return false;
    },
  },

  // 4. Canine Bloat / GDV (Gastric Dilatation-Volvulus)
  {
    id: 'rule_canine_gdv',
    code: 'DOG_BLOAT_GDV',
    title: 'Suspected Canine Bloat (GDV)',
    description: 'Distended abdomen combined with repeated non-productive retching is a rapid life-threatening canine emergency.',
    animalType: 'dog',
    severity: 'critical',
    evaluate: ({ answers }) => {
      const signs = answers['vomit_other_signs'];
      if (signs?.selectedChoiceIds.includes('swollen_abdomen_retching')) {
        return true;
      }
      const freq = answers['vomit_frequency']?.selectedChoiceIds.includes('repeated_continuous');
      const retch = answers['vomit_appearance']?.selectedChoiceIds.includes('dry_retching_foam');
      return Boolean(freq && retch);
    },
  },

  // 5. Severe Hemorrhage or Arterial Bleeding
  {
    id: 'rule_severe_bleeding',
    code: 'SEVERE_HEMORRHAGE',
    title: 'Active or Uncontrolled Bleeding',
    description: 'Pulsing, spurting, or continuously pooling blood that does not halt with gentle pressure.',
    animalType: 'all',
    severity: 'critical',
    evaluate: ({ answers, concernCategory }) => {
      if (concernCategory === 'injury') {
        const bleedAns = answers['injury_bleeding_severity'];
        if (bleedAns?.selectedChoiceIds.includes('pulsing_heavy') || bleedAns?.selectedChoiceIds.includes('continuous_heavy')) {
          return true;
        }
      }
      return false;
    },
  },

  // 6. Blood in Vomit (Hematemesis)
  {
    id: 'rule_blood_vomit',
    code: 'HEMATEMESIS',
    title: 'Blood or Coffee-Ground Material in Vomit',
    description: 'Indicates severe gastrointestinal mucosal damage, ulceration, severe trauma, or anticoagulant rodenticide poisoning.',
    animalType: 'all',
    severity: 'high',
    evaluate: ({ answers }) => {
      const appAns = answers['vomit_appearance'];
      return Boolean(appAns?.selectedChoiceIds.includes('blood_coffee_grounds'));
    },
  },

  // 7. Feline Urethral Obstruction / Straining
  {
    id: 'rule_feline_blockage',
    code: 'CAT_URETHRAL_BLOCKAGE',
    title: 'Suspected Feline Urinary Blockage',
    description: 'Male cats straining to urinate, vocalizing in pain, or frequent unproductive trips to the litter box are medical emergencies fatal within 24-48 hours.',
    animalType: 'cat',
    severity: 'critical',
    evaluate: ({ answers }) => {
      const ans = answers['cat_urinary_signs'];
      return Boolean(ans?.selectedChoiceIds.includes('straining_vocalizing') || ans?.selectedChoiceIds.includes('no_urine_produced'));
    },
  },

  // 8. Feline Lily Toxicity
  {
    id: 'rule_cat_lily_exposure',
    code: 'CAT_LILY_TOXICITY',
    title: 'Lily Ingestion or Exposure in Cats',
    description: 'All parts of True Lilies (Lilium) and Daylilies (Hemerocallis) cause acute fatal kidney failure in cats.',
    animalType: 'cat',
    severity: 'critical',
    evaluate: ({ answers, freeTextNotes }) => {
      const ans = answers['poison_type'] || answers['cat_toxin'];
      if (ans?.selectedChoiceIds.includes('lily_flower')) return true;
      if (freeTextNotes?.toLowerCase().includes('lily') || freeTextNotes?.toLowerCase().includes('lilies')) return true;
      return false;
    },
  },

  // 9. Bovine Bloat (Rumen Tympany)
  {
    id: 'rule_bovine_bloat',
    code: 'COW_RUMEN_BLOAT',
    title: 'Severe Left-Flank Distension (Bovine Tympany)',
    description: 'Enlarged left flank, grunting, kicking at belly, or recumbency in cattle requires urgent veterinary decompression.',
    animalType: 'cow',
    severity: 'critical',
    evaluate: ({ answers }) => {
      const ans = answers['cow_bloat_signs'];
      return Boolean(ans?.selectedChoiceIds.includes('distended_left_flank') || ans?.selectedChoiceIds.includes('down_unable_stand'));
    },
  },

  // 10. Avian Critical Collapse
  {
    id: 'rule_avian_critical',
    code: 'BIRD_CRITICAL_COLLAPSE',
    title: 'Avian Critical Fluffed Collapse',
    description: 'A bird sitting on the ground with puffed feathers, closed eyes, or wing droop is in advanced decompensation.',
    animalType: 'bird',
    severity: 'critical',
    evaluate: ({ answers }) => {
      const ans = answers['bird_signs'];
      return Boolean(ans?.selectedChoiceIds.includes('bottom_of_cage_puffed') || ans?.selectedChoiceIds.includes('bleeding_blood_feather'));
    },
  },
];

/**
 * Evaluates the conversation context against deterministic rules
 * and returns categorized triage guidance.
 */
export function evaluateTriage(context: TriageEvaluationContext): TriageResultData {
  const { animalType, concernCategory, answers } = context;

  // 1. Scan for critical emergency indicators
  const emergencyIndicators: EmergencyIndicator[] = [];

  for (const rule of DETERMINISTIC_SAFETY_RULES) {
    if (rule.animalType === 'all' || rule.animalType === animalType) {
      if (rule.evaluate(context)) {
        emergencyIndicators.push({
          code: rule.code,
          title: rule.title,
          description: rule.description,
          sourceQuestionId: rule.id,
          severity: rule.severity,
        });
      }
    }
  }

  // 2. Count unknown answers
  let unknownCount = 0;
  Object.values(answers).forEach((ans) => {
    if (
      ans.isUnknown ||
      ans.selectedChoiceIds.includes('not_sure') ||
      ans.selectedChoiceIds.includes('unknown')
    ) {
      unknownCount++;
    }
  });

  // 3. Determine Urgency Category
  let urgency: TriageUrgency = 'basic_care';
  let urgencyTitle = '';
  let urgencySubtitle = '';

  const isCritical = emergencyIndicators.some((i) => i.severity === 'critical');
  const isHigh = emergencyIndicators.length > 0;

  // Secondary indicators that warrant Veterinary Assessment (Category 2)
  const isRepeatedVomiting =
    answers['vomit_frequency']?.selectedChoiceIds.includes('more_than_once') ||
    answers['vomit_frequency']?.selectedChoiceIds.includes('repeated_continuous');
  const isPuppyOrKitten =
    answers['animal_age']?.selectedChoiceIds.includes('puppy_kitten');
  const isDehydrated =
    answers['hydration_signs']?.selectedChoiceIds.includes('gums_dry_tacky') ||
    answers['vomit_keep_water']?.selectedChoiceIds.includes('cannot_keep_water');
  const prolongedDuration =
    answers['duration']?.selectedChoiceIds.includes('yesterday_or_longer') ||
    answers['vomit_duration']?.selectedChoiceIds.includes('yesterday_or_longer');
  const visibleWound =
    concernCategory === 'injury' &&
    !answers['injury_bleeding_severity']?.selectedChoiceIds.includes('pulsing_heavy');
  const notEating =
    concernCategory === 'not_eating' && prolongedDuration;

  if (isCritical || (isHigh && emergencyIndicators.some((i) => i.severity === 'critical'))) {
    urgency = 'emergency';
    urgencyTitle = 'Category 1: Emergency — Seek Immediate Veterinary Help';
    urgencySubtitle = 'Serious warning signs were identified. The animal requires urgent professional medical intervention.';
  } else if (
    isHigh ||
    isRepeatedVomiting ||
    isPuppyOrKitten ||
    isDehydrated ||
    prolongedDuration ||
    visibleWound ||
    notEating ||
    unknownCount >= 3 // Cautious principle: high uncertainty -> professional examination advised
  ) {
    urgency = 'veterinary_assessment';
    urgencyTitle = 'Category 2: Veterinary Assessment Recommended';
    urgencySubtitle = 'Symptoms suggest a condition that requires physical veterinary examination, although immediate collapse was not reported.';
  } else {
    urgency = 'basic_care';
    urgencyTitle = 'Category 3: Basic Support and Close Observation';
    urgencySubtitle = 'No immediate warning signs reported. Provide safe supportive care, keep the animal quiet, and monitor closely.';
  }

  // 4. Formulate Safe Interim Steps & What NOT to do based on species & concern
  const safeInterimSteps = getSafeInterimSteps(animalType, concernCategory, urgency);
  const whatNotToDo = getWhatNotToDo(animalType, concernCategory);
  const whenToEscalate = getWhenToEscalate(animalType, concernCategory);

  const identifiedRisks = emergencyIndicators.map(
    (ind) => `${ind.title}: ${ind.description}`
  );
  if (unknownCount > 0) {
    identifiedRisks.push(
      `${unknownCount} question(s) marked as 'Not Sure'. When key facts are unknown, safe caution requires monitoring for subtle deterioration.`
    );
  }

  return {
    urgency,
    urgencyTitle,
    urgencySubtitle,
    animalType,
    concernCategory,
    emergencyIndicators,
    unknownAnswersCount: unknownCount,
    identifiedRisks,
    safeInterimSteps,
    whatNotToDo,
    whenToEscalate,
    reasonForReferral:
      urgency !== 'basic_care'
        ? `Identified indicators: ${emergencyIndicators.map((e) => e.title).join(', ') || 'Persistent or high-risk clinical symptoms'}`
        : undefined,
    disclaimer:
      'Preliminary first-aid guidance only. PawCare cannot diagnose medical conditions or replace a physical veterinary examination. If in doubt, contact a licensed veterinarian.',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Species & category specific safe interim steps
 */
function getSafeInterimSteps(
  animalType: AnimalType,
  concernCategory: string,
  urgency: TriageUrgency
): string[] {
  const steps: string[] = [];

  if (urgency === 'emergency') {
    steps.push('Keep the animal calm, still, and warm in a secure, quiet, shaded space.');
    steps.push('Immediately contact the nearest emergency veterinary facility to alert them of your arrival.');
    steps.push('During transit, support the spine and head, keeping the neck gently extended for open airways.');
    if (concernCategory === 'poisoning') {
      steps.push('Take a clear photograph of the suspected packaging, chemical bottle, or plant to show the vet.');
    }
    return steps;
  }

  // General safe basic steps
  steps.push('Provide a calm, temperature-controlled, quiet resting spot away from loud noises, other animals, and traffic.');
  
  if (concernCategory === 'vomiting') {
    steps.push('Rest the stomach: Withhold food for 2 to 4 hours to avoid triggering immediate gastric spasms.');
    steps.push('Offer small sips (a few tablespoons) of fresh, room-temperature water. Do not allow large gulps.');
  } else if (concernCategory === 'injury') {
    steps.push('Apply gentle, clean pressure with a sterile gauze pad or clean cotton cloth to minor superficial cuts.');
    steps.push('Prevent the animal from licking or scratching the wound by supervising closely.');
  } else if (concernCategory === 'heat_stress') {
    steps.push('Move animal to cool shade immediately. Wet paws, ears, and groin with cool (NOT freezing cold or ice) water.');
    steps.push('Offer small amounts of cool drinking water.');
  } else {
    steps.push('Observe respiration rate, gum color (should be healthy pink, not pale white, blue, or yellow), and energy levels.');
    steps.push('Ensure clean, accessible drinking water is nearby.');
  }

  if (animalType === 'cat') {
    steps.push('Feline safety: Never use flea or tick medications meant for dogs, as permethrin is fatal to cats.');
  } else if (animalType === 'bird') {
    steps.push('Avian safety: Keep bird in a dark, warm, well-ventilated box with a soft towel at the bottom to minimize stress.');
  }

  return steps;
}

/**
 * Strict Veterinary "What NOT to do" Rules
 */
function getWhatNotToDo(animalType: AnimalType, concernCategory: string): string[] {
  const list = [
    'NEVER administer human medications such as Paracetamol (Crocin/Tylenol), Ibuprofen (Advil), or Aspirin — these cause acute liver or kidney failure.',
    'Do NOT force-feed food or liquids to an animal that is weak, lying down, or having difficulty swallowing, as it may aspirate into the lungs.',
    'Do NOT attempt to induce vomiting at home (e.g. using salt or hydrogen peroxide) without direct veterinary instruction. Corrosive substances cause severe esophagus burns upon regurgitation.',
    'Do NOT apply harsh chemical antiseptics, alcohol, Dettol, or pure hydrogen peroxide directly into deep open wounds.',
  ];

  if (animalType === 'cat') {
    list.push('NEVER use essential oils, tea tree oil, or dog-formulated flea products on cats.');
  }

  if (animalType === 'cow') {
    list.push('Do NOT allow a severely bloated cow to lie flat on its side if avoidable; keep sternally recumbent while awaiting the vet.');
  }

  return list;
}

/**
 * Triggers for immediate escalation
 */
function getWhenToEscalate(animalType: AnimalType, concernCategory: string): string[] {
  return [
    'Animal becomes uncoordinated, lethargic, or unresponsive.',
    'Breathing becomes labored, shallow, rapid, or produces audible wheezing/gurgling.',
    'Gums turn pale white, blue, dark purple, or bright brick-red.',
    'Vomiting persists more than twice in 6 hours, or blood is observed in vomit or stool.',
    'Animal exhibits signs of severe abdominal discomfort (whining, guarding belly, unable to settle).',
  ];
}
