import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { ComparisonComponent } from './components/comparison/comparison.component';
import { EducationalResourcesComponent } from './components/educational-resources/educational-resources.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { QuizDashboardComponent } from './components/quiz-dashboard/quiz-dashboard.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'countries', component: CountryListComponent },
    { path: 'country/:country', component: CountryDetailComponent },
    { path: 'comparison', component: ComparisonComponent },
    { path: 'educational-resources', component: EducationalResourcesComponent },
    { path: 'quiz', component: QuizComponent },
    { path: 'quiz-dashboard', component: QuizDashboardComponent },
    { path: 'quiz/:id', component: QuizComponent },
    { path: '**', redirectTo: '' }
];
