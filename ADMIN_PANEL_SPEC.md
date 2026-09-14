# NotPerfect Admin Panel — Architecture, API & Development Blueprint

> **Notice for Developers & AI Agents:**  
> This specification contains the complete architectural blueprints, data contracts, REST API specifications, UI/UX view layouts, and execution prompts required to build the **NotPerfect Admin Panel**.  
> Any human software engineer or autonomous AI coding agent can read this document and implement the complete Admin Panel without ambiguity.

---

## 1. Executive Overview & Mission

**NotPerfect** is an international body-neutral sanctuary for authentic, unfiltered human experiences, rejecting toxic beauty filters and superficial vanity metrics.

The **Admin Panel** acts as the **Trust, Safety & Sanctuary Governance Center**, fulfilling five critical responsibilities:

1. **Content Moderation & Policy Enforcement:** Reviewing reported posts, comments, direct messages, and user profiles. Safeguarding users against body shaming, toxic beauty promotions, and unsolicited explicit media.
2. **Ethical Age Verification (18+ Access):** Reviewing selfie and video verification submissions to grant or deny access to sensitive body journey content (scars, stretch marks, natural skin textures) in accordance with global privacy and child protection standards.
3. **User Management & Sanctuary Discipline:** Issuing constructive educational warnings, temporarily restricting privileges, or banning predatory accounts while maintaining an empathetic, restorative justice approach.
4. **Audit Trail & Regulatory Compliance:** Maintaining immutable logs of all moderation decisions, verification approvals, and administrative actions.
5. **Platform Analytics & Health Metrics:** Monitoring active user counts, report resolution times, flag distributions, and community safety scores.

---

## 2. Recommended Tech Stack

| Layer | Recommended Technology | Alternative Options |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Vite + React 19 SPA |
| **Language** | **TypeScript 5.x** (Strict Mode) | - |
| **Styling** | **Tailwind CSS 4** | Tailwind CSS 3.4 |
| **Component Library** | **Shadcn UI** + **Radix UI** | Tailwind UI / Headless UI |
| **Icons** | **Lucide React** (`lucide-react`) | - |
| **Data Tables** | **TanStack Table v8** (`@tanstack/react-table`) | AG Grid Community |
| **Charts & Metrics** | **Recharts** | Chart.js / Tremor |
| **State Management** | **TanStack Query v5** (`@tanstack/react-query`) | Zustand / SWR |
| **Backend & API** | **Next.js Route Handlers** or **Express.js** | NestJS / FastAPI |
| **Database** | **PostgreSQL (Drizzle ORM / Prisma)** | Cloud Firestore / Supabase |

---

## 3. Core Domain Data Models

These TypeScript interfaces define the data models shared between the **NotPerfect Client App** and the **Admin Panel**. They mirror `/src/types.ts` in the client app.

