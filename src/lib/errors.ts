import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const current = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: current?.uid,
      email: current?.email,
      emailVerified: current?.emailVerified,
      isAnonymous: current?.isAnonymous,
      tenantId: current?.tenantId,
      providerInfo: current?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const message = error instanceof Error ? error.message : String(error);

  // Parse structured FirestoreErrorInfo if present
  if (message.startsWith('{') && message.includes('"operationType"')) {
    try {
      const parsed = JSON.parse(message);
      if (parsed.error?.toLowerCase().includes('permission') || parsed.error?.toLowerCase().includes('denied')) {
        return 'Access denied. You can only view and manage your own tasks.';
      }
    } catch {
      // fallback
    }
  }

  // Common Firebase Auth error codes
  if (message.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists. Try logging in instead.';
  }
  if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password') || message.includes('auth/user-not-found')) {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (message.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (message.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('auth/popup-closed-by-user')) {
    return 'Sign-in cancelled. The window was closed before completing sign-in.';
  }
  if (message.includes('auth/popup-blocked')) {
    return 'Popup was blocked by your browser. Please allow popups for this site.';
  }
  if (message.includes('auth/too-many-requests')) {
    return 'Too many unsuccessful attempts. Please wait a few moments before trying again.';
  }
  if (message.includes('auth/network-request-failed')) {
    return 'Network connection failed. Please check your internet connection.';
  }
  if (message.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign-in is not yet enabled in Firebase Console. Please use "Continue with Google" or enable Email/Password provider in the Firebase Authentication console.';
  }
  if (message.includes('permission-denied') || message.includes('Missing or insufficient permissions')) {
    return 'Permission denied. You do not have permission to perform this action.';
  }
  if (message.includes('unavailable') || message.includes('client is offline')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  return message;
}
