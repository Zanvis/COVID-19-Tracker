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
          correctAnswer: 3,
          explanation: 'WHO zaleca mycie rąk przez co najmniej 30 sekund wodą i mydłem.',
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
    },
    {
      id: 2,
      title: 'Podstawowa wiedza o COVID-19',
      description: 'Quiz sprawdzający wiedzę o wirusie COVID-19, jego objawach oraz środkach ostrożności.',
      difficulty: 'medium',
      category: 'general knowledge',
      timeLimit: 15,
      imageUrl: '/assets/images/covid-virus.jpg',
      tags: ['covid', 'virus', 'symptoms'],
      questions: [
        {
          id: 1,
          question: 'Jaki jest główny sposób przenoszenia się wirusa COVID-19?',
          options: ['Kontakt przez wodę', 'Przenoszenie drogą kropelkową', 'Przez kontakt ze skórą', 'Przez ukąszenie owadów'],
          correctAnswer: 1,
          explanation: 'COVID-19 przenosi się głównie drogą kropelkową, przez kichanie, kaszel i mówienie.',
          difficulty: 'medium',
          category: 'general knowledge',
          points: 15
        },
        {
          id: 2,
          question: 'Które z poniższych są typowymi objawami COVID-19?',
          options: ['Ból gardła, utrata smaku, gorączka', 'Ból stawów, ból brzucha, wysypka', 'Zaburzenia widzenia, omdlenia', 'Szybki przyrost masy ciała'],
          correctAnswer: 0,
          explanation: 'Główne objawy COVID-19 to gorączka, utrata smaku i węchu oraz ból gardła.',
          difficulty: 'medium',
          category: 'general knowledge',
          points: 15
        },
        {
          id: 3,
          question: 'Ile dni wynosi okres inkubacji wirusa COVID-19?',
          options: ['1-2 dni', '3-5 dni', '1-14 dni', '14-28 dni'],
          correctAnswer: 2,
          explanation: 'Okres inkubacji wirusa COVID-19 wynosi zwykle od 1 do 14 dni.',
          difficulty: 'medium',
          category: 'general knowledge',
          points: 15
        },
        {
          id: 4,
          question: 'Czy osoby bez objawów mogą przenosić COVID-19?',
          options: ['Tak', 'Nie', 'Tylko dzieci', 'Tylko osoby starsze'],
          correctAnswer: 0,
          explanation: 'Osoby bezobjawowe mogą przenosić wirusa na innych.',
          difficulty: 'medium',
          category: 'general knowledge',
          points: 15
        }
      ]
    },
    {
      id: 3,
      title: 'Ochrona osobista i higiena w czasie pandemii',
      description: 'Sprawdź swoją wiedzę na temat środków ochrony indywidualnej i zasad higieny.',
      difficulty: 'easy',
      category: 'personal protection',
      timeLimit: 10,
      imageUrl: '/assets/images/personal-protection.jpg',
      tags: ['hygiene', 'personal protection', 'covid'],
      questions: [
        {
          id: 1,
          question: 'Jaki jest najskuteczniejszy sposób zapobiegania infekcji wirusowej?',
          options: ['Mycie rąk', 'Mycie twarzy', 'Używanie kremów ochronnych', 'Unikanie spacerów'],
          correctAnswer: 0,
          explanation: 'Mycie rąk wodą i mydłem przez co najmniej 20 sekund jest kluczowe w zapobieganiu infekcji.',
          difficulty: 'easy',
          category: 'personal protection',
          points: 10
        },
        {
          id: 2,
          question: 'Która z maseczek zapewnia najlepszą ochronę przed wirusem?',
          options: ['Bawełniana', 'Jednorazowa chirurgiczna', 'Maseczka N95', 'Jedwabna'],
          correctAnswer: 2,
          explanation: 'Maseczka N95 filtruje większość cząsteczek, zapewniając lepszą ochronę.',
          difficulty: 'easy',
          category: 'personal protection',
          points: 10
        },
        {
          id: 3,
          question: 'Jak należy zdejmować maseczkę, aby nie zanieczyścić rąk?',
          options: ['Chwytać za przód maseczki', 'Chwytać za gumki lub troczki', 'Chwytać za krawędzie', 'Dotykać twarzy podczas zdejmowania'],
          correctAnswer: 1,
          explanation: 'Maseczkę należy zdejmować chwytając za gumki lub troczki, unikając dotykania przodu.',
          difficulty: 'easy',
          category: 'personal protection',
          points: 10
        }
      ]
    },
    {
      id: 4,
      title: 'Obalanie mitów o COVID-19',
      description: 'Quiz sprawdzający wiedzę o najpopularniejszych mitach i faktach dotyczących COVID-19.',
      difficulty: 'medium',
      category: 'myths and facts',
      timeLimit: 10,
      imageUrl: '/assets/images/covid-myths.jpg',
      tags: ['myths', 'covid', 'facts'],
      questions: [
        {
          id: 1,
          question: 'Czy picie gorącej wody eliminuje wirusa COVID-19?',
          options: ['Tak', 'Nie', 'Tylko rano', 'Zależy od osoby'],
          correctAnswer: 1,
          explanation: 'Nie ma dowodów na to, że picie gorącej wody eliminuje wirusa.',
          difficulty: 'medium',
          category: 'myths and facts',
          points: 15
        },
        {
          id: 2,
          question: 'Czy COVID-19 przenosi się przez ukąszenia komarów?',
          options: ['Tak', 'Nie', 'Tylko w ciepłych krajach', 'Tak, ale rzadko'],
          correctAnswer: 1,
          explanation: 'COVID-19 nie przenosi się przez komary, lecz drogą kropelkową.',
          difficulty: 'medium',
          category: 'myths and facts',
          points: 15
        },
        {
          id: 3,
          question: 'Czy stosowanie antybiotyków leczy COVID-19?',
          options: ['Tak', 'Nie', 'Tylko w ciężkich przypadkach', 'Tylko u dzieci'],
          correctAnswer: 1,
          explanation: 'Antybiotyki nie są skuteczne przeciwko wirusom, w tym COVID-19.',
          difficulty: 'medium',
          category: 'myths and facts',
          points: 15
        }
      ]
    },
    {
      id: 5,
      title: 'Świadomość społeczna i odpowiedzialność w czasach pandemii',
      description: 'Quiz sprawdzający wiedzę na temat odpowiedzialnych zachowań w czasie pandemii.',
      difficulty: 'medium',
      category: 'social responsibility',
      timeLimit: 10,
      imageUrl: '/assets/images/social-responsibility.jpg',
      tags: ['responsibility', 'covid', 'prevention'],
      questions: [
        {
          id: 1,
          question: 'Dlaczego ważne jest przestrzeganie zasad kwarantanny?',
          options: ['Aby uniknąć nudy', 'Aby chronić innych przed potencjalnym zakażeniem', 'Aby unikać mandatów', 'Aby zrobić przerwę od pracy'],
          correctAnswer: 1,
          explanation: 'Kwarantanna pomaga zapobiec rozprzestrzenianiu się wirusa na innych.',
          difficulty: 'medium',
          category: 'social responsibility',
          points: 15
        },
        {
          id: 2,
          question: 'Co należy zrobić, jeśli zauważymy u siebie objawy COVID-19?',
          options: ['Zignorować i iść do pracy', 'Skonsultować się z lekarzem i pozostać w domu', 'Podjąć więcej aktywności fizycznej', 'Pójść na zakupy spożywcze'],
          correctAnswer: 1,
          explanation: 'Jeśli zauważysz objawy, skontaktuj się z lekarzem i unikaj kontaktu z innymi.',
          difficulty: 'medium',
          category: 'social responsibility',
          points: 15
        },
        {
          id: 3,
          question: 'Dlaczego należy nosić maseczkę w miejscach publicznych?',
          options: ['Aby chronić innych i siebie', 'Aby wyglądać modnie', 'Aby unikać pyłków', 'Aby mieć swobodę oddychania'],
          correctAnswer: 0,
          explanation: 'Noszenie maseczki pomaga ograniczyć rozprzestrzenianie się wirusa na inne osoby.',
          difficulty: 'medium',
          category: 'social responsibility',
          points: 15
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