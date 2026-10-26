import { VeterinaryClinic } from '../types/clinic';
import { WellnessResource, WellnessQuote, SuccessStory } from '../types/database';

export const SEED_VERIFIED_CLINICS: VeterinaryClinic[] = [
  {
    id: 'clinic-1',
    name: 'Friendicoes SECA Emergency Veterinary Hospital',
    address: '271 & 272, Flyover Market, Defence Colony',
    city: 'New Delhi',
    pinCode: '110024',
    phone: '+91 11 2432 0707',
    emergencyPhone: '+91 98733 02580',
    hasEmergencyService: true,
    isOpen24Hours: true,
    openingHours: 'Open 24/7 (Emergency triage & ambulance)',
    latitude: 28.5726,
    longitude: 77.2343,
    verified: true,
    notes: 'Non-profit animal welfare hospital equipped with X-ray, surgical OT, and isolation ward.',
    source: 'verified_db',
  },
  {
    id: 'clinic-2',
    name: 'Sanjay Gandhi Animal Care Centre (SGACC)',
    address: 'Raja Garden, Shivaji College Road',
    city: 'New Delhi',
    pinCode: '110027',
    phone: '+91 11 2544 8062',
    emergencyPhone: '+91 11 2544 7751',
    hasEmergencyService: true,
    isOpen24Hours: true,
    openingHours: '24 Hours Emergency Service',
    latitude: 28.6517,
    longitude: 77.1219,
    verified: true,
    notes: 'Largest 24/7 animal care center in Asia with dedicated trauma, cattle, and avian wards.',
    source: 'verified_db',
  },
  {
    id: 'clinic-3',
    name: 'Bai Sakarbai Dinshaw Petit Hospital for Animals (BSDH)',
    address: 'Dr. S.S. Rao Road, Parel',
    city: 'Mumbai',
    pinCode: '400012',
    phone: '+91 22 2413 7518',
    emergencyPhone: '+91 22 2413 5434',
    hasEmergencyService: true,
    isOpen24Hours: true,
    openingHours: 'Open 24/7 Emergency Casualty',
    latitude: 18.9986,
    longitude: 72.8427,
    verified: true,
    notes: 'Historic 14-acre veterinary hospital with dedicated trauma, equine, and stray animal care.',
    source: 'verified_db',
  },
  {
    id: 'clinic-4',
    name: 'CUPA Veterinary Hospital (RT Nagar)',
    address: 'KVAFSU Campus, Bellary Road, Hebbal',
    city: 'Bengaluru',
    pinCode: '560024',
    phone: '+91 80 2294 7300',
    emergencyPhone: '+91 80 2294 7307',
    hasEmergencyService: true,
    isOpen24Hours: true,
    openingHours: '24/7 Trauma and Critical Care',
    latitude: 13.0358,
    longitude: 77.5878,
    verified: true,
    notes: 'Compassion Unlimited Plus Action emergency trauma center & surgical unit.',
    source: 'verified_db',
  },
  {
    id: 'clinic-5',
    name: 'RESQ Charitable Trust Wildlife & Small Animal Hospital',
    address: 'Plot 390, Paud Road, Bhugaon',
    city: 'Pune',
    pinCode: '411042',
    phone: '+91 98909 99111',
    emergencyPhone: '+91 98909 99111',
    hasEmergencyService: true,
    isOpen24Hours: true,
    openingHours: '24/7 Emergency Helpline & Center',
    latitude: 18.5089,
    longitude: 73.7485,
    verified: true,
    notes: 'Specialized trauma center for street dogs, cats, large ruminants, and native wildlife.',
    source: 'verified_db',
  },
  {
    id: 'clinic-6',
    name: 'Blue Cross of India Animal Hospital',
    address: '72, Velachery Main Road, Guindy',
    city: 'Chennai',
    pinCode: '600032',
    phone: '+91 44 2235 4959',
    emergencyPhone: '+91 44 2230 0655',
    hasEmergencyService: true,
    isOpen24Hours: false,
    openingHours: '08:00 AM – 08:00 PM Daily (Emergency intake open)',
    latitude: 13.0067,
    longitude: 80.2206,
    verified: true,
    notes: 'Free street animal outpatient clinic, sterilization wing, and bird rescue sanctuary.',
    source: 'verified_db',
  },
  {
    id: 'clinic-7',
    name: 'RSPCA Harmsworth Animal Hospital',
    address: '22 Somers Town, Holloway',
    city: 'London',
    pinCode: 'N7 9PW',
    phone: '+44 300 123 0712',
    hasEmergencyService: true,
    isOpen24Hours: true,
    openingHours: '24 Hours Emergency Admission',
    latitude: 51.5542,
    longitude: -0.1189,
    verified: true,
    notes: 'RSPCA flagship animal trauma hospital with fully certified surgical & intensive care.',
    source: 'verified_db',
  },
  {
    id: 'clinic-8',
    name: 'Animal Medical Center (The Schwarzman AMC)',
    address: '510 E 62nd St',
    city: 'New York',
    pinCode: '10065',
    phone: '+1 212 838 8100',
    emergencyPhone: '+1 212 838 8100',
    hasEmergencyService: true,
    isOpen24Hours: true,
    openingHours: 'Open 24/7/365 Non-stop Emergency & Critical Care',
    latitude: 40.7608,
    longitude: -73.9575,
    verified: true,
    notes: 'World-renowned non-profit veterinary teaching hospital with Level 1 trauma designation.',
    source: 'verified_db',
  },
];

