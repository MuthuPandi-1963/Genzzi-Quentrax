
import type { Coins } from './Coins';
import type { Quiz } from './Quiz';
import type { UserProfile } from './UserProfile';

export interface CoinsHistory {
  id: string;
  userId: string;  // FK → UserProfile.id
  coinsId: string; // FK → Coins.id (for direct join without subquery)
  coins: number;

  reason: string | null;
  quizId: string | null; // FK → Quiz.id (nullable)
  createdAt: Date;

  // ── Relations ─────────────────────────────────────────────────────────────
  user?: UserProfile;
  coin?: Coins;
  quiz?: Quiz | null;
}

export interface CoinsHistoryCreateInput {
  userId: string;
  coinsId: string;
  coins: number;
  reason?: string | null;
  quizId?: string | null;
}