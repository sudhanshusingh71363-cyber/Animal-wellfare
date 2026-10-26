# PawCare — Full-Stack Animal Rescue, Wellness & AI First-Aid Guidance Platform

> *"When an animal cannot ask for help, PawCare helps people take the next safe step."*

**PawCare** is an animal-welfare and emergency first-aid triage platform dedicated to helping stray animals receive medical assistance, rescue support, food, shelter, and compassionate care.

The core of PawCare is an intelligent, beginner-friendly **Animal Symptom Guidance Chatbot** that empowers ordinary citizens to act safely and decisively when encountering sick, injured, or poisoned street animals—even with zero animal-care or veterinary knowledge.

---

## 🐾 Key Features

### 1. Intelligent Animal Symptom Guidance Chatbot (`/assistant`)
- **One-Question-at-a-Time Adaptive Flow**: Never overwhelms the user; asks targeted follow-ups based on reported symptoms.
- **Plain-Language Explanations**: Clarifies veterinary terms (e.g. how to check gum color, what normal breathing sounds like).
- **"Not Sure" Support**: Allows users to answer uncertainty honestly without forcing medical judgments.
- **Deterministic Clinical Safety Rules**: An un-bypassable clinical rule engine runs before and alongside AI interpretations. Life-threatening conditions (e.g. canine GDV bloat, feline urinary blockage, respiratory gasping, unresponsiveness, poison ingestion) trigger immediate Category 1 escalation.
- **Categorized Triage Output**:
  - **Category 1: Emergency — Seek Immediate Veterinary Help** (Emergency banner, red alert indicators, transport stabilization steps, direct Call Clinic & Find Emergency Vet action).
  - **Category 2: Veterinary Assessment Recommended** (Interim home/field care, warning signs to watch, clinic locator).
  - **Category 3: Basic Support and Close Observation** (Conservative supportive care, feeding/stomach rest guidance, what NOT to do).
- **Multi-Species Triage**: Tailored clinical protocols for **Dogs**, **Cats**, **Cows & Calves**, **Birds**, and **Other community animals**.
- **Optional Photo Observation**: Upload photo for visual observation (never delays emergency care).
- **Shareable Clinical Summary**: Generate, copy, or print a concise summary to hand directly to the veterinarian.

### 2. Nearby Veterinary Clinic Discovery (`/clinics`)
- **Location Modes**: Browser GPS Geolocation (with explicit consent) or manual search by **City** or **PIN Code**.
- **Real Verified Clinic Data**: Live queries via OpenStreetMap Overpass API worldwide (`node["amenity"="veterinary"]`) plus verified hospital seed database (Friendicoes, SGACC, BSDH Mumbai, CUPA Bengaluru, RESQ Pune, RSPCA, AMC NY, etc.).
- **Interactive Leaflet Map**: Displays nearby clinic pins, distinguishes 24/7 emergency trauma centers, and shows real-time distance calculations (Haversine formula).
- **Direct Actions**: 1-click **Call Emergency** (`tel:`) and **Google Maps Directions** deep-links.
- **Honest Fallback**: Never fabricates fake clinics, distances, or dispatch promises.

### 3. Animal Rescue Reporting & Real-Time Tracking (`/report` & `/track`)
- **Distress Report Submission**: Report animal type, category, severity, description, optional photo, city/PIN code, and optional GPS coordinates.
- **Confidentiality & Privacy**: Reporter contact details and exact coordinates are strictly protected from public view.
- **Unique Reference Number**: Generates a tracking ID (e.g. `PAW-2026-ABCD`).
- **Live Status Tracker**: Rescuers and citizens can track status (`pending`, `under_review`, `dispatched`, `resolved`) with dispatcher notes.

### 4. Admin & Veterinary Review Portal (`/admin`)
- **Secure Authentication**: Administrator and veterinary safety reviewer login (`admin@pawcare.org` / `pawcare2026!`).
- **Operational Metrics**: Real-time counter of total reports, pending cases, verified clinics, and active safety rules.
- **Rescue Report Management**: Review incoming reports, triage severity, update dispatch notes, and mark resolutions.
- **Verified Clinic Directory**: Add, edit, and verify new 24/7 trauma clinics.
- **Clinical Governance**: Inspect active deterministic rules and last-reviewed veterinary timestamps.
- **Audit Logs**: Immutable log of administrative changes.

