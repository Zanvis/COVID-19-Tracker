import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CountryStats, CovidDataService } from '../covid-data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-country-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './country-list.component.html',
  styleUrl: './country-list.component.css'
})
export class CountryListComponent implements OnInit {
  countries: CountryStats[] = [];
  filteredCountries: CountryStats[] = [];
  searchTerm: string = '';
  sortColumn: keyof CountryStats = 'cases';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  tableHeaders = [
    { key: 'country' as keyof CountryStats, label: 'Kraj' },
    { key: 'cases' as keyof CountryStats, label: 'Przypadki' },
    { key: 'deaths' as keyof CountryStats, label: 'Zgony' },
    { key: 'recovered' as keyof CountryStats, label: 'Wyleczeni' },
    { key: 'active' as keyof CountryStats, label: 'Aktywne' }
  ];

  constructor(private covidDataService: CovidDataService) {}

  ngOnInit() {
    this.covidDataService.getAllCountriesStats().subscribe((countries: CountryStats[]) => {
      this.countries = countries;
      this.filterCountries();
    });
  }

  filterCountries() {
    this.filteredCountries = this.countries.filter(country =>
      country.country.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortCountries();
  }

  sortBy(column: keyof CountryStats) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
    this.sortCountries();
  }

  private sortCountries() {
    this.filteredCountries.sort((a, b) => {
      const aValue = a[this.sortColumn];
      const bValue = b[this.sortColumn];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return this.sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }
}