```typescript
// ============================================================================
// USER & IDENTITY MODELS
// ============================================================================

export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';

export type AgeVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface UserEntity {
  id: string;                          // e.g. "user_1726300000000"
  name: string;                        // Display name
  username: string;                    // Clean lowercase username without @
  email?: string;                      // User email address
  avatar: string;                      // URL to avatar portrait
  avatarSource?: 'curated' | 'uploaded' | 'natural_photo';
  bio?: string;                        // Bio text
  bodyStorySummary?: string;           // Optional personal body story
  badge?: string;                      // Community badge (e.g. "همسفر صبور")
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isAgeVerified: boolean;              // Whether user has access to 18+ content
  ageVerificationStatus: AgeVerificationStatus;
  verificationMethod?: 'google' | 'video' | 'manual';
  verificationVideoUrl?: string;       // Recording/Snapshot URL for review
  role: UserRole;
  isBanned: boolean;
  warnings: string[];                  // History of warning notices
  createdAt: string;                   // ISO 8601 string
  lastActiveAt?: string;               // ISO 8601 string
}

// ============================================================================
// TRUST & SAFETY / MODERATION REPORT MODELS
// ============================================================================

export type ReportTargetType = 'post' | 'comment' | 'message' | 'user';

export type ReportReason =
  | 'missing_18_tag'                   // Sensitive natural photo missing 18+ blur tag
  | 'body_shaming'                     // Bullying, shaming natural traits or weight
  | 'harassment'                       // Direct aggressive harassment or stalking
  | 'unsolicited_explicit'             // Inappropriate nudity or sexual solicitation
  | 'toxic_beauty_promotion'           // Advertising synthetic diet pills, extreme filters
  | 'self_harm'                        // Encouraging self-harm or eating disorders
  | 'hate_speech'                      // Discrimination, slurs, or hatred
  | 'other';

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export type ModerationActionType =
  | 'none'
  | 'dismiss'
  | 'enforce_18_tag'                  // Force 18+ sensitive blur on post
  | 'remove_content'                   // Hide or soft-delete content
  | 'warn_user'                        // Send formal warning notification to user
  | 'temporary_suspension'             // 24h/7d suspension
  | 'ban_user';                        // Permanent ban

export interface ReportEntity {
  id: string;                          // e.g. "rep_1726300000000"
  reporterId: string;
  reporterName: string;
  reporterUsername: string;
  reporterEmail?: string;
  targetType: ReportTargetType;
  targetId: string;                    // ID of the reported post/comment/user
  targetPreview: string;               // Text excerpt or media thumbnail description
  targetUserId: string;                // Author ID of the reported content
  targetUserName: string;              // Author name
  targetUserUsername?: string;
  reason: ReportReason;
  description?: string;                // Additional notes provided by reporter
  status: ReportStatus;
  assignedModeratorId?: string;
  resolvedAction?: ModerationActionType;
  moderatorNotes?: string;
  createdAt: string;                   // ISO 8601 string
  resolvedAt?: string;                 // ISO 8601 string
}

// ============================================================================
// AGE VERIFICATION REVIEW MODELS
// ============================================================================

export interface AgeVerificationEntity {
  id: string;                          // e.g. "verif_1726300000000"
  userId: string;
  userName: string;
  userUsername: string;
  userEmail?: string;
  videoUrl?: string;                   // Video stream or MP4 URL
  snapshotUrl?: string;                // Front camera photo snapshot (base64 or URL)
  challengePhrase: string;             // Dynamic phrase user was required to recite
  verificationCode: string;            // 4-digit code shown on screen during capture
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;                 // ISO 8601 string
  reviewedAt?: string;                 // ISO 8601 string
  reviewedByModeratorId?: string;
  moderatorNotes?: string;             // Reason for approval/rejection
}

// ============================================================================
// CONTENT AUDIT MODELS
// ============================================================================

export interface ContentAuditEntity {
  id: string;
  contentType: 'post' | 'story';
  contentId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  mediaUrl: string;
  caption?: string;
  bodyJourney?: string;                // Personal story of the body's natural marks
  tags?: string[];
  isSensitive: boolean;                // Whether flagged as 18+
  moderationEnforced18?: boolean;      // Whether forced by moderator
  isRemoved: boolean;
  publishedAt: string;                 // ISO 8601 string
}

// ============================================================================
// AUDIT LOG & TELEMETRY MODELS
// ============================================================================

export interface AdminAuditLogEntity {
  id: string;
  moderatorId: string;
  moderatorName: string;
  action: string;                      // e.g. "BAN_USER", "RESOLVE_REPORT", "APPROVE_AGE"
  targetEntity: 'user' | 'report' | 'verification' | 'post';
  targetId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;                   // ISO 8601 string
}
```

---

## 4. REST API Specification (Client to Admin Panel)

The Client Application dispatches events through `src/services/adminApi.ts`.  
All routes accept and return standard JSON.

### Base URL:
- In production: `https://admin-api.notperfect.app/api/admin` (or `/api/admin` via proxy)
- In development: `http://localhost:3000/api/admin`

