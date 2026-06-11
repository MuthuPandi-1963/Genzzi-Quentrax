import {
  AssessmentStatus,
  AssignmentStatus,
  AttemptStatus,
} from "@prisma/client";

export interface CreatorRelation {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
}

export interface TopicRelation {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
}

export interface AssessmentQuestionRelation {
  id: string;
  assessmentId: string;
  questionId: string;
  sortOrder: number;
  pointsOverride: number | null;
  question?: {
    id: string;
    questionText: string;
    questionType: string;
    difficulty: string;
    points: number;
  };
}

export interface AssignmentRelation {
  id: string;
  assessmentId: string;
  userId: string;
  status: AssignmentStatus;
  assignedAt: Date;
  dueDate: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

export interface AttemptRelation {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  status: AttemptStatus;
  startedAt: Date;
  completedAt: Date | null;
  violations: number;
}

export interface AssessmentResponse {
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
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: CreatorRelation;
  topic?: TopicRelation | null;
  assessmentQuestions?: AssessmentQuestionRelation[];
  assignments?: AssignmentRelation[];
  attempts?: AttemptRelation[];
  quizzes?: any[];
}

export interface AssessmentListResponse {
  assessments: AssessmentResponse[];
  count: number;
}
