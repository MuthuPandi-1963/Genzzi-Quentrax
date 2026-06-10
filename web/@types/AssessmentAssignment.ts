
import type { AssignmentStatus } from './enums';
import type { Assessment } from './Assessment';
import type { UserProfile } from './UserProfile';

export interface AssessmentAssignment {
  id: string;
  assessmentId: string; // FK → Assessment.id
  userId: string;       // FK → UserProfile.id
  status: AssignmentStatus;
  assignedAt: Date;
  dueDate: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;

  // ── Relations ─────────────────────────────────────────────────────────────
  assessment?: Assessment;
  user?: UserProfile;
}

export interface AssessmentAssignmentCreateInput {
  assessmentId: string;
  userId: string;
  status?: AssignmentStatus;
  dueDate?: Date | null;
}

export interface AssessmentAssignmentUpdateInput {
  status?: AssignmentStatus;
  dueDate?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
}