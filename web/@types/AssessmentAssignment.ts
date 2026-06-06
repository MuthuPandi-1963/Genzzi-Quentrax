// Auto-generated from Prisma model: AssessmentAssignment

import { AssignmentStatus } from './enums';

import { Assessment } from './Assessment';
import { UserProfile } from './UserProfile';

export interface AssessmentAssignment {
  id: string;
  assessmentId: string;
  userId: string;
  status: AssignmentStatus;
  assignedAt: Date;
  dueDate: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  assessment: Assessment;
  user: UserProfile;
}

export interface AssessmentAssignmentCreateInput {
  status?: AssignmentStatus;
  assignedAt?: Date;
  dueDate?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  assessment?: Assessment;
  user?: UserProfile;
}