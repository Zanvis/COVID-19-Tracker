export interface Quiz {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit?: number; // Time limit in minutes
  questions: QuizQuestion[];
  imageUrl?: string;
  prerequisites?: string[];
  tags: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  imageUrl?: string;
  points: number;
}

export interface QuizResult {
  id?: number;
  quizId: number;
  userId?: string;
  score: number;
  totalQuestions: number;
  answers: AnswerDetail[];
  completedAt: Date;
  timeSpent: number; // in seconds
  streakCount: number;
}

export interface AnswerDetail {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface EducationalResource {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  attachments?: string[];
}

export interface UserProgress {
  userId: string;
  completedQuizzes: number;
  totalPoints: number;
  streakDays: number;
  lastCompletedDate: Date;
  badges: string[];
  level: number;
}