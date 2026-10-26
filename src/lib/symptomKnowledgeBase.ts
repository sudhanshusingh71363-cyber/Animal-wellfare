import { SymptomQuestion, AnimalType } from '../types/assistant';

export interface ConcernDefinition {
  id: string;
  name: string;
  shortLabel: string;
  icon: string;
  description: string;
  relevantAnimals: (AnimalType | 'all')[];
}

export const CONCERN_CATEGORIES: ConcernDefinition[] = [
  {
    id: 'vomiting',
    name: 'Vomiting or feeling sick',
    shortLabel: 'Vomiting',
    icon: 'AlertCircle',
    description: 'Animal threw up, is gagging, retching, or spitting up foamy fluid.',
    relevantAnimals: ['all'],
  },
  {
    id: 'injury',
    name: 'Injury, bleeding, or wound',
    shortLabel: 'Injury & Bleeding',
    icon: 'ShieldAlert',
    description: 'Visible cuts, active bleeding, bite wounds, punctures, or limb limping.',
    relevantAnimals: ['all'],
  },
  {
    id: 'breathing',
    name: 'Difficulty breathing or gasping',
    shortLabel: 'Breathing Difficulty',
    icon: 'Wind',
    description: 'Rapid shallow breathing, gasping for air, open-mouth breathing, or audible wheezing.',
    relevantAnimals: ['all'],
  },
  {
    id: 'weakness',
    name: 'Weakness, collapse, or unconsciousness',
    shortLabel: 'Weakness / Collapse',
    icon: 'HeartPulse',
    description: 'Unable to stand, unsteady gait, lying limp, or unresponsive to calls.',
    relevantAnimals: ['all'],
  },
  {
    id: 'poisoning',
    name: 'Possible poisoning or swallowed danger',
    shortLabel: 'Possible Poisoning',
    icon: 'Skull',
    description: 'Ingested toxic plant, rat poison, medication, chocolate, or cleaning chemicals.',
    relevantAnimals: ['all'],
  },
  {
    id: 'heat_stress',
    name: 'Heatstroke, dehydration, or exhaustion',
    shortLabel: 'Heatstroke / Dehydration',
    icon: 'Sun',
    description: 'Excessive panting, sticky dry gums, drooling, or collapsed in hot weather.',
    relevantAnimals: ['all'],
  },
  {
    id: 'not_eating',
    name: 'Not eating or drinking (Loss of appetite)',
    shortLabel: 'Not Eating / Drinking',
    icon: 'UtensilsCrossed',
    description: 'Refusing food or water for 24+ hours, dull coat, or lethargic.',
    relevantAnimals: ['all'],
  },
  {
    id: 'urinary_feline',
    name: 'Straining to urinate (Feline alert)',
    shortLabel: 'Urinary Blockage',
    icon: 'Activity',
    description: 'Frequent trips to litter box with crying or no urine passed. High emergency!',
    relevantAnimals: ['cat'],
  },
  {
    id: 'bloat_bovine',
    name: 'Swollen belly / Bloat (Bovine & Ruminant)',
    shortLabel: 'Bovine Bloat',
    icon: 'Gauge',
    description: 'Left side of belly distended like a drum, restlessness, or kicking belly.',
    relevantAnimals: ['cow'],
  },
  {
    id: 'trapped',
    name: 'Trapped, tangled, or in physical danger',
    shortLabel: 'Trapped / In Danger',
    icon: 'HelpCircle',
    description: 'Stuck in drainage, wire entanglement, well, road hazard, or height.',
    relevantAnimals: ['all'],
  },
  {
    id: 'something_else',
    name: 'Something else / Eye, skin, or behavior change',
    shortLabel: 'Other Concern',
    icon: 'HelpCircle',
    description: 'Eye discharge, severe scratching, fur loss, sudden aggression or fear.',
    relevantAnimals: ['all'],
  },
];

/**
 * Question flows organized by concern category and animal species.
 */
