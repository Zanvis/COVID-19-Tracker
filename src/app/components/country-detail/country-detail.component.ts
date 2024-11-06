import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { CountryStats, CovidDataService } from '../../services/covid-data.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.css'
})
export class CountryDetailComponent implements OnInit {
  @ViewChild('casesChart') casesChartElement!: ElementRef;
  @ViewChild('rateChart') rateChartElement!: ElementRef;
  countryData: CountryStats | undefined;
  loading = true;
  error: string | null = null;

  constructor(
    private covidDataService: CovidDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadCountryData(params['country']);
    });
  }

  private async loadCountryData(countryName: string) {
    try {
      this.loading = true;
      this.error = null;
      
      const allCountries = await firstValueFrom(this.covidDataService.getAllCountriesStats());
      const country = allCountries.find(c => 
        c.country.toLowerCase() === countryName.toLowerCase());
      
      if (!country) {
        this.error = `Nie znaleziono danych dla kraju: ${countryName}`;
        return;
      }

      this.countryData = country;
      setTimeout(() => {
        this.createCasesChart();
        this.createRateChart();
      }, 0);
    } catch (err) {
      this.error = 'Wystąpił błąd podczas ładowania danych';
      console.error('Error loading country data:', err);
    } finally {
      this.loading = false;
    }
  }

  private createCasesChart() {
    if (!this.casesChartElement || !this.countryData) return;

    const ctx = this.casesChartElement.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Łącznie', 'Aktywne', 'Wyleczeni', 'Zgony'],
        datasets: [{
          label: 'Statystyki COVID-19',
          data: [
            this.countryData.cases,
            this.countryData.active,
            this.countryData.recovered,
            this.countryData.deaths
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Całkowite statystyki'
          }
        }
      }
    });
  }

  private createRateChart() {
    if (!this.rateChartElement || !this.countryData) return;

    const ctx = this.rateChartElement.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Przypadki na milion', 'Zgony na milion'],
        datasets: [{
          data: [
            this.countryData.casesPerOneMillion,
            this.countryData.deathsPerOneMillion
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Statystyki na milion mieszkańców'
          }
        }
      }
    });
  }
}