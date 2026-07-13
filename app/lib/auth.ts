export type UserRole = 'business' | 'organization' | 'family';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization: string;
  donations: DonationItem[];
  needs: NeedItem[];
  createdAt: string;
}

export interface DonationItem {
  id: string;
  title: string;
  quantity: string;
  notes: string;
  createdAt: string;
}

export interface NeedItem {
  id: string;
  title: string;
  quantity: string;
  notes: string;
  createdAt: string;
}

const USERS_KEY = 'harvestlink-users';
const CURRENT_USER_KEY = 'harvestlink-current-user';

function readStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredUsers() {
  return (readStorage<UserProfile[]>(USERS_KEY) ?? []) as UserProfile[];
}

export function saveStoredUsers(users: UserProfile[]) {
  writeStorage(USERS_KEY, users);
}

export function getCurrentUser() {
  return readStorage<UserProfile>(CURRENT_USER_KEY);
}

export function setCurrentUser(user: UserProfile | null) {
  if (user) {
    writeStorage(CURRENT_USER_KEY, user);
    return;
  }

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function signUpUser(input: Omit<UserProfile, 'id' | 'createdAt' | 'donations' | 'needs'>) {
  const users = getStoredUsers();
  const existing = users.find((user) => user.email.toLowerCase() === input.email.toLowerCase());

  if (existing) {
    return { ok: false, message: 'An account with that email already exists.' } as const;
  }

  const now = new Date().toISOString();
  const user: UserProfile = {
    ...input,
    id: `user-${Date.now()}`,
    createdAt: now,
    donations: [],
    needs: [],
  };

  users.push(user);
  saveStoredUsers(users);
  setCurrentUser(user);

  return { ok: true, user } as const;
}

export function signInUser(email: string, password: string) {
  const users = getStoredUsers();
  const user = users.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password,
  );

  if (!user) {
    return { ok: false, message: 'No matching account found. Please try again.' } as const;
  }

  setCurrentUser(user);
  return { ok: true, user } as const;
}

export function updateUserProfile(updatedUser: UserProfile) {
  const users = getStoredUsers();
  const nextUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
  saveStoredUsers(nextUsers);
  setCurrentUser(updatedUser);
}
