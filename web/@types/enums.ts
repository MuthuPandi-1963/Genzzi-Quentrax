export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT',
}

export type UserRoleString = 'ADMIN' | 'STAFF' | 'STUDENT';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export type DifficultyString = 'easy' | 'medium' | 'hard';

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_FALSE = 'TRUE_FALSE',
  FILL_BLANK = 'FILL_BLANK',
  LONG_ANSWER = 'LONG_ANSWER',
  CODING = 'CODING',
}

export type QuestionTypeString = 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK';

export enum QuestionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type QuestionStatusString = 'active' | 'inactive';

export enum QuizStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type QuizStatusString = 'active' | 'inactive';

export enum AssessmentStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  INACTIVE = 'INACTIVE'
}

export type AssessmentStatusString = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export type AttemptStatusString = 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export enum AssignmentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  EXEMPTED = 'EXEMPTED',
}

export type AssignmentStatusString = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXEMPTED';

export enum AuditAction {
  USER_BLOCKED = 'USER_BLOCKED',
  USER_UNBLOCKED = 'USER_UNBLOCKED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_DELETED = 'USER_DELETED',
  ASSESSMENT_CREATED = 'ASSESSMENT_CREATED',
  ASSESSMENT_UPDATED = 'ASSESSMENT_UPDATED',
  ASSESSMENT_ASSIGNED = 'ASSESSMENT_ASSIGNED',
  ASSESSMENT_DELETED = 'ASSESSMENT_DELETED',
  QUESTION_CREATED = 'QUESTION_CREATED',
  QUESTION_DELETED = 'QUESTION_DELETED',
  QUIZ_CREATED = 'QUIZ_CREATED',
  QUIZ_DELETED = 'QUIZ_DELETED',
  COINS_ADJUSTED = 'COINS_ADJUSTED',
}

export type AuditActionString = 'USER_BLOCKED' | 'USER_UNBLOCKED' | 'USER_ROLE_CHANGED' | 'USER_DELETED' | 'ASSESSMENT_CREATED' | 'ASSESSMENT_UPDATED' | 'ASSESSMENT_ASSIGNED' | 'ASSESSMENT_DELETED' | 'QUESTION_CREATED' | 'QUESTION_DELETED' | 'QUIZ_CREATED' | 'QUIZ_DELETED' | 'COINS_ADJUSTED';
