// Auto-generated from Prisma model: AssessmentAttempt

import { AttemptStatus } from './enums';

import { Assessment } from './Assessment';
import { UserProfile } from './UserProfile';

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  answers: any;
  status: AttemptStatus;
  startedAt: Date;
  completedAt: Date | null;
  violations: number;
  assessment: Assessment;
  user: UserProfile;
}

export interface AssessmentAttemptCreateInput {
  score?: number;
  answers?: any;
  status?: AttemptStatus;
  startedAt?: Date;
  completedAt?: Date | null;
  violations?: number;
  assessment?: Assessment;
  user?: UserProfile;
}