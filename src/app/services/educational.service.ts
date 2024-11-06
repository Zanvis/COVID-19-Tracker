import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Quiz, EducationalResource, QuizResult, UserProgress } from '../models/quiz.models';

@Injectable({
  providedIn: 'root'
})
export class EducationalService {
  private quizzes: Quiz[] = [
    {
      id: 1,
      title: 'Podstawy prewencji COVID-19',
      description: 'Test sprawdzający wiedzę o podstawowych zasadach zapobiegania COVID-19',
      difficulty: 'easy',
      category: 'prevention',
      timeLimit: 10,
      imageUrl: '/assets/images/covid-prevention.jpg',
      tags: ['covid', 'prevention', 'health'],
      questions: [
        {
          id: 1,
          question: 'Jaki jest rekomendowany minimalny dystans społeczny?',
          options: ['1 metr', '1.5 metra', '2 metry', '3 metry'],
          correctAnswer: 2,
          explanation: 'WHO zaleca utrzymywanie dystansu co najmniej 2 metrów od innych osób.',
          difficulty: 'easy',
          category: 'prevention',
          points: 10
        },
        {
          id: 2,
          question: 'Jak długo należy myć ręce, aby skutecznie zapobiec rozprzestrzenianiu wirusa?',
          options: ['5 sekund', '10 sekund', '20 sekund', '30 sekund'],
          correctAnswer: 2,
          explanation: 'WHO zaleca mycie rąk przez co najmniej 20 sekund wodą i mydłem.',
          difficulty: 'easy',
          category: 'prevention',
          points: 10
        },
        {
          id: 3,
          question: 'Które z poniższych jest najskuteczniejszą metodą dezynfekcji powierzchni?',
          options: ['Woda z mydłem', 'Alkohol minimum 60%', 'Olejki eteryczne', 'Mleko'],
          correctAnswer: 1,
          explanation: 'Do dezynfekcji powierzchni zalecany jest alkohol o stężeniu minimum 60%.',
          difficulty: 'easy',
          category: 'prevention',
          points: 10
        },
        {
          id: 4,
          question: 'Jak często powinno się wymieniać maseczkę jednorazową?',
          options: ['Raz na tydzień', 'Raz dziennie', 'Co 4 godziny', 'Co godzinę'],
          correctAnswer: 2,
          explanation: 'Maseczki jednorazowe powinny być wymieniane co 4 godziny lub po zamoczeniu.',
          difficulty: 'easy',
          category: 'prevention',
          points: 10
        },
        {
          id: 5,
          question: 'Które objawy najczęściej występują przy infekcji COVID-19?',
          options: ['Gorączka, kaszel, zmęczenie', 'Ból brzucha, wymioty, biegunka', 'Wysypka, świąd skóry', 'Zaburzenia widzenia'],
          correctAnswer: 0,
          explanation: 'Do najczęstszych objawów COVID-19 należą gorączka, kaszel i zmęczenie.',
          difficulty: 'easy',
          category: 'prevention',
          points: 10
        },
        {
          id: 6,
          question: 'Która z poniższych grup osób jest najbardziej narażona na ciężki przebieg COVID-19?',
          options: ['Dzieci', 'Młodzież', 'Osoby starsze i osoby z chorobami przewlekłymi', 'Osoby aktywne fizycznie'],
          correctAnswer: 2,
          explanation: 'Osoby starsze i z chorobami przewlekłymi są bardziej narażone na ciężki przebieg COVID-19.',
          difficulty: 'easy',
          category: 'prevention',
          points: 10
        }
      ]
    }    
  ];

  private userProgress = new BehaviorSubject<UserProgress>({
    userId: '1',
    completedQuizzes: 0,
    totalPoints: 0,
    streakDays: 0,
    lastCompletedDate: new Date(),
    badges: [],
    level: 1
  });

  private userResults = new BehaviorSubject<QuizResult[]>([]);


  private educationalResources: EducationalResource[] = [
    {
      id: 1,
      title: 'Skuteczność szczepień przeciwko COVID-19',
      description: 'Kompleksowe omówienie działania i skuteczności szczepionek',
      content: `# Szczepienia przeciwko COVID-19
      
      Szczepionki przeciwko COVID-19 są jednym z najskuteczniejszych narzędzi w walce z pandemią...`,
      category: 'vaccination',
      tags: ['szczepienia', 'profilaktyka', 'bezpieczeństwo']
    }
  ];

  // private userResults = new BehaviorSubject<QuizResult[]>([]);

  getQuizzes(): Quiz[] {
    return this.quizzes;
  }

  getQuizzesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Quiz[] {
    return this.quizzes.filter(quiz => quiz.difficulty === difficulty);
  }

  getEducationalResources(): EducationalResource[] {
    return this.educationalResources;
  }

  submitQuizResult(result: QuizResult): void {
    const currentResults = this.userResults.value;
    this.userResults.next([...currentResults, result]);
  }

  getUserResults(): Observable<QuizResult[]> {
    return this.userResults.asObservable();
  }
  getUserProgress(): Observable<UserProgress> {
    return this.userProgress.asObservable();
  }

  updateUserProgress(result: QuizResult): void {
    const currentProgress = this.userProgress.value;
    const points = result.score * 10;

    const newProgress: UserProgress = {
      ...currentProgress,
      completedQuizzes: currentProgress.completedQuizzes + 1,
      totalPoints: currentProgress.totalPoints + points,
      lastCompletedDate: new Date(),
      level: Math.floor(currentProgress.totalPoints / 100) + 1
    };

    // Update streak
    const lastDate = new Date(currentProgress.lastCompletedDate);
    const today = new Date();
    if (this.isConsecutiveDay(lastDate, today)) {
      newProgress.streakDays++;
    } else if (this.isDifferentDay(lastDate, today)) {
      newProgress.streakDays = 1;
    }

    // Check and award badges
    newProgress.badges = this.checkForNewBadges(newProgress);

    this.userProgress.next(newProgress);
  }

  private isConsecutiveDay(last: Date, current: Date): boolean {
    const diff = current.getTime() - last.getTime();
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    return daysDiff === 1;
  }

  private isDifferentDay(last: Date, current: Date): boolean {
    return last.getDate() !== current.getDate() ||
           last.getMonth() !== current.getMonth() ||
           last.getFullYear() !== current.getFullYear();
  }

  private checkForNewBadges(progress: UserProgress): string[] {
    const badges = [...progress.badges];
    
    // Check for streak badges
    if (progress.streakDays >= 7 && !badges.includes('week-streak')) {
      badges.push('week-streak');
    }
    
    // Check for quiz completion badges
    if (progress.completedQuizzes >= 10 && !badges.includes('quiz-master')) {
      badges.push('quiz-master');
    }
    
    // Check for points badges
    if (progress.totalPoints >= 1000 && !badges.includes('point-collector')) {
      badges.push('point-collector');
    }

    return badges;
  }

  getLeaderboard(): Observable<UserProgress[]> {
    // Simulate API call to get leaderboard data
    return of([this.userProgress.value]).pipe(
      map(users => users.sort((a, b) => b.totalPoints - a.totalPoints))
    );
  }

}