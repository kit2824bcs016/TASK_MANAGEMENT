# Viva Voce Questions & Answers
## Personal Task Management System (TaskFlow)

This document contains 30 essential viva questions and straightforward answers designed for college project defense and examination.

---

### Q1. What is the objective of the Personal Task Management System?
**Answer**:  
The objective is to provide individual users and students with a clean, responsive, and secure web application to create, view, update, organize, prioritize, and track daily tasks and academic assignments with persistent cloud storage.

---

### Q2. Why did you choose React for the frontend?
**Answer**:  
React was selected because:
1. It uses a **component-based architecture**, allowing clean reusability of UI elements (such as task cards, modal dialogs, and navigation bars).
2. It uses the **Virtual DOM**, ensuring efficient, lightning-fast UI updates when tasks are toggled, created, or deleted.
3. It has a rich ecosystem and native TypeScript support.

---

### Q3. Why did you choose Firebase for this project?
**Answer**:  
Firebase provides a serverless backend suite encompassing Authentication, Cloud Firestore NoSQL Database, and Security Rules. It eliminates the need for maintaining a separate Express/Node server, reduces operational complexity, and offers built-in security, real-time listeners, and automatic scaling.

---

### Q4. What is Cloud Firestore, and how is it different from a traditional SQL database?
**Answer**:  
Cloud Firestore is a flexible, scalable, serverless **NoSQL document database**. Unlike relational SQL databases that use tables, rows, and rigid foreign key schemas, Firestore organizes data into **collections and documents**, where documents contain key-value fields. Firestore natively supports real-time synchronization and offline caching.

---

### Q5. What is a Firestore document and a collection?
**Answer**:  
- **Document**: A lightweight record containing fields and values (similar to a JSON object), with a 1MB size limit. Examples: `tasks/{taskId}` or `users/{userId}`.
- **Collection**: A container that holds documents. Collections only store documents, and documents point to data.

---

### Q6. What is Firebase Authentication, and what role does it play in this system?
**Answer**:  
Firebase Authentication provides a secure identity service that handles user registration, login, credential verification, password hashing, and token issuance. It securely manages user sessions and provides a unique `uid` (User ID) that identifies the user across the application and security rules.

---

### Q7. What does CRUD stand for, and how is it implemented in your project?
**Answer**:  
CRUD stands for **Create, Read, Update, Delete**:
- **Create**: Adding a new task via `createTask()` with title, priority, category, and due date.
- **Read**: Fetching and listening to user tasks using Firestore `onSnapshot` / `getDocs`.
- **Update**: Modifying task attributes (e.g., editing details or toggling status between To Do and Completed) via `updateDoc()`.
- **Delete**: Permanently removing a task via `deleteDoc()` with a required confirmation prompt.

---

### Q8. What are Firestore Security Rules, and why are they necessary?
**Answer**:  
Firestore Security Rules are server-side declarative logic that runs on Google Cloud servers before any database read or write is executed. They are essential because frontend security can be bypassed by an attacker using direct API calls. Security rules ensure that only authenticated requests with authorized credentials can access or modify data.

---

### Q9. How is task ownership enforced so User A cannot read or modify User B's tasks?
**Answer**:  
Every task document contains a `userId` field set to the owner's authentication UID. The `firestore.rules` file enforces:
```javascript
match /tasks/{taskId} {
  allow get, list, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
}
```
If User A attempts to query or modify a document owned by User B, Firestore rejects the request at the database level with a `PERMISSION_DENIED` error.

---

### Q10. How does the user authentication lifecycle work?
**Answer**:  
1. The user inputs their email and password on the registration/login page.
2. Firebase Authentication verifies or creates the account and returns a JSON Web Token (JWT).
3. The `onAuthStateChanged` observer in `AuthContext.tsx` detects the authenticated user and loads their profile.
4. Protected routes (`/dashboard`, `/tasks`, `/settings`) allow access.
5. Unauthenticated users are automatically redirected to `/login`.

---

### Q11. How does task filtering work in your application?
**Answer**:  
Filtering is performed using the `filterAndSortTasks` utility. It accepts user criteria (status, priority, category, due-date status, and search string) and applies consecutive condition checks against the task list. Because filters work together (composite filtering), a user can simultaneously filter for `High Priority` + `College` + `In Progress`.

---

### Q12. How is task search implemented?
**Answer**:  
The search bar accepts a text query, converts it to lowercase, and checks if the lowercase string is included in the task's `title` or `description`. The search is dynamic and case-insensitive.

---

### Q13. How is the completion percentage calculated on the dashboard?
**Answer**:  
The completion percentage is dynamically calculated from actual Firestore task data using the formula:
$$\text{Completion Percentage} = \text{round}\left(\frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100\right)$$
If the total task count is 0, the percentage safely defaults to 0% to prevent division-by-zero errors.

---

### Q14. How are due dates handled and classified?
**Answer**:  
Due dates are stored in standard `YYYY-MM-DD` string format. The helper `getDueDateWarning()` compares the due date against today's date (`getTodayDateString()`):
- If `dueDate < today`: Classified as **Overdue** (e.g., "Overdue by 2 days").
- If `dueDate == today`: Classified as **Due Today**.
- If `dueDate == today + 1`: Classified as **Due Tomorrow**.
- If `dueDate > today + 1`: Classified as **Upcoming** (e.g., "Due in 5 days").
- If marked completed: The warning status displays "Completed".

