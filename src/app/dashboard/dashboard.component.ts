import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CovidDataService, GlobalStats } from '../covid-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('map') mapElement!: ElementRef;
  @ViewChild('globalChart') chartElement!: ElementRef;
  
  globalStats: GlobalStats | null = null;
  private map: any;
  private L: any;
  private Chart: any;
  isBrowser: boolean;

  constructor(
    private covidDataService: CovidDataService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.covidDataService.getGlobalStats().subscribe((stats: any) => {
      this.globalStats = stats;
      if (this.isBrowser && this.Chart) {
        this.createGlobalChart();
      }
    });
  }

  async ngAfterViewInit() {
    if (!this.isBrowser) return;

    try {
      // Dynamically import Leaflet and Chart.js only in browser environment
      const leafletModule = await import('leaflet');
      const chartModule = await import('chart.js/auto');
      
      this.L = leafletModule.default;
      this.Chart = chartModule.Chart;
      
      this.initMap();
      this.loadCountriesData();
      
      if (this.globalStats) {
        this.createGlobalChart();
      }
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  }

  private initMap() {
    if (!this.isBrowser || !this.mapElement?.nativeElement || !this.L) return;

    try {
      this.map = this.L.map(this.mapElement.nativeElement).setView([0, 0], 2);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  private loadCountriesData() {
    if (!this.isBrowser || !this.map || !this.L) return;

    this.covidDataService.getAllCountriesStats().subscribe((countries: any[]) => {
      countries.forEach(country => {
        if (country.countryInfo.lat && country.countryInfo.long) {
          this.L.circle([country.countryInfo.lat, country.countryInfo.long], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: Math.sqrt(country.cases) * 100
          }).bindPopup(`
            <strong>${country.country}</strong><br>
            Przypadki: ${country.cases}<br>
            Zgony: ${country.deaths}<br>
            Wyleczeni: ${country.recovered}
          `).addTo(this.map);
        }
      });
    });
  }

  private createGlobalChart() {
    if (!this.isBrowser || !this.chartElement?.nativeElement || !this.Chart || !this.globalStats) return;

    try {
      new this.Chart(this.chartElement.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Aktywne', 'Wyleczeni', 'Zgony'],
          datasets: [{
            data: [
              this.globalStats.active,
              this.globalStats.recovered,
              this.globalStats.deaths
            ],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }
}