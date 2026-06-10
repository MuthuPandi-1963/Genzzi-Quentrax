// =============================================================================
// MODEL: Coins  (gamification balance)
// =============================================================================

import type { CoinsHistory } from './CoinsHistory';
import type { UserProfile } from './UserProfile';

export interface Coins {
  id: string;
  userId: string; // FK → UserProfile.id (unique)


  balance: number;

  createdAt: Date;
  updatedAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  user?: UserProfile;
  history?: CoinsHistory[];
}

/** Created automatically on user registration — no manual input needed */
export interface CoinsCreateInput {
  userId: string;
  balance?: number; // defaults to 0
}

export interface CoinsUpdateInput {
  /** Use atomic increment/decrement at DB layer, not this field directly */
  balance?: number;
}