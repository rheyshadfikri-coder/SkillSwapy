import { db, auth, isFirebaseActive } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { User, Project, DiscussionPost, Message, Session, Review } from '../types';
import { INITIAL_USERS, INITIAL_PROJECTS, INITIAL_REVIEWS } from '../data/initialData';

// Firestore operation types for our specialized handleFirestoreError
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Local storage keys
const USERS_STORAGE_KEY = 'skillswap_users_db';
const SESSIONS_STORAGE_KEY = 'skillswap_sessions_db';

/**
 * Load all user accounts from local database + INITIAL_USERS.
 */
export async function getPersistedUsers(): Promise<User[]> {
  try {
    // 1. Try Firebase Firestore if configured
    if (isFirebaseActive && db) {
      const usersColRef = collection(db, 'users');
      try {
        const querySnapshot = await getDocs(usersColRef);
        const fbUsers: User[] = [];
        querySnapshot.forEach((doc) => {
          fbUsers.push(doc.data() as User);
        });

        // Merge with initial system users to ensure rich marketplace view
        const merged = [...INITIAL_USERS];
        fbUsers.forEach(fbu => {
          const idx = merged.findIndex(mu => mu.id === fbu.id || mu.email.toLowerCase() === fbu.email.toLowerCase());
          if (idx > -1) {
            merged[idx] = fbu;
          } else {
            merged.push(fbu);
          }
        });
        return merged;
      } catch (fbErr) {
        // Log & fall back to local storage
        console.warn('Firebase user collection read failed. Falling back to Local Storage.', fbErr);
      }
    }

    // 2. Local Storage Database Fallback/Offline Persistence
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }

    const parsed: User[] = JSON.parse(stored);
    
    // Safety check: make sure standard test accounts still exist in list
    const combined = [...parsed];
    INITIAL_USERS.forEach(initUser => {
      if (!combined.some(u => u.id === initUser.id)) {
        combined.push(initUser);
      }
    });

    return combined;
  } catch (err) {
    console.error('Failed to parse users database', err);
    return INITIAL_USERS;
  }
}

/**
 * Save / Update user profile account in persistent database.
 */
export async function persistUserAccount(user: User): Promise<void> {
  // 1. If Firebase is active, sync with Cloud Firestore database
  if (isFirebaseActive && db) {
    const userPath = `users/${user.id}`;
    try {
      await setDoc(doc(db, 'users', user.id), user);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userPath);
    }
  }

  // 2. Always write to Local Storage Database for offline fallback stability
  try {
    const allUsers = await getPersistedUsers();
    const idx = allUsers.findIndex(u => u.id === user.id);
    if (idx > -1) {
      allUsers[idx] = user;
    } else {
      allUsers.unshift(user);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
  } catch (err) {
    console.error('Failed to save user account to local database', err);
  }
}

/**
 * Load custom Swap sessions.
 */
export function getPersistedSessions(defaultSessions: Session[]): Session[] {
  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(defaultSessions));
      return defaultSessions;
    }
    return JSON.parse(stored);
  } catch (err) {
    return defaultSessions;
  }
}

/**
 * Save Swap sessions.
 */
export function persistSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to persist sessions', err);
  }
}

const PROJECTS_STORAGE_KEY = 'skillswap_projects_db';

/**
 * Load portfolio projects.
 */
export function getPersistedProjects(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(stored);
  } catch (err) {
    return INITIAL_PROJECTS;
  }
}

/**
 * Save portfolio projects.
 */
export function persistProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to persist projects', err);
  }
}

const REVIEWS_STORAGE_KEY = 'skillswap_reviews_db';

/**
 * Load peer reviews.
 */
export async function getPersistedReviews(): Promise<Review[]> {
  if (isFirebaseActive && db) {
    const reviewsColRef = collection(db, 'reviews');
    try {
      const querySnapshot = await getDocs(reviewsColRef);
      const fbReviews: Review[] = [];
      querySnapshot.forEach((doc) => {
        fbReviews.push(doc.data() as Review);
      });
      
      const merged = [...fbReviews];
      INITIAL_REVIEWS.forEach(initRev => {
        if (!merged.some(r => r.id === initRev.id)) {
          merged.push(initRev);
        }
      });
      return merged;
    } catch (fbErr) {
      console.warn('Firebase reviews collection read failed. Falling back to Local Storage.', fbErr);
    }
  }

  try {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(stored);
  } catch (err) {
    return INITIAL_REVIEWS;
  }
}

/**
 * Save peer review.
 */
export async function persistReview(review: Review): Promise<void> {
  if (isFirebaseActive && db) {
    const reviewPath = `reviews/${review.id}`;
    try {
      await setDoc(doc(db, 'reviews', review.id), review);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, reviewPath);
    }
  }

  try {
    const allReviews = await getPersistedReviews();
    // Prepend new review
    const updated = [review, ...allReviews.filter(r => r.id !== review.id)];
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save review to local database', err);
  }
}
