import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartType } from 'chart.js/auto';
import { CountryStats, CovidDataService } from '../covid-data.service';
import { Subject, takeUntil } from 'rxjs';

type MetricKey = keyof CountryStats;

interface ComparisonMetric {
  label: string;
  value: MetricKey;
  perCapita?: MetricKey;
}

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparison.component.html',
  styleUrl: './comparison.component.css'
})
export class ComparisonComponent implements OnInit, OnDestroy {
  @ViewChild('comparisonChart') chartElement!: ElementRef;
  
  countries: CountryStats[] = [];
  selectedCountry1: string = '';
  selectedCountry2: string = '';
  selectedChartType: ChartType = 'bar';
  perCapita: boolean = false;
  
  private chart: Chart | null = null;
  private destroy$ = new Subject<void>();

  metrics: ComparisonMetric[] = [
    { label: 'Total Cases', value: 'cases', perCapita: 'casesPerOneMillion' },
    { label: 'Deaths', value: 'deaths', perCapita: 'deathsPerOneMillion' },
    { label: 'Recovered', value: 'recovered' },
    { label: 'Active', value: 'active' },
    { label: "Today's Cases", value: 'todayCases' },
    { label: "Today's Deaths", value: 'todayDeaths' }
  ];

  quickStats: { label: string; value: MetricKey }[] = [
    { label: 'Total Cases', value: 'cases' },
    { label: 'Active Cases', value: 'active' },
    { label: 'Deaths', value: 'deaths' },
    { label: 'Recovery Rate', value: 'recovered' }
  ];

  constructor(private covidDataService: CovidDataService) {}

  ngOnInit() {
    this.covidDataService.getAllCountriesStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(countries => {
        this.countries = countries.sort((a, b) => 
          a.country.localeCompare(b.country)
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  onSelectionChange() {
    if (this.selectedCountry1 && this.selectedCountry2) {
      this.updateChart();
    }
  }

  getCountryData(countryName: string): CountryStats | undefined {
    return this.countries.find(c => c.country === countryName);
  }

  getStatValue(country: CountryStats | undefined, metric: MetricKey): number | undefined {
    if (!country) return undefined;
    return country[metric] as number;
  }

  formatNumber(value: number | undefined): string {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat().format(value);
  }

  private getMetricValue(country: CountryStats, metric: ComparisonMetric): number {
    if (this.perCapita && metric.perCapita) {
      return country[metric.perCapita] as number;
    }
    return country[metric.value] as number;
  }

  private updateChart() {
    const country1Data = this.getCountryData(this.selectedCountry1);
    const country2Data = this.getCountryData(this.selectedCountry2);

    if (!country1Data || !country2Data || !this.chartElement) {
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartElement.nativeElement.getContext('2d');
    
    const chartData = this.metrics.map(metric => ({
      label: metric.label,
      country1Value: this.getMetricValue(country1Data, metric),
      country2Value: this.getMetricValue(country2Data, metric),
    }));

    this.chart = new Chart(ctx, {
      type: this.selectedChartType,
      data: {
        labels: chartData.map(d => d.label),
        datasets: [
          {
            label: country1Data.country,
            data: chartData.map(d => d.country1Value),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: this.selectedChartType === 'radar'
          },
          {
            label: country2Data.country,
            data: chartData.map(d => d.country2Value),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: this.selectedChartType === 'radar'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `COVID-19 Statistics Comparison ${this.perCapita ? '(Per Million)' : '(Total Numbers)'}`,
            font: {
              size: 16
            }
          },
          legend: {
            position: 'top'
          }
        },
        scales: this.selectedChartType !== 'radar' ? {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                if (typeof value === 'number') {
                  return new Intl.NumberFormat('en', {
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value);
                }
                return value;
              }
            }
          }
        } : undefined
      }
    });
  }
}