### 5. Animal Wellness Resources & Interactive Quotes (`/resources`)
- **Reviewed Veterinary Health Guides**: Authoritative beginner-friendly guides on recognizing sickness, approaching frightened animals safely, summer heatstroke, wound & maggot safety, safe feeding vs. toxic foods, and rabies/sterilization (ABC).
- **Interactive Compassion Quotes**: Inspiring community quotes with functional "Next Quote", "Copy Quote", and "Share Quote" (Web Share API).
- **Stories of Hope**: Transparent recovery cases clearly marked with development sample badges.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS (Custom PawCare Warm & Trustworthy Palette) |
| **Icons & UI** | Lucide React, Leaflet, React-Leaflet, Canvas-Confetti |
| **Backend & Database** | Supabase (PostgreSQL, Supabase Auth, Row Level Security, Edge Functions) |
| **AI Integration** | Google Gemini API (secure server/edge proxy) + Deterministic Safety Engine |
| **Clinic Geocoding** | OpenStreetMap Overpass Turbo API + Verified Database |
| **Testing** | Automated 14-Scenario Clinical Safety Test Suite (`npm test`) |

---

## 🎨 Color Palette & Brand Design

- **Warm Off-White**: `#FAF9F6` (Background & light surfaces)
- **Forest Green**: `#355E46` (Primary brand accent, trust, life)
- **Soft Sage**: `#DCE8D8` (Badges, calm tints, secondary buttons)
- **Warm Beige**: `#F1E7D7` (Highlights, quote cards, warm accents)
- **Charcoal**: `#292D2A` (High-contrast accessible text)
- **Typography**: Inter (Body) & Nunito (Headings)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone or navigate to the repository
cd "Animal wellfare"

# Install all dependencies
npm install
```

### 3. Environment Configuration
PawCare operates immediately out-of-the-box with full in-memory/localStorage persistent fallback, OpenStreetMap live clinic discovery, and local deterministic safety triage.

To connect live Supabase cloud database and Gemini AI:
```bash
# Copy template configuration
cp .env.example .env
```
Edit `.env` with your credentials:
```env
# Supabase Configuration (Optional - falls back to persistent storage if blank)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional Gemini AI API Key (for natural conversational expansions)
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# Optional Google Maps API Key (OpenStreetMap Overpass is used by default)
VITE_GOOGLE_MAPS_API_KEY=
```

### 4. Database Setup (Supabase)
To run the full database schema and Row Level Security policies:
1. Open your Supabase Project Dashboard.
2. Go to **SQL Editor** -> **New Query**.
3. Copy and run the contents of [`supabase/migrations/20261027_init_pawcare_schema.sql`](file:///Users/sudhanshusingh71/Downloads/Animal%20wellfare/supabase/migrations/20261027_init_pawcare_schema.sql).

### 5. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 6. Build for Production
```bash
npm run build
```

---

## 🧪 Automated Clinical Safety Test Suite (14 Scenarios)

PawCare includes an automated verification runner testing the 14 clinical safety and fallback scenarios:

```bash
npm test
```

### Verified Test Cases:
1. **Dog vomits once, otherwise normal**: Yields Category 3 (Basic Support & Watch) with conservative stomach rest.
2. **Dog vomits repeatedly & collapses**: Yields Category 1 (Emergency) due to continuous vomiting and weakness.
3. **Dog swollen abdomen + non-productive retching**: Triggers `DOG_BLOAT_GDV` (Gastric Dilatation-Volvulus) emergency alert.
4. **Animal is unconscious**: Triggers `UNRESPONSIVE_COLLAPSE` immediate Category 1 alert across all species.
5. **Animal struggling to breathe**: Triggers `SEVERE_RESPIRATORY_DISTRESS` immediate Category 1 alert.
6. **Suspected poison ingestion**: Locks into emergency protocol, instructs user never to induce vomiting blindly, and advises bringing packaging.
7. **User answers "Not Sure" (3+ questions)**: Adheres to cautious safety principle, directing to Veterinary Assessment examination.
8. **Conflicting data**: Blood in vomit overrides calm alertness.
9. **User denies location permission**: Falls back seamlessly to manual city/PIN code search.
10. **Zero clinic search results**: Transparent fallback without inventing fictitious clinics.
11. **AI API fails or times out**: Triage runs 100% reliably client-side.
12. **Privacy protection**: Sanitizes reporter phone numbers and personal details from public tracking.
13. **Prompt injection resistance**: Intercepts requests to administer human medications (Paracetamol, Ibuprofen).
14. **Species-specific triage**: Validates feline urethral blockage (`CAT_URETHRAL_BLOCKAGE`) and bovine bloat (`COW_RUMEN_BLOAT`).

*You can also run these tests interactively directly inside the web UI by clicking the **"Safety Tests"** beaker icon in the top navigation bar!*

---

## 🔐 Admin Portal Credentials

- **URL**: Navigate to `/admin` or click **Admin** in the navigation bar.
- **Email**: `admin@pawcare.org`
- **Password**: `pawcare2026!` (or `admin123`)

---

## 📄 License & Mission

PawCare is dedicated to open animal welfare.
*"Every Paw Deserves Care."*
