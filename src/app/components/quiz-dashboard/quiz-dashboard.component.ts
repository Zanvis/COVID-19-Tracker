import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { QuizResult, UserProgress } from '../../models/quiz.models';
import { EducationalService } from '../../services/educational.service';

@Component({
  selector: 'app-quiz-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-dashboard.component.html',
  styleUrl: './quiz-dashboard.component.css'
})
export class QuizDashboardComponent implements OnInit {
  userProgress: UserProgress;
  quizCategories: any[] = [];
  recentResults: QuizResult[] = [];
  leaderboard: UserProgress[] = [];

  constructor(private educationalService: EducationalService) {
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
    this.educationalService.getUserProgress().subscribe(
      progress => this.userProgress = progress
    );

    this.educationalService.getUserResults().subscribe(
      results => this.recentResults = results.slice(-5).reverse()
    );

    this.educationalService.getLeaderboard().subscribe(
      leaderboard => this.leaderboard = leaderboard
    );

    // Initialize quiz categories (you would typically get this from a service)
    this.quizCategories = [
      {
        id: 'prevention',
        name: 'Prewencja',
        description: 'Quizy o zapobieganiu chorobom',
        quizCount: 5
      },
      {
        id: 'treatment',
        name: 'Leczenie',
        description: 'Quizy o metodach leczenia',
        quizCount: 3
      },
      // Add more categories...
    ];
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
    const quiz = this.educationalService.getQuizzes()
      .find(q => q.id === quizId);
    return quiz?.title || 'Nieznany quiz';
  }

  getUserName(userId: string): string {
    // In a real app, you would get this from a user service
    return `User ${userId}`;
  }

  navigateToCategory(categoryId: string): void {
    // Implement navigation to category
  }
}
