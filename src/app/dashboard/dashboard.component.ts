import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CovidDataService, GlobalStats } from '../covid-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('map') mapElement!: ElementRef;
  @ViewChild('globalChart') chartElement!: ElementRef;
  
  globalStats: GlobalStats | null = null;
  private L: any;
  private Chart: any;
  private map: any;

  constructor(private covidDataService: CovidDataService) {}

  async ngOnInit() {
    if (typeof window !== 'undefined') {
      const [L, { Chart }] = await Promise.all([
        import('leaflet'),
        import('chart.js/auto')
      ]);
      
      this.L = L;
      this.Chart = Chart;
      
      this.covidDataService.getGlobalStats().subscribe((stats: any) => {
        this.globalStats = stats;
        this.createGlobalChart();
      });
      
      setTimeout(() => {
        this.initMap();
        this.loadCountriesData();
      }, 0);
    }
  }

  private initMap() {
    if (this.mapElement && this.L) {
      this.map = this.L.map(this.mapElement.nativeElement).setView([0, 0], 2);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

  private loadCountriesData() {
    this.covidDataService.getAllCountriesStats().subscribe((countries: any[]) => {
      countries.forEach(country => {
        this.L.circle([country.countryInfo.lat, country.countryInfo.long], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: Math.sqrt(country.cases) * 100
        }).bindPopup(`
          <b>${country.country}</b><br>
          Przypadki: ${country.cases}<br>
          Zgony: ${country.deaths}<br>
          Wyleczeni: ${country.recovered}
        `).addTo(this.map);
      });
    });
  }

  private createGlobalChart() {
    if (this.chartElement && this.Chart && this.globalStats) {
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
    }
  }
}