export const SEED_WELLNESS_RESOURCES: WellnessResource[] = [
  {
    id: 'res-1',
    title: 'Recognizing Common Signs of Sickness in Street Animals',
    category: 'Basic Health',
    summary: 'A beginner\'s visual guide to identifying subtle signs of pain, lethargy, fever, and dehydration in community dogs and cats.',
    content: `When animals are sick or injured, their natural survival instinct is often to mask weakness. Ordinary citizens can spot these early distress indicators:
1. **Posture & Gait**: Head hanging low, arched back, reluctance to move, or leaning against walls.
2. **Eyes & Discharge**: Crusty eyes, cloudiness, third eyelid visible (cherry eye or dehydration), or purulent nasal mucus.
3. **Coat & Skin**: Rough, unkempt fur, severe localized scratching, bald patches (mange), or visible open ticks and fly-strike wounds.
4. **Respiration**: Rapid abdominal heaving, panting when it is cool outside, or audible crackling breathing.
5. **Gums**: Press gently on the upper gum — a healthy gum is light salmon pink and returns to pink in under 2 seconds. Pale white, grey, or yellow gums require immediate veterinary attention.`,
    animalType: 'all',
    authoritativeSource: 'World Small Animal Veterinary Association (WSAVA)',
    tags: ['Triage', 'Beginner Guide', 'First Aid'],
    readTimeMinutes: 4,
    published: true,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'res-2',
    title: 'How to Safely Approach Frightened or Injured Animals',
    category: 'Safety & Handling',
    summary: 'Critical protocols to protect both yourself and a traumatized animal from accidental defensive bites and stress.',
    content: `An animal in severe pain does not understand you are trying to help. Fear aggression is a biological defense reflex:
1. **Never Loom or Tower Over Them**: Crouch down sideways at a safe distance. Never stare directly into their eyes, as direct eye contact is perceived as a predatory challenge.
2. **Speak in a Soft, Monotone Voice**: High-pitched squealing or sudden shouting triggers fight-or-flight panic.
3. **Use a Gentle Barrier**: For medium-to-large dogs, carry a thick blanket or towel. Dropping a towel loosely over their eyes and head creates a calming darkness and reduces defensive biting during lifting.
4. **Avoid Tight Chest Hugs**: Lifting an animal by squeezing its abdomen can rupture internal organs if it was hit by a vehicle. Use a firm cardboard sheet, wooden board, or taut blanket as a makeshift stretcher.`,
    animalType: 'all',
    authoritativeSource: 'Humane Society Veterinary Medical Association',
    tags: ['Safety', 'Handling', 'Rescue Skills'],
    readTimeMinutes: 5,
    published: true,
    createdAt: '2026-01-20T12:00:00Z',
  },
  {
    id: 'res-3',
    title: 'Heatstroke & Dehydration: Summer Emergency Action Plan',
    category: 'Emergency Care',
    summary: 'How to save stray dogs, birds, and cows suffering from heat exhaustion, sunstroke, and severe water deficiency.',
    content: `Heatstroke is a rapid medical emergency. When a dog's core temperature exceeds 40.5°C (105°F), multiple organ failure begins within minutes.
**Signs of Heatstroke**:
- Loud, frantic panting with thick ropey saliva.
- Dark brick-red or purple tongue and gums.
- Stumbling, glassy eyes, vomiting, and collapse.
**Immediate First-Aid**:
1. Move the animal to deep shade immediately.
2. Wet the body with **cool tap water** (NOT ice or freezing water, which causes peripheral blood vessels to constrict and traps heat inside the core organs).
3. Focus cool water on the groin, armpits, paw pads, and neck.
4. Use a hand fan or gentle breeze to facilitate evaporative cooling.
5. Offer small sips of cool water, but never force water into a semi-conscious throat.`,
    animalType: 'all',
    authoritativeSource: 'American Veterinary Medical Association (AVMA)',
    tags: ['Heatstroke', 'Summer Care', 'Emergency'],
    readTimeMinutes: 4,
    published: true,
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'res-4',
    title: 'Wound Care, Bleeding Control, and Maggot Safety',
    category: 'Wound Management',
    summary: 'Practical guidance for bleeding, open road scrapes, bite punctures, and fly-strike (maggot wounds).',
    content: `Street animals frequently suffer road abrasions, bites, or neglected wounds colonized by blowfly larvae (maggots).
**Active Bleeding Control**:
- Place a clean, sterile cloth or folded gauze directly over the bleeding spot.
- Apply firm, steady, continuous pressure for at least 5 to 7 continuous minutes without lifting the pad to check.
- Never wrap rubber bands or tight wires as tourniquets, which cuts off limb circulation completely.
**Maggot Wound Care**:
- Maggots burrow into living tissue and release toxins. Never pour battery acid, kerosene, or pure phenyl into wounds.
- If you have veterinary topical spray (e.g., Gamma-BHC or Negasunt / Topicure spray), apply it from a distance to stun larvae.
- Cover with a clean cloth to prevent further flies from laying eggs while transporting to a veterinary hospital.`,
    animalType: 'all',
    authoritativeSource: 'British Small Animal Veterinary Association (BSAVA)',
    tags: ['Wounds', 'Bleeding', 'First Aid'],
    readTimeMinutes: 5,
    published: true,
    createdAt: '2026-02-10T14:00:00Z',
  },
  {
    id: 'res-5',
    title: 'Responsible Feeding and Clean Water Practices',
    category: 'Nutrition & Care',
    summary: 'What to feed community animals safely without causing digestive distress, bloat, or toxic reactions.',
    content: `Providing nourishment to street animals builds trust and immunity, but wrong food can be lethal:
**Safe Foods for Stray Dogs**:
- Boiled white rice with boiled chicken, eggs, or plain pumpkin and carrots.
- Commercial balanced dry dog kibble.
- Plain cooked curd/yogurt in summer (provides gut probiotics).
**Foods That Are Toxic and Must NEVER Be Given**:
- Cooked poultry or mutton bones (splinter into needle-sharp shards that puncture the stomach or intestines).
- Onions, garlic, chives (destroy red blood cells, causing fatal hemolytic anemia).
- Chocolate, cocoa, coffee (theobromine toxicity).
- Grapes and raisins (cause acute kidney shutdown).
- Sugary sweets, xylitol candies, or oily spicy curry leftovers.
- Clean drinking water: Place sturdy earthen pots in shaded spots and refill them daily with clean water.`,
    animalType: 'dog',
    authoritativeSource: 'Merck Veterinary Manual',
    tags: ['Feeding', 'Diet', 'Community Care'],
    readTimeMinutes: 4,
    published: true,
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'res-6',
    title: 'Vaccination and ABC (Animal Birth Control) Awareness',
    category: 'Prevention & Community',
    summary: 'The science behind Rabies prevention (ARV), DHLPP vaccination, and humane sterilization for a healthy stray population.',
    content: `Humane sterilization (Animal Birth Control - ABC) and annual anti-rabies vaccination (ARV) are the gold standards of community animal management:
1. **Rabies Is 100% Preventable**: Vaccinating 70% of dogs in a locality creates herd immunity, protecting humans and animals alike.
2. **Benefits of Sterilization**:
   - Eliminates reproductive cancers (testicular and uterine infections/pyometra).
   - Dramatically reduces aggressive mating fights and roaming onto busy roadways.
   - Prevents the tragic cycle of unwanted litters suffering high mortality on the streets.
3. **Identifying Ear-Notched Dogs**: A clean triangular or rounded notch on a street dog's ear indicates the animal has been spayed/neutered and vaccinated by a certified NGO or municipal veterinary department.`,
    animalType: 'all',
    authoritativeSource: 'World Health Organization (WHO) & WOAH Animal Welfare Guidelines',
    tags: ['Vaccination', 'Sterilization', 'Rabies Prevention'],
    readTimeMinutes: 5,
    published: true,
    createdAt: '2026-02-20T16:00:00Z',
  },
  {
    id: 'res-7',
    title: 'Responsible Adoption and Long-Term Animal Welfare',
    category: 'Adoption',
    summary: 'Everything you need to know before adopting an indie / community dog or cat into your home.',
    content: `Native community dogs (Indies) possess exceptional natural immunity, adapt seamlessly to local weather, and make extraordinarily loyal companions:
1. **Indies Are Incredibly Resilient**: Born with high genetic diversity, indie dogs have fewer congenital hereditary diseases than inbred pedigree breeds.
2. **De-worming & Basic Health Check**: Upon rescue or adoption, schedule a veterinary visit for broad-spectrum de-worming and initial vaccination.
3. **Patience & Trust Building**: Stray animals rescued from hardship may initially show timidity or food guarding. Consistent routine, gentle positive reinforcement, and loving patience help them flourish into joyful family members.
4. **Adopt, Don\'t Shop**: Choosing adoption gives a second chance at life to a soul that truly needs one.`,
    animalType: 'all',
    authoritativeSource: 'International Companion Animal Management (ICAM) Coalition',
    tags: ['Adoption', 'Indie Dogs', 'Rescue'],
    readTimeMinutes: 4,
    published: true,
    createdAt: '2026-02-22T08:30:00Z',
  },
];

