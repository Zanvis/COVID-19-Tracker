import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EducationalResource } from '../../models/quiz.models';
import { EducationalService } from '../../services/educational.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-educational-resources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './educational-resources.component.html',
  styleUrl: './educational-resources.component.css'
})
export class EducationalResourcesComponent implements OnInit {
  resources: EducationalResource[] = [];
  categories = ['all', 'prevention', 'vaccination', 'general', 'research'];
  selectedCategory = 'all';
  selectedResource: EducationalResource | null = null;
  isGridView = true;
  searchQuery = '';
  private searchSubject = new Subject<string>();
  isLoading = false;
  favorites: Set<number> = new Set();
  showFavorites = false;
  private readonly STORAGE_KEY = 'educationalFavorites';
  private isBrowser: boolean;

  private educationalService = inject(EducationalService);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.resources = this.educationalService.getEducationalResources();
    this.setupSearch();
    this.loadFavorites();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.isLoading = true;
      setTimeout(() => {
        this.searchQuery = query;
        this.isLoading = false;
      }, 500);
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  get filteredResources(): EducationalResource[] {
    let filtered = this.resources;
    
    // First filter by favorites if favorites view is active
    if (this.showFavorites) {
      filtered = filtered.filter(r => this.favorites.has(r.id));
    }
    
    // Then apply category filter if not "all"
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === this.selectedCategory);
    }
    
    // Finally apply search filter
    if (this.searchQuery) {
      const search = this.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(search) ||
        r.description.toLowerCase().includes(search) ||
        r.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    return filtered;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      all: 'Wszystkie',
      prevention: 'Prewencja',
      vaccination: 'Szczepienia',
      general: 'Ogólne',
      research: 'Badania'
    };
    return labels[category] || category;
  }

  getCategoryCount(category: string): number {
    if (category === 'all') return this.resources.length;
    return this.resources.filter(r => r.category === category).length;
  }

  showResource(resource: EducationalResource) {
    this.selectedResource = resource;
  }

  toggleView() {
    this.isGridView = !this.isGridView;
  }

  closeModal(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('fixed')) {
      this.selectedResource = null;
    }
  }

  filterByTag(tag: string) {
    this.searchQuery = tag;
    this.searchSubject.next(tag);
  }

  toggleFavorite(resource: EducationalResource): void {
    if (this.favorites.has(resource.id)) {
      this.favorites.delete(resource.id);
    } else {
      this.favorites.add(resource.id);
    }
    this.saveFavorites();
  }
  toggleFavoritesView() {
    this.showFavorites = !this.showFavorites;
    // Reset category when toggling favorites
    this.selectedCategory = 'all';
  }

  get favoriteResourcesCount(): number {
    return this.favorites.size;
  }
  isFavorite(resource: EducationalResource): boolean {
    return this.favorites.has(resource.id);
  }

  private loadFavorites(): void {
    if (this.isBrowser) {
      try {
        const savedFavorites = localStorage.getItem(this.STORAGE_KEY);
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          if (Array.isArray(parsedFavorites)) {
            this.favorites = new Set(parsedFavorites);
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        // Initialize empty set if there's an error
        this.favorites = new Set();
      }
    }
  }

  private saveFavorites(): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(
          this.STORAGE_KEY, 
          JSON.stringify(Array.from(this.favorites))
        );
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }

  shareResource(resource: EducationalResource) {
    if (this.isBrowser && navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      }).catch(console.error);
    } else {
      console.log('Web Share API not supported');
      // You could implement a fallback sharing mechanism here
      // For example, showing a modal with share options
    }
  }

  downloadResource(resource: EducationalResource) {
    // Implement PDF download functionality
    console.log('Downloading resource:', resource.title);
  }
}

