// Auto-generated from Prisma model: AssessmentAttempt

import { Assessment } from './assessment.types';
import { AttemptStatus } from './enums';

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