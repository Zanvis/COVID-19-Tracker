export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: 'prevention' | 'vaccination' | 'general';
}

export interface Quiz {
    id: number;
    title: string;
    description: string;
    questions: QuizQuestion[];
    difficulty: 'easy' | 'medium' | 'hard';
    category: 'prevention' | 'vaccination' | 'general';
}

export interface EducationalResource {
    id: number;
    title: string;
    description: string;
    content: string;
    category: 'prevention' | 'vaccination' | 'general';
    tags: string[];
}

export interface QuizResult {
    quizId: number;
    score: number;
    totalQuestions: number;
    answers: { questionId: number; wasCorrect: boolean }[];
    completedAt: Date;
}