export const QUESTION_FLOWS: Record<string, SymptomQuestion[]> = {
  // 1. Vomiting workflow (exact prompt specifications + safety checks)
  vomiting: [
    {
      id: 'resp_awake',
      text: 'Is the animal awake and responding normally to sounds and your voice?',
      plainLanguageClarification: 'Does the animal open its eyes, lift its head, or react when you call or tap nearby?',
      concernCategory: 'vomiting',
      type: 'single_choice',
      choices: [
        { id: 'yes', label: 'Yes, awake and alert' },
        { id: 'no', label: 'No, unconscious, dull, or barely responsive', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure / Hard to tell' },
      ],
      allowNotSure: true,
      order: 1,
    },
    {
      id: 'resp_breathing',
      text: 'Is the animal breathing normally?',
      plainLanguageClarification: 'Normal breathing is smooth and quiet. Check if the chest is heaving violently, gasping, or very shallow.',
      concernCategory: 'vomiting',
      type: 'single_choice',
      choices: [
        { id: 'yes', label: 'Yes, breathing smoothly' },
        { id: 'no', label: 'No, struggling, gasping, or very rapid/labored', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 2,
    },
    {
      id: 'vomit_frequency',
      text: 'How many times has the animal vomited?',
      plainLanguageClarification: 'An isolated single episode is often less dangerous than repeated violent retching.',
      concernCategory: 'vomiting',
      type: 'single_choice',
      choices: [
        { id: 'once', label: 'Once' },
        { id: 'more_than_once', label: 'More than once (2–3 times)' },
        { id: 'repeated_continuous', label: 'Repeatedly or continuously', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 3,
    },
    {
      id: 'vomit_appearance',
      text: 'What does the vomit look like?',
      plainLanguageClarification: 'Observing color and contents helps distinguish dietary upset from internal bleeding or obstruction.',
      concernCategory: 'vomiting',
      type: 'single_choice',
      choices: [
        { id: 'food_liquid', label: 'Undigested food or clear liquid' },
        { id: 'yellowish_fluid', label: 'Yellow or greenish fluid (bile)' },
        { id: 'blood_coffee_grounds', label: 'Blood or dark material resembling coffee grounds', isEmergencyFlag: true },
        { id: 'dry_retching_foam', label: 'White foam with dry retching (nothing comes up)', isEmergencyFlag: true },
        { id: 'foreign_matter', label: 'Plastic, cloth, trash, or foreign objects' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 4,
    },
    {
      id: 'vomit_other_signs',
      text: 'Is the animal showing any other signs?',
      plainLanguageClarification: 'Select all that apply. These help identify life-threatening conditions like bloat, toxicity, or internal trauma.',
      concernCategory: 'vomiting',
      type: 'multiple_choice',
      choices: [
        { id: 'swollen_abdomen_retching', label: 'Swollen/hard abdomen or repeated unsuccessful retching', isEmergencyFlag: true },
        { id: 'weakness_collapse', label: 'Severe weakness, unable to stand, or collapse', isEmergencyFlag: true },
        { id: 'poison_ingestion', label: 'Possible ingestion of poison, medication, or chemicals', isEmergencyFlag: true },
        { id: 'difficulty_standing', label: 'Wobbly gait or difficulty standing' },
        { id: 'diarrhea', label: 'Diarrhea or loose stools' },
        { id: 'none', label: 'No other obvious signs' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 5,
    },
    {
      id: 'vomit_duration',
      text: 'When did the problem start?',
      plainLanguageClarification: 'Knowing the timeline helps assess dehydration risk.',
      concernCategory: 'vomiting',
      type: 'single_choice',
      choices: [
        { id: 'just_now', label: 'Just now (within the last hour)' },
        { id: 'few_hours_ago', label: 'A few hours ago' },
        { id: 'yesterday_or_longer', label: 'Since yesterday or longer' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 6,
    },
    {
      id: 'vomit_keep_water',
      text: 'Can the animal keep water down, or does drinking trigger immediate vomiting?',
      plainLanguageClarification: 'Inability to keep water down leads rapidly to dangerous dehydration and points to gastrointestinal blockage.',
      concernCategory: 'vomiting',
      type: 'single_choice',
      choices: [
        { id: 'can_drink', label: 'Can drink small amounts without vomiting' },
        { id: 'cannot_keep_water', label: 'Vomits immediately after drinking water' },
        { id: 'refuses_water', label: 'Refusing to drink water entirely' },
        { id: 'not_sure', label: 'Not sure / Haven’t offered water' },
      ],
      allowNotSure: true,
      order: 7,
    },
    {
      id: 'animal_age',
      text: 'Is this animal an adult or a young puppy / kitten?',
      plainLanguageClarification: 'Puppies and kittens have low glucose reserves and dehydrate within hours from vomiting (high Parvovirus/Panleukopenia risk).',
      concernCategory: 'vomiting',
      type: 'single_choice',
      choices: [
        { id: 'adult', label: 'Adult animal' },
        { id: 'puppy_kitten', label: 'Young puppy or kitten (under 6 months)' },
        { id: 'senior', label: 'Senior animal' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 8,
    },
  ],

  // 2. Injury & Bleeding workflow
  injury: [
    {
      id: 'injury_bleeding_severity',
      text: 'How severe is the bleeding?',
      plainLanguageClarification: 'Pulsing or spurting blood comes from an artery and requires emergency veterinary care immediately.',
      concernCategory: 'injury',
      type: 'single_choice',
      choices: [
        { id: 'pulsing_heavy', label: 'Blood is spurting, pulsing, or pooling rapidly', isEmergencyFlag: true },
        { id: 'continuous_heavy', label: 'Steadily bleeding and soaking through cloth', isEmergencyFlag: true },
        { id: 'minor_oozing', label: 'Minor scrape, shallow cut, or slight oozing' },
        { id: 'no_active_bleed', label: 'Swollen or limping, but no active bleeding seen' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 1,
    },
    {
      id: 'injury_mobility',
      text: 'Can the animal bear weight or walk?',
      plainLanguageClarification: 'Inability to move limbs or dragging hind legs can indicate spinal damage or bone fracture.',
      concernCategory: 'injury',
      type: 'single_choice',
      choices: [
        { id: 'can_walk', label: 'Yes, walks with slight limp' },
        { id: 'cannot_bear_weight', label: 'Cannot put any weight on one leg' },
        { id: 'dragging_hind_legs', label: 'Dragging back legs / Unable to stand', isEmergencyFlag: true },
        { id: 'completely_immobile', label: 'Unable to get up at all', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 2,
    },
    {
      id: 'injury_bone_exposure',
      text: 'Are there open wounds with exposed bone or deep muscle tears?',
      plainLanguageClarification: 'Compound fractures carry severe risk of bone infection (osteomyelitis) and shock.',
      concernCategory: 'injury',
      type: 'single_choice',
      choices: [
        { id: 'bone_visible', label: 'Yes, bone or deep tissue is visible', isEmergencyFlag: true },
        { id: 'deep_puncture', label: 'Deep bite wound or puncture tear' },
        { id: 'surface_scrape', label: 'Surface scratch or scrape only' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 3,
    },
  ],

  // 3. Respiratory distress workflow
  breathing: [
    {
      id: 'general_breathing',
      text: 'What does the breathing look like?',
      plainLanguageClarification: 'Look at the chest and nostrils. Is the neck stretched out or making choking noises?',
      concernCategory: 'breathing',
      type: 'single_choice',
      choices: [
        { id: 'struggling', label: 'Struggling hard, neck stretched forward, gasping', isEmergencyFlag: true },
        { id: 'rapid_shallow', label: 'Very fast, shallow panting in cool temperature' },
        { id: 'noisy_stridor', label: 'Choking sounds, harsh raspy breathing, or wheezing', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 1,
    },
    {
      id: 'mucous_color',
      text: 'What color are the animal\'s gums or tongue?',
      plainLanguageClarification: 'Healthy gums are light salmon pink. Blue, purple, grey, or dead-white indicates oxygen deprivation or internal shock.',
      concernCategory: 'breathing',
      type: 'single_choice',
      choices: [
        { id: 'pink', label: 'Healthy pink' },
        { id: 'pale_white', label: 'Very pale white or grey', isEmergencyFlag: true },
        { id: 'blue_purple', label: 'Blueish or purple (Cyanosis)', isEmergencyFlag: true },
        { id: 'bright_red', label: 'Bright brick-red' },
        { id: 'not_sure', label: 'Cannot safely check or not sure' },
      ],
      allowNotSure: true,
      order: 2,
    },
  ],

  // 4. Poisoning workflow
  poisoning: [
    {
      id: 'poison_type',
      text: 'What do you suspect the animal came into contact with?',
      plainLanguageClarification: 'Different toxins require specific veterinary antidotes. Never induce vomiting blindly.',
      concernCategory: 'poisoning',
      type: 'multiple_choice',
      choices: [
        { id: 'rat_poison', label: 'Rat poison or rodenticide bait', isEmergencyFlag: true },
        { id: 'medication_human', label: 'Human medicines (Paracetamol, Crocin, Advil, Aspirin)', isEmergencyFlag: true },
        { id: 'chemicals', label: 'Insecticide, pesticide, phenyl, bleach, or cleaning acids', isEmergencyFlag: true },
        { id: 'toxic_food', label: 'Dark chocolate, raisins, grapes, or xylitol gum' },
        { id: 'lily_flower', label: 'Lilies or hazardous plants (Fatal to cats)', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Unknown substance / Not sure' },
      ],
      allowNotSure: true,
      order: 1,
    },
    {
      id: 'poison_symptoms',
      text: 'Is the animal having seizures, tremors, or foaming at the mouth?',
      plainLanguageClarification: 'Neurological symptoms from neurotoxins progress rapidly into respiratory arrest.',
      concernCategory: 'poisoning',
      type: 'single_choice',
      choices: [
        { id: 'seizures_foaming', label: 'Yes, seizing, muscle spasms, or heavy drooling/foam', isEmergencyFlag: true },
        { id: 'wobbly_lethargic', label: 'Unsteady, dazed, or very sluggish' },
        { id: 'no_seizures', label: 'No tremors or seizures observed yet' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 2,
    },
  ],

  // 5. Cat specific urinary alert
  urinary_feline: [
    {
      id: 'cat_urinary_signs',
      text: 'What specific signs are you observing in this cat?',
      plainLanguageClarification: 'Feline lower urinary tract disease can cause complete urethral obstruction in male cats. It is agonizing and rapidly fatal.',
      concernCategory: 'urinary_feline',
      type: 'single_choice',
      choices: [
        { id: 'straining_vocalizing', label: 'Squatting, straining, crying in litter box, no urine coming out', isEmergencyFlag: true },
        { id: 'frequent_licking', label: 'Obsessively licking genitals or hiding in distress' },
        { id: 'small_drops_blood', label: 'Passing small drops of bloody urine', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 1,
    },
  ],

  // 6. Bovine bloat alert
  bloat_bovine: [
    {
      id: 'cow_bloat_signs',
      text: 'What signs are you noticing on this cow or calf?',
      plainLanguageClarification: 'Bovine rumen bloat expands against the diaphragm, preventing the lungs from expanding.',
      concernCategory: 'bloat_bovine',
      type: 'single_choice',
      choices: [
        { id: 'distended_left_flank', label: 'Left flank swollen high and tight like a drum', isEmergencyFlag: true },
        { id: 'down_unable_stand', label: 'Lying down (recumbent), unable to rise, groaning', isEmergencyFlag: true },
        { id: 'mouth_froth', label: 'Drooling froth with tongue protruding', isEmergencyFlag: true },
        { id: 'mild_belly', label: 'Slightly enlarged belly, still grazing slowly' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 1,
    },
  ],

  // 7. General fallback questions for other concerns
  something_else: [
    {
      id: 'general_consciousness',
      text: 'Is the animal awake, responsive, and able to stand?',
      plainLanguageClarification: 'Check whether the animal can respond to your voice or food from a safe distance.',
      concernCategory: 'something_else',
      type: 'single_choice',
      choices: [
        { id: 'alert_standing', label: 'Awake and standing or walking' },
        { id: 'lying_dull', label: 'Lying down and very sluggish/dull' },
        { id: 'collapsed', label: 'Collapsed or barely responding', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 1,
    },
    {
      id: 'general_breathing',
      text: 'Is the animal breathing normally?',
      plainLanguageClarification: 'Check for gasping, open-mouth panting in cold weather, or heavy stomach movements.',
      concernCategory: 'something_else',
      type: 'single_choice',
      choices: [
        { id: 'normal', label: 'Yes, normal smooth breathing' },
        { id: 'struggling', label: 'No, struggling or gasping for breath', isEmergencyFlag: true },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 2,
    },
    {
      id: 'duration',
      text: 'How long have you noticed this issue?',
      plainLanguageClarification: 'Helps determine whether this is an acute crisis or chronic condition.',
      concernCategory: 'something_else',
      type: 'single_choice',
      choices: [
        { id: 'just_noticed', label: 'Just noticed (under an hour)' },
        { id: 'few_hours', label: 'A few hours' },
        { id: 'yesterday_or_longer', label: 'Since yesterday or longer' },
        { id: 'not_sure', label: 'Not sure' },
      ],
      allowNotSure: true,
      order: 3,
    },
  ],
};

/**
 * Returns relevant questions for a given animal and concern category.
 */
export function getQuestionsForConcern(
  animalType: AnimalType,
  concernCategory: string
): SymptomQuestion[] {
  // If cat with urinary signs
  if (animalType === 'cat' && (concernCategory === 'urinary_feline' || concernCategory === 'something_else')) {
    if (concernCategory === 'urinary_feline') {
      return QUESTION_FLOWS.urinary_feline;
    }
  }

  // If cow with bloat
  if (animalType === 'cow' && concernCategory === 'bloat_bovine') {
    return QUESTION_FLOWS.bloat_bovine;
  }

  const baseFlow = QUESTION_FLOWS[concernCategory] || QUESTION_FLOWS.something_else;

  // Filter or augment species specifics
  return baseFlow.map((q) => {
    // Adapt text for specific species if question references generic animal
    let adaptedText = q.text;
    if (animalType !== 'other') {
      adaptedText = adaptedText.replace(/the animal/gi, `the ${animalType}`);
    }
    return {
      ...q,
      text: adaptedText,
    };
  });
}