### Common HTTP Headers:
```http
Content-Type: application/json
Authorization: Bearer <ADMIN_SESSION_OR_SERVICE_TOKEN>
X-Client-Platform: notperfect-web
X-Client-Version: 1.0.0
```

---

### Endpoint Matrix

| Method | Endpoint | Description | Scope / Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/users/sync` | Syncs user telemetry on register, login, profile edit | Client Service |
| `GET` | `/users` | Lists users with search, role, and ban filters | Admin / Moderator |
| `GET` | `/users/:id` | Gets user details, post count, and warning history | Admin / Moderator |
| `PUT` | `/users/:id/action` | Issues warnings, applies bans, or edits roles | Admin / Moderator |
| `POST` | `/reports` | Ingests a new trust & safety violation report | Client Service |
| `GET` | `/reports` | Queries reports queue by status, reason, targetType | Admin / Moderator |
| `GET` | `/reports/:id` | Fetches complete context of a specific report | Admin / Moderator |
| `PUT` | `/reports/:id/resolve` | Resolves a report with a moderation action | Admin / Moderator |
| `POST` | `/verifications` | Submits age verification video/photo challenge | Client Service |
| `GET` | `/verifications` | Lists pending age verification requests | Admin / Moderator |
| `PUT` | `/verifications/:id/decision` | Approves or rejects age verification request | Admin / Moderator |
| `POST` | `/content/audit` | Logs newly published post or story for safety audit | Client Service |
| `GET` | `/content/audit` | Explores recent posts & stories with sensitive filter | Admin / Moderator |
| `DELETE`| `/content/:type/:id` | Removes violating post or story from sanctuary | Admin / Moderator |
| `POST` | `/activities` | Records client telemetry event | Client Service |
| `GET` | `/metrics` | Returns live dashboard KPIs and community stats | Admin / Moderator |

---

### Detailed Endpoint Contracts

#### 1. Ingest Report
- **Route:** `POST /api/admin/reports`
- **Request Body:**
```json
{
  "report": {
    "id": "rep_1726301234567",
    "targetType": "post",
    "targetId": "post_104",
    "targetPreview": "عکس بدون تگ محتوای حساس...",
    "targetUserId": "user_42",
    "targetUserName": "سارا شمس",
    "reason": "missing_18_tag",
    "description": "تصویر دارای بافت حساس بدن است اما تگ ۱۸+ فعال نشده است.",
    "status": "pending",
    "createdAt": "2026-09-14T05:00:00Z"
  },
  "reporter": {
    "id": "user_me",
    "name": "دریا کاظمی",
    "username": "darya_pure",
    "email": "darya@example.com"
  },
  "targetDetails": {
    "type": "post",
    "id": "post_104",
    "preview": "عکس بدون تگ محتوای حساس...",
    "authorId": "user_42",
    "authorName": "سارا شمس"
  },
  "clientMetadata": {
    "timestamp": "2026-09-14T05:00:00Z",
    "appLanguage": "fa"
  }
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Report queued for admin review",
  "data": { "reportId": "rep_1726301234567", "queuePosition": 3 },
  "timestamp": "2026-09-14T05:00:01Z"
}
```

---

#### 2. Resolve Report
- **Route:** `PUT /api/admin/reports/:id/resolve`
- **Request Body:**
```json
{
  "action": "enforce_18_tag",
  "moderatorNotes": "محتوا حساس تشخیص داده شد؛ تگ محتوای ۱۸+ اجباری اعمال گردید.",
  "moderatorId": "mod_01"
}
```
- **Allowed Actions:** `enforce_18_tag`, `remove_content`, `warn_user`, `temporary_suspension`, `ban_user`, `dismiss`
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Report resolved and action executed",
  "timestamp": "2026-09-14T05:02:10Z"
}
```

---

