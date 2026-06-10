// Auto-generated from Prisma model: CoinsHistory

import { Coins } from './Coins';
import { Quiz } from './Quiz';
import { UserProfile } from './UserProfile';

export interface CoinsHistory {
  id: string;
  userId: string;
  coinsId: string;
  coins: number;
  reason: string | null;
  quizId: string | null;
  createdAt: Date;
  user: UserProfile;
  coin: Coins;
  quiz: Quiz | null;
}

export interface CoinsHistoryCreateInput {
  coins?: number;
  reason?: string | null;
  user?: UserProfile;
  coin?: Coins;
  quiz?: Quiz | null;
}