import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CountryListComponent } from './country-list/country-list.component';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { ComparisonComponent } from './comparison/comparison.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'countries', component: CountryListComponent },
    { path: 'country/:country', component: CountryDetailComponent },
    { path: 'comparison', component: ComparisonComponent },
    { path: '**', redirectTo: '' }
];
