// Auto-generated from Prisma model: User

import { Assessment } from './assessment.types';
import { AssessmentAssignment } from './AssessmentAssignment';
import { AssessmentAttempt } from './AssessmentAttempt';
import { Coins } from './Coins';
import { CoinsHistory } from './CoinsHistory';
import { Quiz } from './Quiz';
import { QuizHistory } from './QuizHistory';
import { UserProfile } from './UserProfile';

export interface User {
  id: string;
  username: string;
  profileId: string;
  profile: UserProfile;
  quizHistory: QuizHistory[];
  createdQuizzes: Quiz[];
  coins: Coins | null;
  coinsHistory: CoinsHistory[];
  createdAssessments: Assessment[];
  assessmentAssignments: AssessmentAssignment[];
  assessmentAttempts: AssessmentAttempt[];
}

export interface UserCreateInput {
  profile?: UserProfile;
  quizHistory?: QuizHistory[];
  createdQuizzes?: Quiz[];
  coins?: Coins | null;
  coinsHistory?: CoinsHistory[];
  createdAssessments?: Assessment[];
  assessmentAssignments?: AssessmentAssignment[];
  assessmentAttempts?: AssessmentAttempt[];
}