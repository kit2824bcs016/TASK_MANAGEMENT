import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  User,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/errors';

export async function syncUserProfile(user: User, customDisplayName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();
  const displayName = customDisplayName || user.displayName || user.email?.split('@')[0] || 'User';

  try {
    const existingSnap = await getDoc(userRef);
    if (!existingSnap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        displayName,
        email: user.email || '',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const data = existingSnap.data() as UserProfile;
      return data;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export async function registerWithEmailPassword(
  email: string,
  pass: string,
  displayName: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  await updateProfile(credential.user, { displayName });
  await syncUserProfile(credential.user, displayName);
  return credential.user;
}

export async function loginWithEmailPassword(email: string, pass: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(credential.user);
  return credential.user;
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  await syncUserProfile(credential.user);
  return credential.user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function updateUserDisplayName(newDisplayName: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user found.');

  await updateProfile(user, { displayName: newDisplayName });

  const userRef = doc(db, 'users', user.uid);
  try {
    await updateDoc(userRef, {
      displayName: newDisplayName,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
  }
}

export async function deleteUserAccountAndData(): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user found.');

  const userId = user.uid;

  // 1. Delete all user tasks in batches
  try {
    const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(tasksQuery);

    const batch = writeBatch(db);
    querySnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'tasks');
  }

  // 2. Delete user profile document
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
  }

  // 3. Delete Firebase Auth account
  await deleteUser(user);
}
