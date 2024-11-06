import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnswerDetail, Quiz, QuizQuestion, QuizResult } from '../../models/quiz.models';
import { EducationalService } from '../../services/educational.service';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  currentQuiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  quizCompleted = false;
  correctAnswers = 0;
  timeLeft: number = 0;
  totalTimeSpent: number = 0;
  showFeedback: boolean = false;
  isCorrectAnswer: boolean = false;
  answerDetails: AnswerDetail[] = [];
  questionStartTime: number = 0;
  maxStreak: number = 0;
  currentStreak: number = 0;
  totalPoints: number = 0;
  averageTimePerQuestion: number = 0;
  private timerSubscription?: Subscription;
  
  constructor(
    private educationalService: EducationalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.quizzes = this.educationalService.getQuizzes();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  get currentQuestion(): QuizQuestion {
    return this.currentQuiz!.questions[this.currentQuestionIndex];
  }

  startQuiz(quiz: Quiz) {
    this.currentQuiz = quiz;
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.quizCompleted = false;
    this.correctAnswers = 0;
    this.answerDetails = [];
    this.totalTimeSpent = 0;
    this.maxStreak = 0;
    this.currentStreak = 0;
    this.totalPoints = 0;
    
    if (quiz.timeLimit) {
      this.timeLeft = quiz.timeLimit * 60;
      this.startTimer();
    }
    
    this.questionStartTime = Date.now();
  }

  private startTimer() {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.completeQuiz();
      }
    });
  }

  selectAnswer(index: number) {
    this.selectedAnswer = index;
  }

  submitAnswer() {
    const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000);
    const isCorrect = this.selectedAnswer === this.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      this.correctAnswers++;
      this.currentStreak++;
      this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
      this.totalPoints += this.currentQuestion.points;
    } else {
      this.currentStreak = 0;
    }

    this.answerDetails.push({
      questionId: this.currentQuestion.id,
      selectedAnswer: this.selectedAnswer!,
      isCorrect,
      timeSpent
    });

    this.showFeedback = true;
    this.isCorrectAnswer = isCorrect;

    setTimeout(() => {
      this.showFeedback = false;
      if (this.currentQuestionIndex === this.currentQuiz!.questions.length - 1) {
        this.completeQuiz();
      } else {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
        this.questionStartTime = Date.now();
      }
    }, 2000);
  }

  completeQuiz() {
    this.quizCompleted = true;
    this.timerSubscription?.unsubscribe();
    
    this.totalTimeSpent = this.answerDetails
      .reduce((total, answer) => total + answer.timeSpent, 0);
    
    this.averageTimePerQuestion = Math.round(this.totalTimeSpent / this.currentQuiz!.questions.length);

    const result: QuizResult = {
      quizId: this.currentQuiz!.id,
      score: this.correctAnswers,
      totalQuestions: this.currentQuiz!.questions.length,
      answers: this.answerDetails,
      completedAt: new Date(),
      timeSpent: this.totalTimeSpent,
      streakCount: this.maxStreak
    };

    this.educationalService.submitQuizResult(result);
    this.educationalService.updateUserProgress(result);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  shareResults() {
    const text = `Ukończyłem quiz "${this.currentQuiz!.title}" z wynikiem ${this.correctAnswers}/${this.currentQuiz!.questions.length} (${(this.correctAnswers / this.currentQuiz!.questions.length * 100).toFixed(1)}%)!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Wyniki quizu',
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text)
        .then(() => alert('Wyniki skopiowane do schowka!'))
        .catch(console.error);
    }
  }

  resetQuiz() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.quizCompleted = false;
    this.correctAnswers = 0;
  }
}