export const SEED_WELLNESS_QUOTES: WellnessQuote[] = [
  {
    id: 'quote-1',
    quote: 'Every stray deserves safety, every wounded soul deserves care.',
    author: 'PawCare Philosophy',
    context: 'Core Mission',
    featured: true,
  },
  {
    id: 'quote-2',
    quote: 'Be the human they hope to find.',
    author: 'PawCare Community',
    context: 'Compassion in Action',
    featured: true,
  },
  {
    id: 'quote-3',
    quote: 'A little kindness can become a lifetime of hope.',
    author: 'Rescue Volunteer Voice',
    context: 'Community Care',
    featured: true,
  },
  {
    id: 'quote-4',
    quote: "You don't need to save every animal to change the world. Start by helping one.",
    author: 'PawCare Guiding Principle',
    context: 'Grassroots Rescue',
    featured: true,
  },
  {
    id: 'quote-5',
    quote: 'Compassion is measured by how we treat those who cannot ask us for help.',
    author: 'Veterinary Ethos',
    context: 'Ethical Welfare',
    featured: true,
  },
  {
    id: 'quote-6',
    quote: 'Until one has loved an animal, a part of one’s soul remains unawakened.',
    author: 'Anatole France',
    context: 'Timeless Wisdom',
    featured: false,
  },
  {
    id: 'quote-7',
    quote: 'The greatness of a nation and its moral progress can be judged by the way its animals are treated.',
    author: 'Mahatma Gandhi',
    context: 'Social Compassion',
    featured: false,
  },
];