#### 3. Ingest Age Verification Submission
- **Route:** `POST /api/admin/verifications`
- **Request Body:**
```json
{
  "verification": {
    "id": "verif_1726309876543",
    "userId": "user_kian",
    "userName": "کیان راد",
    "userAvatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "snapshotUrl": "data:image/jpeg;base64,...",
    "videoUrl": "https://storage.notperfect.app/verifications/user_kian_record.mp4",
    "randomPhrase": "من کیان راد هستم و در فضای امن NotPerfect تایید سن ۱۸+ انجام می‌دهم.",
    "verificationCode": "8492",
    "submittedAt": "2026-09-14T05:10:00Z",
    "status": "pending"
  },
  "user": {
    "id": "user_kian",
    "name": "کیان راد",
    "username": "kian_healing",
    "email": "kian@example.com"
  },
  "challengePhrase": "من کیان راد هستم و در فضای امن NotPerfect تایید سن ۱۸+ انجام می‌دهم.",
  "securityCode": "8492",
  "submittedAt": "2026-09-14T05:10:00Z"
}
```
- **Response `201 Created`:**
```json
{
  "success": true,
  "message": "Verification submitted for review",
  "timestamp": "2026-09-14T05:10:02Z"
}
```

---

#### 4. Review Age Verification Decision
- **Route:** `PUT /api/admin/verifications/:id/decision`
- **Request Body:**
```json
{
  "decision": "approved",
  "notes": "چهره با حساب کاربری تطابق دارد و سن قانونی محرز است.",
  "moderatorId": "mod_01"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Verification approved. User is now 18+ verified.",
  "timestamp": "2026-09-14T05:15:00Z"
}
```

---

#### 5. Dashboard Overview Metrics
- **Route:** `GET /api/admin/metrics`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1428,
    "activeUsers24h": 386,
    "openReports": 2,
    "pendingVerifications": 1,
    "totalAuditedContent": 542,
    "safetyScore": "99.4%",
    "activeSanctuaryRooms": 8,
    "reportsByReason": {
      "missing_18_tag": 14,
      "body_shaming": 5,
      "harassment": 2,
      "unsolicited_explicit": 1,
      "toxic_beauty_promotion": 3
    }
  },
  "timestamp": "2026-09-14T05:20:00Z"
}
```

---

## 5. UI/UX Views Specification for Admin Panel

The Admin Panel UI must be clean, focused, high-contrast, and respectful of sensitive content.

### View 1: Dashboard Overview (`/dashboard`)
- **Top Row (4 KPI Cards):**
  1. **Pending Reports:** Red/Amber badge with count (e.g. `2 pending`). Clicking filters directly to open reports.
  2. **Age Verification Queue:** Purple/Gold badge with count (e.g. `1 awaiting review`).
  3. **Total Sanctuary Members:** Active accounts counter with +% weekly growth.
  4. **Community Safety Index:** Percentage gauge (e.g. `99.4%` compliant posts).
- **Center Section (Split Columns):**
  - **Left (60%): Live Incident Stream:** Immediate feed of newly filed reports with quick 1-click preview and triage button.
  - **Right (40%): Flag Distribution Chart:** Donut or horizontal bar chart showing top reasons (e.g., `Missing 18+ tag`, `Body Shaming`).

### View 2: Moderation Queue (`/moderation`)
- **Filters Toolbar:** Status (`All`, `Pending`, `Investigating`, `Resolved`), Target Type (`Posts`, `Comments`, `Direct Messages`, `Users`), Reason selector.
- **Review Table:**
  - Columns: `Severity`, `Target Type`, `Reported By`, `Target Author`, `Reason`, `Snippet Preview`, `Time Ago`, `Actions`.
- **Drawer / Modal for Resolution:**
  - Shows original image/text alongside the reporter's statement.
  - Action buttons:
    - 🏷️ **Enforce 18+ Tag** (Marks post sensitive and un-blurs only for verified adults).
    - ⚠️ **Issue Formal Warning** (Pops up modal to send bilingual educational warning).
    - 🚫 **Remove Content** (Soft-deletes post/comment).
    - 🔒 **Suspend / Ban User** (Locks user out).
    - ✅ **Dismiss Report** (Marks as false alarm or compliant).

### View 3: Age Verification Portal (`/verifications`)
- **Queue Grid / Cards:**
  - Displays pending user avatar, username, submission time, and verification method (`video` or `snapshot`).
- **Interactive Verification Inspect Modal:**
  - **Split Visualizer:**
    - Left side: Captured selfie snapshot or video player with scrub controls.
    - Right side: User profile avatar + challenge phrase comparison box (`"من کیان راد هستم..."`) + security code display (`8492`).
  - **Reviewer Action Buttons:**
    - 🟢 **Approve (Verify 18+):** Instantly flips `isAgeVerified = true` on the user profile.
    - 🔴 **Reject:** Prompts for reason (`Blurry face`, `Audio phrase missing`, `Apparent minor`).

### View 4: User Directory & Access Control (`/users`)
- **Search & Filters:** Search by username, display name, email. Filter by `Banned`, `Age Verified`, `Role (User/Mod/Admin)`.
- **User Profile Inspector Drawer:**
  - Lifetime warning history.
  - Total posts and stories created.
  - Manual 18+ toggle override (for special customer support cases).
  - Ban / Unban switch.

### View 5: Content Explorer (`/content`)
- Visual grid of all recent posts and 24h stories.
- Filter: `All`, `Flagged 18+`, `Unflagged`, `Removed`.
- Allows proactive content moderation before community reports arrive.

### View 6: System Health & Audit Logs (`/audit-logs`)
- Filterable audit table recording timestamp, moderator username, action performed, target ID, and IP address.

---

## 6. Development Prompt for AI Agents & Developers

Use the prompt below to generate the complete Admin Panel in any workspace or framework:

```markdown
You are building the official Admin Panel for "NotPerfect", a body-neutral sanctuary web application.
Refer to the specifications in `ADMIN_PANEL_SPEC.md`.

