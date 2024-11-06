import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Quiz, QuizQuestion, QuizResult } from '../../models/quiz.models';
import { EducationalService } from '../../services/educational.service';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  quizzes: Quiz[] = [];
  currentQuiz: Quiz | null = null;
  currentQuestionIndex = 0;
  selectedAnswer: number | null = null;
  quizCompleted = false;
  correctAnswers = 0;

  constructor(private educationalService: EducationalService) {}

  ngOnInit() {
    this.quizzes = this.educationalService.getQuizzes();
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
  }

  selectAnswer(index: number) {
    this.selectedAnswer = index;
  }

  submitAnswer() {
    if (this.selectedAnswer === this.currentQuestion.correctAnswer) {
      this.correctAnswers++;
    }

    if (this.currentQuestionIndex === this.currentQuiz!.questions.length - 1) {
      this.completeQuiz();
    } else {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
    }
  }

  completeQuiz() {
    this.quizCompleted = true;
    const result: QuizResult = {
      quizId: this.currentQuiz!.id,
      score: this.correctAnswers,
      totalQuestions: this.currentQuiz!.questions.length,
      answers: [], // You can add detailed answer tracking here
      completedAt: new Date()
    };
    this.educationalService.submitQuizResult(result);
  }

  resetQuiz() {
    this.currentQuiz = null;
    this.currentQuestionIndex = 0;
    this.selectedAnswer = null;
    this.quizCompleted = false;
    this.correctAnswers = 0;
  }
}
