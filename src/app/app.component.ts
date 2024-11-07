import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { CountryDetailComponent } from './components/country-detail/country-detail.component';
import { ComparisonComponent } from './components/comparison/comparison.component';
import { FooterComponent } from './components/footer/footer.component';
import { EducationalResourcesComponent } from './components/educational-resources/educational-resources.component';
import { QuizComponent } from './components/quiz/quiz.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, DashboardComponent, CountryListComponent, CountryDetailComponent, ComparisonComponent, RouterLinkActive, RouterLink, FooterComponent, EducationalResourcesComponent, QuizComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'COVID19';
  isMobileMenuOpen = false;
  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isMobileMenuOpen) return;

    const mobileMenu = this.elementRef.nativeElement.querySelector('.mobile-menu');
    const hamburgerButton = this.elementRef.nativeElement.querySelector('[aria-expanded]');
    
    const clickedInMenu = mobileMenu?.contains(event.target as Node);
    const clickedHamburger = hamburgerButton?.contains(event.target as Node);

    if (!clickedInMenu && !clickedHamburger) {
      this.isMobileMenuOpen = false;
    }
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