export const SEED_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    title: 'Rocky’s Miracle: From Highway Hit-and-Run to Loving Home',
    animalName: 'Rocky',
    animalType: 'dog',
    story: 'Found collapsed near a busy bypass with a fractured femur and severe shock. A passerby used PawCare to identify emergency warning signs, stabilize bleeding safely, and coordinate transport to a nearby veterinary trauma center. After orthopaedic surgery and 6 weeks of rehabilitation, Rocky was adopted by a loving family.',
    rescueDate: '2026-01-12',
    recoveryDate: '2026-02-28',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    isDevelopmentSample: true, // Transparent development sample tag as requested
    rescueLocation: 'Ring Road Bypass, South Delhi',
  },
  {
    id: 'story-2',
    title: 'Luna the Kitten: Overcoming Severe Malnutrition and Eye Infection',
    animalName: 'Luna',
    animalType: 'cat',
    story: 'A three-week-old orphaned kitten found trapped under construction debris with eyes crusted shut. The rescuer followed PawCare temperature warming protocols and connected with a local foster home. Luna received prompt ophthalmic care and has grown into an affectionate, energetic companion.',
    rescueDate: '2026-02-04',
    recoveryDate: '2026-03-01',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    isDevelopmentSample: true,
    rescueLocation: 'Bandra West, Mumbai',
  },
  {
    id: 'story-3',
    title: 'Nandi the Calf: Immediate Bloat Decompression and Safe Shelter',
    animalName: 'Nandi',
    animalType: 'cow',
    story: 'Observed with severe left-flank tympany after accidentally consuming plastic food bags. Local volunteers flagged the emergency through PawCare, alerting a mobile veterinary livestock unit who performed prompt trocar decompression. Nandi is now healthy and thriving in a sanctuary.',
    rescueDate: '2026-02-18',
    recoveryDate: '2026-02-25',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    isDevelopmentSample: true,
    rescueLocation: 'Kengeri Rural Outskirts, Bengaluru',
  },
];
