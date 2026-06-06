// Auto-generated from Prisma model: Assessment

import { AssessmentStatus } from './enums';

import { AssessmentAssignment } from './AssessmentAssignment';
import { AssessmentAttempt } from './AssessmentAttempt';
import { AssessmentQuestion } from './AssessmentQuestion';
import { Quiz } from './Quiz';
import { Topic } from './Topic';
import { UserProfile } from './UserProfile';

export interface Assessment {
  id: string;
  title: string;
  description: string | null;
  status: AssessmentStatus;
  deadline: Date | null;
  scheduledAt: Date | null;
  timeLimit: number | null;
  startDate: Date | null;
  endDate: Date | null;
  published: boolean;
  topicId: string | null;
  passingScore: number;
  maxAttempts: number;
  maxViolations: number;
  proctoredMode: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  allowReview: boolean;
  allowRetry: boolean;
  showResultImmediately: boolean;
  deletedAt: Date | null;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  topic: Topic | null;
  creator: UserProfile;
  assessmentQuestions: AssessmentQuestion[];
  assignments: AssessmentAssignment[];
  attempts: AssessmentAttempt[];
  quizzes: Quiz[];
}

export interface AssessmentCreateInput {
  title?: string;
  description?: string | null;
  status?: AssessmentStatus;
  deadline?: Date | null;
  scheduledAt?: Date | null;
  timeLimit?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  published?: boolean;
  passingScore?: number;
  maxAttempts?: number;
  maxViolations?: number;
  proctoredMode?: boolean;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowReview?: boolean;
  allowRetry?: boolean;
  showResultImmediately?: boolean;
  topic?: Topic | null;
  creator?: UserProfile;
  assessmentQuestions?: AssessmentQuestion[];
  assignments?: AssessmentAssignment[];
  attempts?: AssessmentAttempt[];
  quizzes?: Quiz[];
}