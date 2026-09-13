# Security Specification: NotPerfect App

## 1. Data Invariants
1. **Identity & Ownership Integrity**: A user can only create or update their own profile `/users/{userId}` where `request.auth.uid == userId`.
2. **PII Isolation (Split Collection)**: Private info `/users/{userId}/private/info` can strictly only be read or written by the document owner (`request.auth.uid == userId`) or an admin (`isAdmin()`). Blanket reads are forbidden.
3. **Anti-Update Gap**: Unauthenticated or unauthorized users cannot update another user's post, story, note, or comment.
4. **Relational Sync (Master Gate)**: Comments under `/posts/{postId}/comments/{commentId}` require that the parent post exists (`exists(/databases/$(database)/documents/posts/$(postId))`).
5. **Direct Message Privacy**: A message `/messages/{messageId}` can only be read or created by its sender or receiver (`request.auth.uid == resource.data.senderId || request.auth.uid == resource.data.receiverId`).
6. **Moderation Safety**: Reports `/reports/{reportId}` can be created by any authenticated member (`reporterId == request.auth.uid`), but only admins/moderators can view all reports or resolve them.
7. **Size & Type Defense**: All text, string, and list properties must strictly respect length boundaries (`.size() <= MAX`).
8. **Admin Privilege Escalation Guard**: Regular users cannot promote themselves to role `admin` or `moderator`.

## 2. The "Dirty Dozen" Malicious Payloads (Targeting Rejection)
1. **Payload 1 (Ghost Field Injection on User)**: Attempt to insert `isSuperAdmin: true` into `/users/user_123`.
2. **Payload 2 (Impersonated Post Creation)**: Attempt by `user_attacker` to create a post with `userId: "user_victim"`.
3. **Payload 3 (Unauthorized PII Scraping)**: Attempt by `user_1` to read `/users/user_2/private/info`.
4. **Payload 4 (Orphaned Comment Write)**: Attempt to write a comment under a non-existent post `/posts/non_existent_id/comments/c_1`.
5. **Payload 5 (Message Interception / Snooping)**: Attempt by `user_eavesdropper` to list or read `/messages/{msgId}` where they are neither sender nor receiver.
6. **Payload 6 (Oversized Payload / Denial-of-Wallet)**: Attempt to inject a 500KB string into `caption` or `text`.
7. **Payload 7 (Status Tampering on Report)**: Normal user attempting to mark a report `status: "resolved"` or dismiss their own report.
8. **Payload 8 (ID Poisoning Attack)**: Submitting a 2KB document ID with malicious path characters to `/posts/{postId}`.
9. **Payload 9 (Unauthenticated Anonymous Mutation)**: Attempting to delete a post with `request.auth == null`.
10. **Payload 10 (Immutable Field Mutation)**: Attempting to update a post and changing its `userId` or `createdAt`.
11. **Payload 11 (Reaction Count Forgery)**: Arbitrary non-numerical values or negative quantities injected into `likesCount`.
12. **Payload 12 (Self-Assigned Admin Role)**: Normal user updating `/users/{userId}` with `role: "admin"`.

## 3. Test Runner Invariants
All 12 dirty payloads are verified to return `PERMISSION_DENIED` under the ABAC and Zero-Trust architecture specified in `firestore.rules`.
