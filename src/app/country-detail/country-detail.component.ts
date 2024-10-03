import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { CountryStats, CovidDataService } from '../covid-data.service';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.css'
})
export class CountryDetailComponent implements OnInit {
  @ViewChild('countryChart') chartElement!: ElementRef;
  countryData: CountryStats | undefined;
  private Chart: any;

  constructor(
    private covidDataService: CovidDataService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const { Chart } = await import('chart.js/auto');
      this.Chart = Chart;
    }

    this.route.params.subscribe(params => {
      this.loadCountryData(params['country']);
    });
  }

  private loadCountryData(country: string) {
    this.covidDataService.getCountryStats(country).subscribe((data: any) => {
      if (data) {
        this.countryData = data;
        setTimeout(() => this.createCountryChart(), 0);
      }
    });
  }

  private createCountryChart() {
    if (this.chartElement && this.Chart && this.countryData) {
      new this.Chart(this.chartElement.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Przypadki', 'Zgony', 'Wyleczeni', 'Aktywne'],
          datasets: [{
            label: 'Statystyki COVID-19',
            data: [
              this.countryData.cases,
              this.countryData.deaths,
              this.countryData.recovered,
              this.countryData.active
            ],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 206, 86, 0.2)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    }
  }
}
