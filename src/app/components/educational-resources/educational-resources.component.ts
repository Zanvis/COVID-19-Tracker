import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EducationalResource } from '../../models/quiz.models';
import { EducationalService } from '../../services/educational.service';

@Component({
  selector: 'app-educational-resources',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './educational-resources.component.html',
  styleUrl: './educational-resources.component.css'
})
export class EducationalResourcesComponent implements OnInit {
  resources: EducationalResource[] = [];
  categories = ['all', 'prevention', 'vaccination', 'general'];
  selectedCategory = 'all';
  selectedResource: EducationalResource | null = null;

  constructor(private educationalService: EducationalService) {}

  ngOnInit() {
    this.resources = this.educationalService.getEducationalResources();
  }

  get filteredResources(): EducationalResource[] {
    if (this.selectedCategory === 'all') {
      return this.resources;
    }
    return this.resources.filter(r => r.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      all: 'Wszystkie',
      prevention: 'Prewencja',
      vaccination: 'Szczepienia',
      general: 'Ogólne'
    };
    return labels[category] || category;
  }

  showResource(resource: EducationalResource) {
    this.selectedResource = resource;
  }
}

