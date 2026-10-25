export type UserRole = 'business' | 'organization' | 'family' | 'seeker';

export interface SeekerProfile {
  householdSize: string;
  dietaryNeeds: string;
  accessibilityNeeds: string;
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  organization: string;
  address?: string;
  seekerProfile?: SeekerProfile;
  donorPoints?: number;
  donorLevel?: string;
  donations: DonationItem[];
  needs: NeedItem[];
  createdAt: string;
}

export interface DonationItem {
  id: string;
  title: string;
  quantity: string;
  notes: string;
  address?: string;
  category?: string;
  quality?: string;
  estimatedPounds?: string;
  donorPointsAwarded?: number;
  createdAt: string;
}

export interface NeedItem {
  id: string;
  title: string;
  quantity: string;
  notes: string;
  createdAt: string;
}

const USERS_KEY = 'mittenmeals-users';
const LEGACY_USERS_KEY = 'harvestlink-users';
const CURRENT_USER_KEY = 'mittenmeals-current-user';
const LEGACY_CURRENT_USER_KEY = 'harvestlink-current-user';

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
  const currentUsers = readStorage<UserProfile[]>(USERS_KEY) ?? [];
  const legacyUsers = readStorage<UserProfile[]>(LEGACY_USERS_KEY) ?? [];
  const userEmails = new Set(currentUsers.map((user) => user.email.trim().toLowerCase()));
  const migratedUsers = legacyUsers.filter((user) => {
    const email = user.email.trim().toLowerCase();
    if (userEmails.has(email)) {
      return false;
    }
    userEmails.add(email);
    return true;
  });
  const users = [
    ...currentUsers,
    ...migratedUsers,
  ];

  if (users.length > currentUsers.length) {
    writeStorage(USERS_KEY, users);
  }

  return users;
}

export function saveStoredUsers(users: UserProfile[]) {
  writeStorage(USERS_KEY, users);
}

export function getCurrentUser() {
  return readStorage<UserProfile>(CURRENT_USER_KEY) ?? readStorage<UserProfile>(LEGACY_CURRENT_USER_KEY);
}

export function setCurrentUser(user: UserProfile | null) {
  if (user) {
    writeStorage(CURRENT_USER_KEY, user);
    return;
  }

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    window.localStorage.removeItem(LEGACY_CURRENT_USER_KEY);
  }
}

export function calculateDonationPoints(item: Partial<DonationItem> | null | undefined) {
  const pounds = Number(String(item?.estimatedPounds ?? item?.quantity ?? '0').replace(/[^0-9.]/g, '')) || 0;
  const qualityScore = {
    excellent: 90,
    good: 55,
    fair: 30,
  }[String(item?.quality ?? 'good').toLowerCase()] ?? 0;

  const categoryScore = {
    produce: 35,
    pantry: 25,
    dairy: 30,
    meals: 50,
    bakery: 20,
    fresh: 30,
  }[String(item?.category ?? '').toLowerCase()] ?? 15;

  const quantityBoost = /bulk|large|family|box/i.test(String(item?.quantity ?? '')) ? 35 : 0;
  return Math.round(pounds * 12 + qualityScore + categoryScore + quantityBoost + 10);
}

export function getDonorLevel(points: number) {
  const levelConfig = [
    { name: 'Starter', min: 0, target: 120 },
    { name: 'Community Helper', min: 120, target: 250 },
    { name: 'Local Hero', min: 250, target: 500 },
    { name: 'Food Rescue Champion', min: 500, target: 850 },
    { name: 'Michigan Food Guardian', min: 850, target: 1200 },
  ];

  const activeLevel = levelConfig.reduce((current, level) => (points >= level.min ? level : current), levelConfig[0]);
  const activeIndex = levelConfig.findIndex((level) => level.name === activeLevel.name);
  const nextLevel = levelConfig[activeIndex + 1] ?? null;

  const progressStart = activeLevel.min;
  const progressEnd = nextLevel ? nextLevel.min : activeLevel.target;
  const progress = progressEnd === progressStart ? 100 : Math.min(100, ((points - progressStart) / (progressEnd - progressStart)) * 100);

  return {
    name: activeLevel.name,
    progress,
    nextLevel: nextLevel ? nextLevel.name : 'Max level',
    points,
    target: nextLevel ? nextLevel.min : activeLevel.target,
  };
}

export function signUpUser(
  input: Omit<UserProfile, 'id' | 'createdAt' | 'donations' | 'needs' | 'donorPoints' | 'donorLevel'> & { address?: string },
) {
  const users = getStoredUsers();
  const email = input.email.trim();
  const existing = users.find((user) => user.email.trim().toLowerCase() === email.toLowerCase());

  if (existing) {
    return { ok: false, message: 'An account with that email already exists.' } as const;
  }

  const now = new Date().toISOString();
  const user: UserProfile = {
    ...input,
    email,
    address: input.address ?? input.organization ?? '',
    donorPoints: 0,
    donorLevel: 'Starter',
    id: `user-${Date.now()}`,
    createdAt: now,
    donations: [],
    needs: [],
  };

  users.push(user);
  saveStoredUsers(users);

  return { ok: true, user } as const;
}

export function signInUser(email: string, password: string) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((entry) => entry.email.trim().toLowerCase() === normalizedEmail);

  if (!user) {
    return { ok: false, message: 'No account found for that email. Please check it or create an account.' } as const;
  }

  if (user.password !== password) {
    return { ok: false, message: 'That password does not match this account. Please try again.' } as const;
  }

  setCurrentUser(user);
  return { ok: true, user } as const;
}

export function signOutUser() {
  setCurrentUser(null);
}

export function updateUserProfile(updatedUser: UserProfile) {
  const users = getStoredUsers();
  const nextUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
  saveStoredUsers(nextUsers);
  setCurrentUser(updatedUser);
}

export function getAllDonationEntries() {
  return getStoredUsers()
    .flatMap((user) =>
      user.donations.map((donation) => ({
        ...donation,
        donorName: user.name,
        donorOrganization: user.organization || 'Local donor',
      })),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