Requirements:
1. Build a modern Next.js 15 (App Router) or Vite + React 19 application in TypeScript with Tailwind CSS and Lucide React.
2. Implement the full REST API consumption layer connecting to `/api/admin/*` matching all endpoints in the specification:
   - Dashboard Overview (`/dashboard`) with real-time KPI metrics.
   - Moderation Queue (`/moderation`) with interactive report review and 1-click resolution actions (Enforce 18+ Tag, Warn User, Remove, Ban, Dismiss).
   - Age Verification Portal (`/verifications`) with video/snapshot inspector and Approve/Reject workflow.
   - User Management (`/users`) with ban controls and warning logs.
   - Content Explorer (`/content`) with 18+ sensitive filter toggle.
   - Audit Logs (`/audit-logs`) with immutable action history.
3. Design using an eye-safe, refined sanctuary dark aesthetic (deep canvas `#0b0a13`, warm amber `#f3c86b`, rose gold `#e8a598`, twilight plum `#7a4968`).
4. Write clear, comprehensive English code comments and TSDoc on every interface, component, and API function.
5. Provide resilient error handling and mock data fallbacks for every screen so the panel is fully interactive out of the box.
```

---

## 7. Client Integration Status in NotPerfect App

The client application has already implemented the dispatch layer:
- **API Service File:** `/src/services/adminApi.ts` (`AdminApiClient`)
- **Backend Handlers:** `/server.ts` (Includes `/api/admin/*` routes and in-memory audit store)
- **Active Dispatch Triggers:**
  - User registration & profile updates (`AdminApiClient.syncUserProfile`)
  - Content reports (`AdminApiClient.dispatchReport`)
  - Video & selfie age verifications (`AdminApiClient.dispatchAgeVerificationSubmission`)
  - Post & Story publications (`AdminApiClient.dispatchContentPublication`)
  - Automatic offline outbox queue caching in `localStorage` with auto-sync upon reconnection (`AdminApiClient.flushOfflineQueue`).
