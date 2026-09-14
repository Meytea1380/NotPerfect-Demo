/**
 * @file server.ts
 * @description Production and Development Express Server for NotPerfect.
 * Handles API endpoints, Vite development middleware, and production SPA static file serving.
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Resolve current directory in both CommonJS and ES Module contexts
const currentDir = typeof __dirname !== 'undefined'
  ? __dirname
  : (import.meta?.url ? path.dirname(fileURLToPath(import.meta.url)) : process.cwd());

const app = express();

// Required port binding for the container reverse proxy layer
const PORT = 3000;

// Parse incoming JSON payloads
app.use(express.json());

/**
 * Health check endpoint for container liveness and monitoring.
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ============================================================================
// ADMIN PANEL API ENDPOINTS & AUDIT STORE
// ============================================================================

/**
 * In-memory stores for Admin Panel data synchronization & auditing.
 * In a production multi-server environment, these would be backed by PostgreSQL or Firestore.
 */
interface AdminStore {
  users: Array<{ user: any; eventType: string; timestamp: string }>;
  reports: Array<any>;
  verifications: Array<any>;
  contentAudits: Array<any>;
  activityLogs: Array<any>;
}

const adminStore: AdminStore = {
  users: [],
  reports: [
    {
      id: 'rep_1',
      reporter: { id: 'user_me', name: 'دریا کاظمی', username: 'darya_pure' },
      targetDetails: {
        type: 'post',
        id: 'post_3_sensitive',
        preview: 'عکس بافت طبیعی پوست، خطوط کشیدگی...',
        authorId: 'user_sara',
        authorName: 'سارا شمس',
      },
      reason: 'missing_18_tag',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'rep_2',
      reporter: { id: 'user_kian', name: 'کیان راد', username: 'kian_healing' },
      targetDetails: {
        type: 'comment',
        id: 'c_test_mock',
        preview: '«چرا روی پوستت کرم نمیزنی تا بپوشونیش؟»',
        authorId: 'user_anonymous',
        authorName: 'کاربر ناشناس',
      },
      reason: 'body_shaming',
      status: 'pending',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
  verifications: [
    {
      id: 'verif_1',
      user: { id: 'user_kian', name: 'کیان راد', username: 'kian_healing' },
      challengePhrase: 'من کیان راد هستم و در فضای امن NotPerfect تایید سن ۱۸+ انجام می‌دهم.',
      securityCode: '8492',
      status: 'pending',
      submittedAt: new Date(Date.now() - 14400000).toISOString(),
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-smiling-looking-at-camera-33758-large.mp4',
    },
  ],
  contentAudits: [],
  activityLogs: [],
};

/**
 * Sync user profile or login event to the Admin Panel.
 * Route: POST /api/admin/users/sync
 */
app.post('/api/admin/users/sync', (req, res) => {
  const { user, eventType, clientTimestamp } = req.body;
  const entry = {
    user,
    eventType: eventType || 'profile_updated',
    timestamp: clientTimestamp || new Date().toISOString(),
  };
  adminStore.users.unshift(entry);
  console.log(`[AdminAPI] User sync received: ${user?.username || user?.id} (${eventType})`);

  res.status(200).json({
    success: true,
    message: 'User telemetry synced successfully',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Receive and record a user-submitted Trust & Safety moderation report.
 * Route: POST /api/admin/reports
 */
app.post('/api/admin/reports', (req, res) => {
  const reportPayload = req.body;
  adminStore.reports.unshift({
    ...reportPayload,
    receivedAt: new Date().toISOString(),
  });
  console.log(`[AdminAPI] New Report received against ${reportPayload?.targetDetails?.type}: ${reportPayload?.report?.reason}`);

  res.status(201).json({
    success: true,
    message: 'Report queued for admin review',
    timestamp: new Date().toISOString(),
  });
});

/**
 * List pending or filtered moderation reports for the Admin Panel.
 * Route: GET /api/admin/reports
 */
app.get('/api/admin/reports', (req, res) => {
  const status = req.query.status as string;
  const filtered = status
    ? adminStore.reports.filter((r) => r.status === status)
    : adminStore.reports;

  res.status(200).json({
    success: true,
    data: filtered,
    total: filtered.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Submit user age-verification video/selfie submission for Admin Review.
 * Route: POST /api/admin/verifications
 */
app.post('/api/admin/verifications', (req, res) => {
  const verifPayload = req.body;
  adminStore.verifications.unshift({
    ...verifPayload,
    receivedAt: new Date().toISOString(),
  });
  console.log(`[AdminAPI] Age verification submitted for user: ${verifPayload?.user?.username}`);

  res.status(201).json({
    success: true,
    message: 'Verification submitted for review',
    timestamp: new Date().toISOString(),
  });
});

/**
 * List age verifications queue for the Admin Panel.
 * Route: GET /api/admin/verifications
 */
app.get('/api/admin/verifications', (req, res) => {
  res.status(200).json({
    success: true,
    data: adminStore.verifications,
    total: adminStore.verifications.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Audit newly published content (Posts or Stories) for compliance & sensitive tag checks.
 * Route: POST /api/admin/content/audit
 */
app.post('/api/admin/content/audit', (req, res) => {
  const auditPayload = req.body;
  adminStore.contentAudits.unshift({
    ...auditPayload,
    receivedAt: new Date().toISOString(),
  });
  console.log(`[AdminAPI] Content audit logged: ${auditPayload?.contentType} by @${auditPayload?.authorUsername}`);

  res.status(201).json({
    success: true,
    message: 'Content logged in audit stream',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Log user activity telemetry (account switches, sanctuary calls, etc.).
 * Route: POST /api/admin/activities
 */
app.post('/api/admin/activities', (req, res) => {
  const logPayload = req.body;
  adminStore.activityLogs.unshift(logPayload);

  res.status(200).json({
    success: true,
    message: 'Activity logged',
    timestamp: new Date().toISOString(),
  });
});

/**
 * High-level overview metrics for the Admin Dashboard.
 * Route: GET /api/admin/metrics
 */
app.get('/api/admin/metrics', (req, res) => {
  const openReports = adminStore.reports.filter((r) => r.status === 'pending').length;
  const pendingVerifications = adminStore.verifications.filter((v) => v.status === 'pending').length;

  res.status(200).json({
    success: true,
    data: {
      totalUsers: 1420 + adminStore.users.length,
      openReports,
      pendingVerifications,
      totalAuditedContent: adminStore.contentAudits.length,
      safetyScore: '99.4%',
      activeSanctuaryRooms: 8,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Boots the server and configures Vite middleware (in development)
 * or static file serving (in production).
 */
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    // In development mode, mount Vite as middleware for instant HMR-less updates
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the compiled static client build from 'dist/'
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to 0.0.0.0 for containerized ingress routing
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NotPerfect Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
