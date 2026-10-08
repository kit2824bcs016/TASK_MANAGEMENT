# Personal Task Management System (TaskFlow)

**College Mini-Project**  
A clean, reliable, and secure web application for individual task and activity management with persistent Cloud Firestore storage, Firebase Authentication, and Attribute-Based Access Control (ABAC) security rules.

---

## 1. Project Title & Overview
**Personal Task Management System (TaskFlow)** is designed to assist students and individuals in organizing, scheduling, tracking, and prioritizing personal, academic, and professional activities in a unified, clutter-free workspace.

---

## 2. Problem Statement
Individuals frequently struggle with task disorganization across paper notes, messaging apps, and complex enterprise software that includes steep learning curves, excessive configuration, and distracting clutter. There is a need for a lightweight, responsive, reliable personal task manager that:
- Guarantees private, persistent data storage.
- Enforces strict data ownership (User A can never access User B's tasks).
- Calculates real-time progress statistics without manual calculations.
- Provides intuitive filtering, sorting, and priority-driven due-date alerts.

---

## 3. Objectives
1. Provide complete CRUD (Create, Read, Update, Delete) task operations.
2. Ensure strict zero-trust security and multi-user data isolation via Firebase Authentication and Firestore Security Rules.
3. Offer intuitive organization through categories (Personal, College, Work, Health, Finance, Other) and urgency priorities (Low, Medium, High).
4. Deliver an executive dashboard with dynamic task statistics and completion rate tracking.
5. Provide multi-criteria search, filtering, and sorting capabilities.
6. Support responsive access across desktop, tablet, and mobile devices.

---

## 4. Key Features
- **Secure Authentication**: Email & password authentication with input validation, password reset flow, and one-click Google provider login.
- **Task Management (CRUD)**:
  - Create tasks with title, description, priority, category, and due date.
  - View tasks categorized by state (To Do, In Progress, Completed).
  - Edit task attributes with pre-populated data validation.
  - Delete tasks with safe confirmation dialogs to prevent accidental loss.
  - One-click completion toggle with automatic completion timestamps.
- **Interactive Dashboard**:
  - Total tasks, To Do, In Progress, Completed, and Overdue metric cards.
  - Dynamic completion percentage indicator.
  - Visual completion status distribution donut chart (Recharts).
  - Priority distribution progress bars.
  - Quick-view sections for "Today's Tasks" and "Upcoming Tasks".
- **Advanced Filtering & Sorting**:
  - Live full-text search across task titles and descriptions.
  - Combined filtering: Status + Priority + Category + Due Date (Today / Upcoming / Overdue).
  - Sorting: Due date, priority rank, title alphabetically, created date, and updated date (Ascending / Descending).
- **Due Date Intelligence**: Automatic status tags (`Due Today`, `Due Tomorrow`, `Overdue by X days`).
- **Account & Privacy Management**: Display name customization, session sign-out, and complete account deletion with automated batch removal of user data.
- **Verification Suite & Viva Demonstrator**: In-app execution of all 34 unit, integration, and security test cases.

---

## 5. Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM, Lucide React icons.
- **Data Visualization**: Recharts.
- **Backend & Database**: Firebase Authentication, Google Cloud Firestore (Enterprise).
- **Security**: Cloud Firestore Security Rules (ABAC).
- **Tooling**: Node.js, TSX, ESLint.

---

## 6. Architecture & Data Flow

```
+-----------------------------------------------------------+
|                        React 19 UI                        |
|  (Navbar, Sidebar, Dashboard, Tasks, Settings, Modals)    |
+-----------------------------+-----------------------------+
                              |
+-----------------------------v-----------------------------+
|              Hooks & Context State Layer                  |
|          (useAuth, useTasks, AuthContext)                 |
+-----------------------------+-----------------------------+
                              |
+-----------------------------v-----------------------------+
|                     Service Layer                         |
|     (authService.ts, taskService.ts, Validators)          |
+-----------------------------+-----------------------------+
                              |
+-----------------------------v-----------------------------+
|                      Firebase SDK                         |
|      (firebase/auth, firebase/firestore onSnapshot)       |
+-----------------------------+-----------------------------+
                              |
+-----------------------------v-----------------------------+
|                  Google Cloud Firestore                   |
|           Enforced by Server-Side Security Rules          |
|    - users/{userId}                                       |
|    - tasks/{taskId} where task.userId == request.auth.uid |
+-----------------------------------------------------------+
```

---

## 7. Firestore Data Model

### Collection: `users/{userId}`
| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Authentication unique ID |
| `displayName` | string | User's chosen display name (max 100 chars) |
| `email` | string | User's verified email address |
| `createdAt` | string (ISO) | Account creation timestamp |
| `updatedAt` | string (ISO) | Profile update timestamp |

### Collection: `tasks/{taskId}`
| Field | Type | Description |
|---|---|---|
| `id` | string | Unique document ID |
| `userId` | string | Owner UID (strictly matches `request.auth.uid`) |
| `title` | string | Task title (1–120 characters) |
| `description` | string | Optional details (max 1000 characters) |
| `status` | string | Enum: `'TODO'` \| `'IN_PROGRESS'` \| `'COMPLETED'` |
| `priority` | string | Enum: `'LOW'` \| `'MEDIUM'` \| `'HIGH'` |
| `category` | string | Enum: `'Personal'` \| `'College'` \| `'Work'` \| `'Health'` \| `'Finance'` \| `'Other'` |
| `dueDate` | string | Target deadline formatted as `YYYY-MM-DD` |
| `createdAt` | string (ISO) | Creation timestamp |
| `updatedAt` | string (ISO) | Last update timestamp |
| `completedAt` | string / null | Timestamp when marked completed, null otherwise |

---

## 8. Security Model
Security is enforced at the database server level through `firestore.rules`:
1. **Default Deny**: All unmatched collections deny read and write.
2. **Identity Verification**: All write and read operations mandate an authenticated session (`request.auth != null`).
3. **Tenant Isolation**:
   - `tasks` queries enforce `resource.data.userId == request.auth.uid`.
   - Single-document `get`, `update`, and `delete` operations require `resource.data.userId == request.auth.uid`.
   - New task creation requires `incoming().userId == request.auth.uid`.
4. **Schema & Volumetric Boundaries**: Field lengths, valid enum strings, and required fields are enforced in the database rules.

---

## 9. Folder Structure
```
src/
├── assets/
├── components/
│   ├── dashboard/
│   │   ├── CompletionChart.tsx
│   │   ├── PriorityDistribution.tsx
│   │   └── StatCard.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskEmptyState.tsx
│   │   ├── TaskFilterBar.tsx
│   │   └── TaskFormModal.tsx
│   └── ui/
│       ├── Alert.tsx
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── ConfirmDialog.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Select.tsx
├── context/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useTasks.ts
├── lib/
│   ├── constants.ts
│   ├── errors.ts
│   └── firebase.ts
├── pages/
│   ├── auth/
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── settings/
│   │   └── SettingsPage.tsx
│   ├── tasks/
│   │   └── TasksPage.tsx
│   └── tests/
│       └── TestsPage.tsx
├── routes/
│   └── AppRoutes.tsx
├── services/
│   ├── auth/
│   │   └── authService.ts
│   └── tasks/
│       └── taskService.ts
├── tests/
│   └── unitTests.ts
├── types/
│   └── index.ts
├── utils/
│   ├── dateUtils.ts
│   └── statsUtils.ts
├── validators/
│   ├── authValidator.ts
│   └── taskValidator.ts
├── App.tsx
├── index.css
└── main.tsx
```

---

## 10. Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd personal-task-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Ensure `firebase-applet-config.json` exists in the project root with your project credentials:
   ```json
   {
     "projectId": "your-firebase-project",
     "appId": "...",
     "apiKey": "...",
     "authDomain": "...",
     "firestoreDatabaseId": "..."
   }
   ```

4. **Deploy Firestore Security Rules**:
   Deploy `firestore.rules` to your Firebase project.

5. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Production Build**:
   ```bash
   npm run build
   ```

---

## 11. Testing & Verification
The system includes an automated 34-point test suite accessible directly inside the application at `/tests`.
- **Unit Tests**: Title length, required fields, date formats, priority enums, email regex, password length.
- **Integration Tests**: Task creation, dynamic status updates, batch deletion, profile updates.
- **Security Tests**: Ownership rule guarantees, cross-user isolation verification.

---

## 12. Known Limitations
- Offline changes rely on standard Firestore client cache; full offline-first service worker sync is planned for future phases.
- File attachments (such as PDF assignment uploads) are not included to keep the mini-project scope focused on task metadata.

---

## 13. Future Enhancements
- Push notifications / Browser Notification API for due-date alerts.
- Recurring tasks (daily, weekly, monthly routines).
- Export tasks to CSV / PDF report.
- Dark mode theme toggle.