---

### Q15. Why did you use TypeScript instead of plain JavaScript?
**Answer**:  
TypeScript provides static typing and compile-time error checking. It enforces exact interfaces for `Task`, `UserProfile`, and `TaskFormData`. This prevents runtime errors (like spelling mistakes in property names or undefined values), improves developer productivity, and self-documents the codebase.

---

### Q16. How did you make the design responsive?
**Answer**:  
Using Tailwind CSS utility classes:
- On desktop screens: A persistent sidebar and multi-column grid layout are shown.
- On mobile devices: A collapsible navigation drawer with a hamburger menu is used, cards stack vertically, and forms become single-column.
- Elements avoid horizontal scrollbars through responsive container breakpoints (`sm:`, `md:`, `lg:`).

---

### Q17. How is data validated in the application?
**Answer**:  
Data validation is implemented in two tiers:
1. **Frontend Validation (`taskValidator.ts`)**: Checks required fields, title length (2–120 characters), description length (max 1000 characters), valid priority enums, and valid date formats before submitting.
2. **Server-Side Security Rules (`firestore.rules`)**: Evaluates incoming document payloads and rejects invalid values even if the client validation is bypassed.

---

### Q18. How is accidental task deletion prevented?
**Answer**:  
The application uses a `ConfirmDialog` modal. Clicking the delete icon does not delete the task immediately; it displays a modal stating *"Delete this task?"* with "Cancel" and "Delete" options. Deletion only executes after the user explicitly confirms.

---

### Q19. How does user logout work?
**Answer**:  
When the user clicks "Sign out", the application calls `signOut(auth)` from the Firebase SDK. This invalidates the current authentication session token. The `onAuthStateChanged` hook resets the user state to `null`, which immediately activates the route guard and redirects the user to the `/login` page.

---

### Q20. How is task state managed across components?
**Answer**:  
- Global authentication state is managed using **React Context** (`AuthContext`).
- Task state is managed via the custom hook `useTasks`, which establishes a real-time Firestore listener (`onSnapshot`). Whenever tasks are created, updated, or deleted, Firestore pushes the update and the UI automatically re-renders without full-page reloads.

---

### Q21. What happens when a user deletes their account in Settings?
**Answer**:  
The system executes a safe cascade deletion in three steps:
1. Queries and deletes all tasks belonging to `userId` using a Firestore batch delete.
2. Deletes the user profile document at `/users/{userId}`.
3. Deletes the Firebase Authentication user record using `deleteUser(user)`.

---

### Q22. Are passwords stored in Firestore?
**Answer**:  
**No**. Passwords are never stored in Firestore. All password management, hashing (using bcrypt/scrypt), and credential verification are handled exclusively by Firebase Authentication's hardened identity infrastructure.

---

### Q23. Why did you include sample tasks for demo purposes?
**Answer**:  
A "Load Sample Tasks" button is provided so that during project viva evaluation or presentation, an examiner or evaluator can populate realistic academic and personal tasks (such as "Complete DNN assignment" and "Prepare project presentation") with a single click, instantly demonstrating filtering, dashboard metrics, and due-date warnings.

---

### Q24. What are the key categories available in your system?
**Answer**:  
The system provides six distinct categories:
1. **College** (e.g., assignments, lab records, project reviews)
2. **Personal** (e.g., shopping, family commitments)
3. **Work** (e.g., internships, job applications)
4. **Health** (e.g., workouts, medical checkups)
5. **Finance** (e.g., tuition fees, electricity bills)
6. **Other** (miscellaneous tasks)

---

### Q25. What is the role of Recharts in the application?
**Answer**:  
Recharts is used selectively to render a clean, lightweight Donut Chart on the dashboard. It visualizes the proportion of tasks in To Do, In Progress, and Completed states with hover tooltips, avoiding manual SVG math or heavy charting libraries.

---

### Q26. What is the difference between synchronous validation and asynchronous operations?
**Answer**:  
- **Synchronous validation**: Happens instantaneously in the browser (e.g., checking if the task title is at least 2 characters long or if email regex matches).
- **Asynchronous operations**: Operations that involve network requests (e.g., contacting Firebase servers to create a task, update a document, or sign in). These use `async/await` and display spinner loading indicators to prevent interface freezes.

---

### Q27. What happens if a network error occurs while using the app?
**Answer**:  
The application has centralized error mapping in `src/lib/errors.ts`. When a network failure happens, instead of crashing or showing a raw stack trace, the application intercepts the error and displays a user-friendly message such as: *"Unable to connect. Please check your internet connection."*

---

### Q28. What is the purpose of the `/tests` page in the application?
**Answer**:  
The `/tests` page runs an automated test suite containing 34 formal unit, integration, and security test cases. During project viva, it allows the examiner to verify that validation, calculations, filtering, and access control rules pass with 100% test integrity.

---

### Q29. Could this application scale to thousands of users?
**Answer**:  
Yes. Because Cloud Firestore is a distributed, auto-scaling NoSQL cloud database and queries are strictly indexed and scoped to `userId == current_user_uid`, each query only fetches the specific user's tasks. The database load scales horizontally without performance degradation as user count increases.

---

### Q30. If you had more time, what feature would you add next?
**Answer**:  
I would implement **Web Push Notifications** using the browser Notification API and Service Workers to alert users when a task is due within one hour, and add recurring tasks for daily or weekly student routines.
