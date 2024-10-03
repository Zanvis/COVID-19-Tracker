import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { CountryStats, CovidDataService } from '../covid-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparison.component.html',
  styleUrl: './comparison.component.css'
})
export class ComparisonComponent implements OnInit {
  @ViewChild('comparisonChart') chartElement!: ElementRef;
  countries: CountryStats[] = [];
  selectedCountry1: string = '';
  selectedCountry2: string = '';
  private Chart: any;
  private currentChart: any;

  constructor(private covidDataService: CovidDataService) {}

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const { Chart } = await import('chart.js/auto');
      this.Chart = Chart;
    }
    
    this.covidDataService.getAllCountriesStats().subscribe((countries: CountryStats[]) => {
      this.countries = countries;
    });
  }

  onCountrySelect() {
    if (this.selectedCountry1 && this.selectedCountry2) {
      this.updateChart();
    }
  }

  private updateChart() {
    const country1Data = this.countries.find(c => c.country === this.selectedCountry1);
    const country2Data = this.countries.find(c => c.country === this.selectedCountry2);

    if (!country1Data || !country2Data || !this.chartElement || !this.Chart) {
      return;
    }

    // Zniszcz poprzedni wykres, jeśli istnieje
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    const ctx = this.chartElement.nativeElement.getContext('2d');
    this.currentChart = new this.Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Przypadki', 'Zgony', 'Wyleczeni', 'Aktywne'],
        datasets: [
          {
            label: country1Data.country,
            data: [
              country1Data.cases,
              country1Data.deaths,
              country1Data.recovered,
              country1Data.active
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: country2Data.country,
            data: [
              country2Data.cases,
              country2Data.deaths,
              country2Data.recovered,
              country2Data.active
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}


