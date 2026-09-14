# NotPerfect — The Body-Neutral Sanctuary

> **Embracing authentic human reality without filters, judgment, or artificial perfection.**

[![Version](https://img.shields.io/badge/version-1.0.0-rose.svg)](https://github.com/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Executive Summary

**NotPerfect** is a pioneering, compassionate social sanctuary designed to challenge modern digital toxicity and algorithmic beauty expectations. Unlike conventional social media platforms driven by vanity metrics, appearance filters, and curated highlight reels, NotPerfect offers a trauma-informed, safe haven where people share genuine stories of their bodies, scars, skin textures, aging, stretch marks, vitiligo, surgeries, and personal healing journeys.

Built on the philosophy of **Body Neutrality** and inspired by the Japanese art of **Kintsugi** (celebrating fractures and flaws with gold), NotPerfect treats every physical mark not as a flaw to hide, but as living proof of resilience, humanity, and courage.

---

## 💡 Core Philosophy & Mission

### 1. Beyond Toxic Body Positivity → Body Neutrality
While traditional body positivity often forces users into compulsory joy or self-love that feels unrealistic, **body neutrality** acknowledges the body simply as an honest vessel carrying our experiences. NotPerfect validates feelings of vulnerability, chronic pain, recovery, and acceptance without sugarcoating.

### 2. Zero Artificial Retouching
- No smoothing filters, no facial distortion algorithms, and no unachievable beauty metrics.
- High-definition natural detail celebrating unedited skin textures, birthmarks, freckles, and physical changes.

### 3. Empathetic Micro-Reactions (Over Superficial "Likes")
Instead of shallow vanity metrics, community members connect through compassionate emotional gestures:
- 🫂 **Hug** (`hug`): Compassionate physical presence and solace.
- ❤️ **Love** (`love`): Unconditional appreciation and warmth.
- ⚡ **Courage** (`courage`): Honoring the bravery required to share authentic vulnerability.
- 🕊️ **Peace** (`peace`): Comfort, tranquility, and grounding acceptance.
- 🌸 **Bloom** (`bloom`): Celebrating healing, growth, and continuous metamorphosis.

---

## 🎨 Brand Identity & "Cozy Sanctuary" Design Language

The visual identity is meticulously crafted around warmth, comfort, and psychological safety:

| Element | Specification & Rationale |
| :--- | :--- |
| **Color Palette** | **Rose Gold** (`#e8a598`), **Kintsugi Amber Gold** (`#f3c86b`), **Plum / Velvet Twilight** (`#7a4968`), on an eye-safe deep canvas (`#0c0a13`). |
| **Brand Logo** | A minimalist, organic continuous-line dual-figure embrace, symbolizing two humans connecting in mutual acceptance. Accented with subtle golden kintsugi highlights. |
| **Ambient Lighting** | Continuous glowing halos and gentle floating stardust particles (`AmbientLightMotion`) that provide dynamic warmth to splash screens and transition states. |
| **Typography** | Expressive display headings paired with high-legibility sans-serif body typography, mathematically scaled for accessibility across desktop and mobile. |
| **Borders & Radii** | Soft organic curves (16px–24px) paired with delicate low-contrast borders (`#342d45`) to minimize cognitive fatigue. |

---

## 🚀 Feature Highlights

### 1. Body Journey Feed & Interactive Posts
- **Body Journey Narrative**: Posts are paired with raw, authentic personal accounts explaining the story behind a scar, illness, postpartum change, or physical milestone.
- **Micro-Interactions**: Multi-reaction selector with animated feedback, warm comments, bookmarking, and native sharing.
- **Multilingual Hashtag Discovery**: Intelligent synonym mapping across English, Persian, Spanish, Arabic, and French (e.g., `#stretchmarks` seamlessly matches `#ترک_پوستی` and `#estrías`).

### 2. Stories with 5-Second Auto-Progression
- Clean, vertical story viewer featuring 5-second automatic progression bars.
- Effortless navigation: tap left/right to skip items or switch between creators smoothly.
- Safe-mode blur for sensitive stories.

### 3. Ethical Age Verification & 18+ Content Protection
- **Age Verification Modal**: Protects young users while safeguarding mature creators sharing exposed, surgical, or intimate recovery milestones.
- **Selfie Video & Snapshot Verification**: Users can complete a verification process using real-time phrase prompts and gesture confirmation.
- **One-Click Consent**: Explicit warning overlays on sensitive content with user opt-in view toggles.

### 4. Community Trust, Safety & Moderation
- **Multi-Category Reporting System**:
  - Body shaming / derogatory critiques
  - Harassment or unwanted solicitations
  - Missing +18 / Sensitive content tag
  - Unsolicited explicit imagery
  - Hate speech & discriminatory behavior
- **Admin Moderation Actions**: Flagged content can be reviewed, marked for mandatory 18+ tagging, hidden, warned, or removed by community guardians.

### 5. Private Messaging & Audio/Video Sanctuary Calls
- **Real-Time Direct Messages**: Secure one-on-one chats with voice message recording, photo uploads, and file attachments.
- **Adaptive LTR / RTL Arrow Flipping**: Directional icons automatically flip based on active script direction (e.g., Persian/Arabic vs. English/French).
- **Sanctuary Calls**: Voice and video calling simulator with live mute, camera toggle, and timer states.

### 6. Seamless Multi-Account Management
- Users can switch effortlessly between personal, anonymous, or creative accounts via a bottom sheet drawer without re-entering credentials.
- Supports independent notifications, bios, and saved posts per profile.

### 7. Daily Mindfulness Notes
- Lightweight, 24-hour status thoughts accompanied by mood emojis, located at the top of the feed for quick check-ins.

### 8. Full Bidirectional Internationalization (i18n)
- **5 Languages**:
  - 🇺🇸 English (`en`) — LTR
  - 🇮🇷 Persian (`fa`) — RTL
  - 🇪🇸 Spanish (`es`) — LTR
  - 🇸🇦 Arabic (`ar`) — RTL
  - 🇫🇷 French (`fr`) — LTR
- Automatically switches typography, layout mirroring, icon directions, and system translations in real-time.

---

## 🛠️ Architecture & Tech Stack

```
                             ┌────────────────────────┐
                             │       server.ts        │
                             │  Express + Vite Server │
                             └───────────┬────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         │                               │
                ┌────────▼────────┐             ┌────────▼────────┐
                │   App.tsx (Root)│             │ /api/health     │
                └────────┬────────┘             └─────────────────┘
                         │
     ┌───────────────────┼────────────────────┐
     │                   │                    │
┌────▼────────┐    ┌─────▼───────┐    ┌───────▼────────┐
│ UI Views    │    │ Modal Flows │    │ Core Services  │
│ - Feed      │    │ - Age Verif │    │ - Storage      │
│ - Explore   │    │ - Report    │    │ - i18n         │
│ - Messages  │    │ - Auth      │    │ - Initial Seed │
│ - Profile   │    │ - Call      │    └────────────────┘
│ - Settings  │    │ - Post / St.│
└─────────────┘    └─────────────┘
```

### Technology Highlights
- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/) with React SWC plugin
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Motion & Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend Entry**: [Express 4](https://expressjs.com/) with native TypeScript support (`tsx` / `esbuild`)
- **Data Layer**: Durable offline-first client persistence via typed `StorageService` using `localStorage` schemas with seed fallback.

---

## 📁 Project Directory Structure

```
.
├── server.ts                    # Express backend entry with Vite middleware & SPA routing
├── index.html                   # HTML entry point with metadata, meta tags & fonts
├── package.json                 # Project dependencies, build and development scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind and React plugins
├── metadata.json                # Application permissions and platform metadata
├── public/                      # Static assets & icons
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Root state orchestration, tab routing & modal management
    ├── index.css                # Global CSS stylesheet & Tailwind theme definition
    ├── types.ts                 # Shared TypeScript data models, interfaces, and types
    ├── components/              # Modular UI components
    │   ├── AmbientLightMotion.tsx   # Floating glowing orbs and warm stardust particles
    │   ├── SplashScreen.tsx         # Initial brand introduction with audio-visual warmth
    │   ├── CozyBrandLogo.tsx        # Vector Kintsugi-inspired continuous line logo
    │   ├── CozyLogoMotion.tsx       # Logo reveal motion sequence with golden accents
    │   ├── LogoMotionLoading.tsx    # Smooth transient loading state with ambient lighting
    │   ├── Navbar.tsx               # Header with logo, notifications, language & auth CTA
    │   ├── BottomNavigation.tsx     # Mobile-first floating tab navigation bar
    │   ├── PostCard.tsx             # Unretouched post with reactions, journey story & comments
    │   ├── NotesBar.tsx             # 24-hour horizontal mood check-in bar
    │   ├── ExploreView.tsx          # Tag discovery, search engine & daily reflections
    │   ├── ChatView.tsx             # Direct messaging, voice notes, media sharing & calls
    │   ├── ProfileView.tsx          # User profile, body story summary & media grid
    │   ├── SettingsView.tsx         # App settings, language selector, security & themes
    │   ├── LoginView.tsx            # Dedicated login & welcome view
    │   ├── AuthModal.tsx            # Multi-mode authentication modal (Email, Google, Demo)
    │   ├── CreatePostModal.tsx      # Post authoring modal with body journey prompts & 18+ tag
    │   ├── StoryViewer.tsx          # 5-second automatic progression story viewer
    │   ├── AgeVerificationModal.tsx # Video/Selfie gesture age verification flow
    │   ├── ReportModal.tsx          # Community safety report submission modal
    │   ├── AccountSwitcherSheet.tsx # Multi-account drawer for instant profile switching
    │   ├── CallModal.tsx            # Voice and video sanctuary call simulator
    │   ├── OnboardingModal.tsx      # Welcome guide introducing the community guidelines
    │   └── AndroidFrame.tsx         # Preview wrapper simulating mobile hardware
    ├── data/
    │   └── initialData.ts       # Curated initial mock users, posts, stories & notes
    └── services/
        ├── storage.ts           # Storage service handling CRUD, accounts & persistence
        └── i18n.ts              # Translation dictionary (EN, FA, ES, AR, FR) & RTL helpers
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: Version `18.0.0` or higher (Node 20+ recommended)
- **Package Manager**: `npm`, `yarn`, or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/notperfect.git
   cd notperfect
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📜 Available Scripts

In the project root, you can execute:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Boots the full-stack server in development mode using `tsx server.ts` on port 3000. |
| `npm run build` | Compiles the Vite client into `dist/` and bundles `server.ts` into `dist/server.cjs` via `esbuild`. |
| `npm run start` | Runs the production-compiled CommonJS bundle via `node dist/server.cjs`. |
| `npm run lint` | Runs the TypeScript compiler (`tsc --noEmit`) to validate type safety. |

---

## 🔒 Safety, Content Moderation & Ethics

1. **Non-Judgmental Environment**: Content promoting harassment, body shaming, weight stigma, unsolicited medical advice, or sexual objectification is strictly moderated.
2. **User Consent & Age Protection**: Any post containing nudity, exposed surgical incisions, or sensitive physical recovery milestones must be designated with the **Sensitive (+18)** tag. Users must confirm their age to view sensitive content.
3. **Data Privacy**: All personal stories, chat logs, and account preferences reside securely in local storage, giving users full ownership and the ability to reset their data at any time via Settings.

---

## 🌐 Supported Languages

| Code | Language | Native Name | Layout Direction |
| :---: | :--- | :--- | :---: |
| `en` | English | English | Left-to-Right (LTR) |
| `fa` | Persian | فارسی | Right-to-Left (RTL) |
| `es` | Spanish | Español | Left-to-Right (LTR) |
| `ar` | Arabic | العربية | Right-to-Left (RTL) |
| `fr` | French | Français | Left-to-Right (LTR) |

---

## 🤝 Contributing

Contributions that enrich community safety, expand accessibility, or introduce new compassionate features are welcome!

1. Fork the project repository.
2. Create your feature branch (`git checkout -b feature/CompassionateFeature`).
3. Commit your changes with clear, descriptive commit messages (`git commit -m 'Add empathetic audio note preview'`).
4. Push to the branch (`git push origin feature/CompassionateFeature`).
5. Open a Pull Request for review.

---

## 🛡️ Admin Panel & Trust & Safety Infrastructure

The NotPerfect client application includes an integrated client-to-admin telemetry and moderation dispatch layer (`src/services/adminApi.ts`) that streams critical safety events to the backend:
- **Trust & Safety Moderation Reports:** Real-time dispatching of reported posts, comments, messages, and profiles.
- **Ethical Age Verification (18+):** Dispatches video/selfie challenge recordings for human moderator review.
- **User Telemetry & Content Auditing:** Synchronizes user registrations, profile updates, and published posts/stories.
- **Offline Outbox Resilience:** Queues payloads locally in case of network outages and auto-flushes upon reconnection.

For full architectural blueprints, data models, REST API specifications, and prompt instructions to build the dedicated **NotPerfect Admin Panel**, consult the comprehensive [ADMIN_PANEL_SPEC.md](ADMIN_PANEL_SPEC.md) blueprint file.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <i>"You are not a project to be solved. You are a life to be lived." — NotPerfect Community</i>
</p>
