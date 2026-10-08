import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Task, TaskFormData, TaskStatus } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/errors';
import { validateTask } from '../../validators/taskValidator';
import { getTodayDateString } from '../../utils/dateUtils';

const COLLECTION_NAME = 'tasks';

export async function createTask(formData: TaskFormData): Promise<Task> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required to create a task.');

  // Validate defensively before writing
  const validation = validateTask(formData);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError || 'Invalid task data.');
  }

  const taskDocRef = doc(collection(db, COLLECTION_NAME));
  const now = new Date().toISOString();

  const newTask: Task = {
    id: taskDocRef.id,
    userId: user.uid,
    title: formData.title.trim(),
    description: formData.description ? formData.description.trim() : '',
    status: formData.status || 'TODO',
    priority: formData.priority,
    category: formData.category,
    dueDate: formData.dueDate,
    createdAt: now,
    updatedAt: now,
    completedAt: formData.status === 'COMPLETED' ? now : null,
  };

  try {
    await setDoc(taskDocRef, newTask);
    return newTask;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${taskDocRef.id}`);
  }
}

export async function fetchUserTasks(): Promise<Task[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const tasksQuery = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', user.uid)
  );

  try {
    const snapshot = await getDocs(tasksQuery);
    const tasks: Task[] = [];
    snapshot.forEach((docSnap) => {
      tasks.push(docSnap.data() as Task);
    });
    return tasks;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  }
}

export function subscribeToUserTasks(
  userId: string,
  onUpdate: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const tasksQuery = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      const tasks: Task[] = [];
      snapshot.forEach((docSnap) => {
        tasks.push(docSnap.data() as Task);
      });
      onUpdate(tasks);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      } catch (err) {
        onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  );
}

export async function updateTask(taskId: string, updates: Partial<TaskFormData>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required.');

  // Validate updates
  const validation = validateTask(updates);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError || 'Validation failed for update.');
  }

  const now = new Date().toISOString();
  const updatePayload: Record<string, unknown> = {
    updatedAt: now,
  };

  if (updates.title !== undefined) updatePayload.title = updates.title.trim();
  if (updates.description !== undefined) updatePayload.description = updates.description.trim();
  if (updates.priority !== undefined) updatePayload.priority = updates.priority;
  if (updates.category !== undefined) updatePayload.category = updates.category;
  if (updates.dueDate !== undefined) updatePayload.dueDate = updates.dueDate;
  if (updates.status !== undefined) {
    updatePayload.status = updates.status;
    updatePayload.completedAt = updates.status === 'COMPLETED' ? now : null;
  }

  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  try {
    await updateDoc(taskDocRef, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${taskId}`);
  }
}

export async function toggleTaskCompletion(taskId: string, currentStatus: TaskStatus): Promise<TaskStatus> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required.');

  const now = new Date().toISOString();
  const newStatus: TaskStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';

  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  try {
    await updateDoc(taskDocRef, {
      status: newStatus,
      completedAt: newStatus === 'COMPLETED' ? now : null,
      updatedAt: now,
    });
    return newStatus;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${taskId}`);
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required.');

  const taskDocRef = doc(db, COLLECTION_NAME, taskId);
  try {
    await deleteDoc(taskDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${taskId}`);
  }
}

export async function seedDemoTasks(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required.');

  const todayStr = getTodayDateString();

  // Create dates: overdue (-2 days), today, tomorrow (+1 day), next week (+5 days)
  const today = new Date(todayStr + 'T00:00:00');
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - 2);
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(today.getDate() + 1);
  const nextWeekDate = new Date(today);
  nextWeekDate.setDate(today.getDate() + 5);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const sampleTasks: TaskFormData[] = [
    {
      title: 'Complete DNN assignment',
      description: 'Prepare Unit 4 answers on Deep Neural Networks and hyperparameter tuning.',
      priority: 'HIGH',
      category: 'College',
      dueDate: todayStr,
      status: 'IN_PROGRESS',
    },
    {
      title: 'Prepare project presentation',
      description: 'Review system architecture slides and viva answers for the demonstration.',
      priority: 'HIGH',
      category: 'College',
      dueDate: formatDate(tomorrowDate),
      status: 'TODO',
    },
    {
      title: 'Submit internship application',
      description: 'Update resume with recent project links and submit before application deadline.',
      priority: 'MEDIUM',
      category: 'Work',
      dueDate: formatDate(pastDate), // overdue demo
      status: 'TODO',
    },
    {
      title: 'Buy groceries and pantry supplies',
      description: 'Vegetables, milk, fruits, and weekly essentials.',
      priority: 'LOW',
      category: 'Personal',
      dueDate: todayStr,
      status: 'COMPLETED',
    },
    {
      title: 'Pay electricity bill',
      description: 'Online utility portal payment for the current billing cycle.',
      priority: 'MEDIUM',
      category: 'Finance',
      dueDate: formatDate(nextWeekDate),
      status: 'TODO',
    },
    {
      title: '30-minute evening jog',
      description: 'Cardio workout and light stretching at the college track.',
      priority: 'LOW',
      category: 'Health',
      dueDate: todayStr,
      status: 'TODO',
    },
  ];

  for (const sample of sampleTasks) {
    await createTask(sample);
  }
}
