/** Shared client-side types mirroring the API response shapes. */
export type Role = 'GURU' | 'SISWA';
export type QuestionType = 'PG' | 'ESSAY';

export type Announcement = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
};

export type ModuleItem = {
  id: string;
  title: string;
  content: string;
  order: number;
};

export type QuizListItem = {
  id: string;
  title: string;
  description?: string | null;
  _count: { questions: number };
};

export type Choice = { id: string; label: string; text: string; isCorrect?: boolean };

export type Question = {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  order: number;
  choices: Choice[];
};

export type Quiz = {
  id: string;
  title: string;
  description?: string | null;
  questions: Question[];
};

export type AssignmentItem = {
  id: string;
  title: string;
  instructions: string;
  allowedTypes: string;
  maxSizeMb: number;
  deadline?: string | null;
  _count?: { submissions: number };
};

export type SubmissionMeta = {
  id: string;
  assignmentId: string;
  studentId: string;
  fileName: string;
  fileMime: string;
  fileSize: number;
  grade?: number | null;
  feedback?: string | null;
  submittedAt: string;
  student?: { id: string; name: string; email: string };
};

export type AttemptAnswer = {
  id: string;
  questionId: string;
  choiceId?: string | null;
  essayText?: string | null;
  isCorrect?: boolean | null;
  awardedPoints: number;
  graded: boolean;
  question: { id: string; type: QuestionType; text: string; points: number };
  choice?: { id: string; label: string; text: string } | null;
};

export type Attempt = {
  id: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  answers: AttemptAnswer[];
  student?: { id: string; name: string; email: string };
};

export type CourseListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  createdAt: string;
  teacher: { id: string; name: string };
  _count: { modules: number; quizzes: number; assignments: number };
};

export type CourseDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  capaian?: string | null;
  penilaian?: string | null;
  published: boolean;
  teacher: { id: string; name: string };
  modules: ModuleItem[];
  announcements: Announcement[];
  quizzes: QuizListItem[];
  assignments: AssignmentItem[];
};
