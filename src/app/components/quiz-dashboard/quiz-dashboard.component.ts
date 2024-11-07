import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Quiz, QuizResult, UserProgress } from '../../models/quiz.models';
import { EducationalService } from '../../services/educational.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-dashboard.component.html',
  styleUrl: './quiz-dashboard.component.css'
})
export class QuizDashboardComponent implements OnInit {
  userProgress: UserProgress;
  recentResults: QuizResult[] = [];
  leaderboard: UserProgress[] = [];
  availableQuizzes: Quiz[] = [];
  difficultyFilters = ['all', 'easy', 'medium', 'hard'];
  selectedDifficulty = 'all';

  constructor(
    private educationalService: EducationalService,
    private router: Router
  ) {
    this.userProgress = {
      userId: '1',
      completedQuizzes: 0,
      totalPoints: 0,
      streakDays: 0,
      lastCompletedDate: new Date(),
      badges: [],
      level: 1
    };
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Handle Observable subscriptions
    this.educationalService.getUserProgress().subscribe(
      progress => this.userProgress = progress
    );

    this.educationalService.getUserResults().subscribe(
      results => this.recentResults = results.slice(-5).reverse()
    );

    this.educationalService.getLeaderboard().subscribe(
      leaderboard => this.leaderboard = leaderboard
    );

    // Direct assignment for getQuizzes since it returns an array
    this.availableQuizzes = this.educationalService.getQuizzes();
  }

  getLevelProgress(): number {
    const pointsInLevel = this.userProgress.totalPoints % 100;
    return (pointsInLevel / 100) * 100;
  }

  getBadgeImage(badge: string): string {
    const badges: {[key: string]: string} = {
      'week-streak': '/assets/badges/streak.svg',
      'quiz-master': '/assets/badges/master.svg',
      'point-collector': '/assets/badges/points.svg'
    };
    return badges[badge] || '/assets/badges/default.svg';
  }

  getBadgeTitle(badge: string): string {
    const titles: {[key: string]: string} = {
      'week-streak': 'Tygodniowa seria',
      'quiz-master': 'Mistrz quizów',
      'point-collector': 'Kolekcjoner punktów'
    };
    return titles[badge] || badge;
  }

  getBadgeDescription(badge: string): string {
    const descriptions: {[key: string]: string} = {
      'week-streak': 'Ukończ quizy przez 7 dni z rzędu',
      'quiz-master': 'Ukończ 10 quizów',
      'point-collector': 'Zdobądź 1000 punktów'
    };
    return descriptions[badge] || '';
  }

  getQuizTitle(quizId: number): string {
    const quiz = this.availableQuizzes.find(q => q.id === quizId);
    return quiz?.title || 'Nieznany quiz';
  }

  getUserName(userId: string): string {
    return `User ${userId}`;
  }

  startQuiz(quizId: number) {
    this.router.navigate(['/quiz', quizId]);
  }

  filterQuizzes(difficulty: string) {
    this.selectedDifficulty = difficulty;
  }

  get filteredQuizzes(): Quiz[] {
    return this.selectedDifficulty === 'all'
      ? this.availableQuizzes
      : this.availableQuizzes.filter(quiz => quiz.difficulty === this.selectedDifficulty);
  }

  getDifficultyClass(difficulty: string): string {
    const classes = {
      'easy': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'hard': 'bg-red-100 text-red-800'
    };
    return classes[difficulty as keyof typeof classes] || '';
  }
}
