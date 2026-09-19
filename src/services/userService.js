import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { DEFAULT_PROGRESS, xpToLevel } from "../data/levels";

function userRef(uid) {
  return doc(db, "users", uid);
}

export async function createUserProfile(uid, name) {
  const profile = {
    name,
    xp: 0,
    level: 1,
    levelName: "Forex Beginner",
    streak: 0,
    badges: [],
    completedLessons: [],
    challengeDays: [],
    progress: DEFAULT_PROGRESS,
    premium: false, // can only ever be flipped to true by the Midtrans webhook (Admin SDK)
    simBalance: 10000000, // virtual demo-account balance (IDR), never real money
    createdAt: serverTimestamp(),
  };
  await setDoc(userRef(uid), profile);
  return profile;
}

export async function getUserProfile(uid) {
  const snap = await getDoc(userRef(uid));
  if (!snap.exists()) return null;
  return snap.data();
}

// Realtime subscription — used so that `premium` flips to true automatically
// once the Midtrans webhook updates Firestore, without needing a page refresh.
// Returns an unsubscribe function.
export function subscribeToProfile(uid, callback) {
  return onSnapshot(userRef(uid), (snap) => {
    callback(snap.exists() ? snap.data() : null);
  });
}

// Adds XP, recalculates level/levelName, and optionally unlocks a badge.
// Returns the updated fields so the caller can update local state without
// a second read.
export async function grantXp(uid, currentProfile, amount, { badge } = {}) {
  const newXp = (currentProfile.xp || 0) + amount;
  const { level, levelName } = xpToLevel(newXp);
  const update = { xp: newXp, level, levelName };
  if (badge && !currentProfile.badges?.includes(badge)) {
    update.badges = arrayUnion(badge);
  }
  await updateDoc(userRef(uid), update);
  return {
    ...currentProfile,
    xp: newXp,
    level,
    levelName,
    badges: badge && !currentProfile.badges?.includes(badge) ? [...(currentProfile.badges || []), badge] : currentProfile.badges,
  };
}

export async function markLessonComplete(uid, currentProfile, lessonId, xpReward = 20) {
  if (currentProfile.completedLessons?.includes(lessonId)) return currentProfile;
  await updateDoc(userRef(uid), { completedLessons: arrayUnion(lessonId) });
  const withLesson = {
    ...currentProfile,
    completedLessons: [...(currentProfile.completedLessons || []), lessonId],
  };
  const shouldBadge = (withLesson.completedLessons.length === 1 && "first_step") || null;
  return grantXp(uid, withLesson, xpReward, { badge: shouldBadge });
}

export async function toggleChallengeDay(uid, currentProfile, day, xpReward = 100) {
  const has = currentProfile.challengeDays?.includes(day);
  if (has) {
    // Simplify: unmarking just updates the local/remote array without refunding XP,
    // matching "streak isn't punished" philosophy — completion history stays visible.
    const nextDays = currentProfile.challengeDays.filter((d) => d !== day);
    await updateDoc(userRef(uid), { challengeDays: nextDays });
    return { ...currentProfile, challengeDays: nextDays };
  }
  await updateDoc(userRef(uid), { challengeDays: arrayUnion(day) });
  const nextDays = [...(currentProfile.challengeDays || []), day];
  const badge = nextDays.length === 30 ? "challenge_30" : null;
  return grantXp(uid, { ...currentProfile, challengeDays: nextDays }, xpReward, { badge });
}

export async function updateStreak(uid, currentProfile, streak) {
  await updateDoc(userRef(uid), { streak });
  const badge = streak === 7 ? "streak_7" : null;
  if (badge && !currentProfile.badges?.includes(badge)) {
    return grantXp(uid, { ...currentProfile, streak }, 0, { badge });
  }
  return { ...currentProfile, streak };
}

/* ---------------- Trading journal (subcollection) ---------------- */

function journalCol(uid) {
  return collection(db, "users", uid, "journal");
}

export async function addJournalEntry(uid, entry) {
  await addDoc(journalCol(uid), { ...entry, createdAt: serverTimestamp() });
}

export async function getJournalEntries(uid) {
  const q = query(journalCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ---------------- Trading Simulator (demo account, virtual money only) ---------------- */

const DEFAULT_SIM_BALANCE = 10000000;

function simTradesCol(uid) {
  return collection(db, "users", uid, "simTrades");
}

// Records one simulated trade (or a WAIT decision) and updates the virtual
// balance. `pnl` is 0 for a WAIT. This never touches real money — simBalance
// is a plain virtual number stored on the user's own profile document.
export async function addSimTrade(uid, currentProfile, trade) {
  await addDoc(simTradesCol(uid), { ...trade, createdAt: serverTimestamp() });
  if (trade.pnl) {
    await updateDoc(userRef(uid), { simBalance: increment(trade.pnl) });
  }
  return { ...currentProfile, simBalance: (currentProfile.simBalance ?? DEFAULT_SIM_BALANCE) + (trade.pnl || 0) };
}

export async function getSimTrades(uid) {
  const q = query(simTradesCol(uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function resetSimAccount(uid, currentProfile) {
  await updateDoc(userRef(uid), { simBalance: DEFAULT_SIM_BALANCE });
  return { ...currentProfile, simBalance: DEFAULT_SIM_BALANCE };
}
