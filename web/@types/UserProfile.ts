// Auto-generated from Prisma model: UserProfile

import { UserRole } from './enums';

import { Assessment } from './Assessment';
import { AssessmentAssignment } from './AssessmentAssignment';
import { AssessmentAttempt } from './AssessmentAttempt';
import { AuditLog } from './AuditLog';
import { Coins } from './Coins';
import { CoinsHistory } from './CoinsHistory';
import { Quiz } from './Quiz';
import { QuizHistory } from './QuizHistory';
import { UserAuth } from './UserAuth';

export interface UserProfile {
  id: string;
  name: string;
  countryCode: string | null;
  avatar: string | null;
  bio: string | null;
  role: UserRole;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  auth: UserAuth | null;
  quizHistory: QuizHistory[];
  createdQuizzes: Quiz[];
  coins: Coins | null;
  coinsHistory: CoinsHistory[];
  createdAssessments: Assessment[];
  assessmentAssignments: AssessmentAssignment[];
  assessmentAttempts: AssessmentAttempt[];
  auditLogsActed: AuditLog[];
}

export interface UserProfileCreateInput {
  name?: string;
  countryCode?: string | null;
  avatar?: string | null;
  bio?: string | null;
  role?: UserRole;
  auth?: UserAuth | null;
  quizHistory?: QuizHistory[];
  createdQuizzes?: Quiz[];
  coins?: Coins | null;
  coinsHistory?: CoinsHistory[];
  createdAssessments?: Assessment[];
  assessmentAssignments?: AssessmentAssignment[];
  assessmentAttempts?: AssessmentAttempt[];
  auditLogsActed?: AuditLog[];
}