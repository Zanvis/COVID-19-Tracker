import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Quiz, EducationalResource, QuizResult } from '../models/quiz.models';

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
      questions: [
        {
          id: 1,
          question: 'Jaki jest rekomendowany minimalny dystans społeczny?',
          options: ['1 metr', '1.5 metra', '2 metry', '3 metry'],
          correctAnswer: 2,
          explanation: 'WHO zaleca utrzymywanie dystansu co najmniej 2 metrów od innych osób.',
          difficulty: 'easy',
          category: 'prevention'
        },
        // Add more questions here
      ]
    }
  ];

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

  private userResults = new BehaviorSubject<QuizResult[]>([]);

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
}