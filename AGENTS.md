# NotPerfect Project Guidelines & Coding Conventions

## Persistent Developer Rules

### 1. English Code Comments (Mandatory)
- **Always write clear, comprehensive English code comments** on all new functions, components, interfaces, and complex state logic.
- Avoid writing un-commented code. Every code snippet should be easily understandable by any new developer joining the project.
- Document the intent, parameters, lifecycle hooks, and architectural decisions clearly using standard JSDoc/TSDoc conventions.

### 2. Internationalization & Bidirectional Layouts (i18n)
- The app supports 5 languages: English (`en`), Persian (`fa`), Spanish (`es`), Arabic (`ar`), and French (`fr`).
- Always pass the `lang` / `currentLang` prop to components and retrieve UI copy from `TRANSLATIONS[currentLang]`.
- Always verify RTL / LTR layout adaptations (`isRTL(lang)`) for directional elements such as arrows, padding, flex order, and text alignment.

### 3. Body-Neutral & Cozy Visual Design
- Adhere strictly to the warm, comforting color palette: Rose Gold (`#e8a598`), Kintsugi Amber Gold (`#f3c86b`), Velvet Twilight / Plum (`#7a4968`), on an eye-safe deep canvas (`#0c0a13`).
- Avoid aggressive bright neon accents, toxic beauty motifs, or sharp corners. Cap card corner radii at 16px–24px.
- Use `AmbientLightMotion` for dynamic, peaceful background lighting in loading and transition states.

### 4. Data Persistence Strategy
- Use `StorageService` in `src/services/storage.ts` for client-side state persistence.
- Keep data models strictly typed in `src/types.ts`.
