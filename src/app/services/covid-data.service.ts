import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, tap } from 'rxjs';

export interface GlobalStats {
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  updated: number;
  isRecoveredEstimated?: boolean;
  todayCases: number;
  todayDeaths: number;
  todayRecovered: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
}

export interface CountryInfo {
  _id: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}

export interface CountryStats extends GlobalStats {
  country: string;
  countryInfo: CountryInfo;
  continent: string;
  population: number;
}

export interface ContinentStats extends GlobalStats {
  continent: string;
  countries: string[];
}

export interface HistoricalData {
  cases: { [key: string]: number };
  deaths: { [key: string]: number };
  recovered: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  private baseUrl = 'https://disease.sh/v3/covid-19';
  private globalStatsSubject = new BehaviorSubject<GlobalStats | null>(null);
  private countriesStatsSubject = new BehaviorSubject<CountryStats[]>([]);
  private continentStatsSubject = new BehaviorSubject<ContinentStats[]>([]);
  private historicalDataSubject = new BehaviorSubject<HistoricalData | null>(null);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    forkJoin({
      global: this.fetchGlobalStats(),
      countries: this.fetchCountriesStats(),
      continents: this.fetchContinentStats(),
      historical: this.fetchHistoricalData()
    }).subscribe({
      next: (data) => {
        this.globalStatsSubject.next(data.global);
        this.countriesStatsSubject.next(data.countries);
        this.continentStatsSubject.next(data.continents);
        this.historicalDataSubject.next(data.historical);
      },
      error: (error) => console.error('Error loading initial data:', error)
    });
  }

  private fetchGlobalStats(): Observable<GlobalStats> {
    return this.http.get<GlobalStats>(`${this.baseUrl}/all`).pipe(
      map(stats => this.processStats(stats))
    );
  }

  private fetchCountriesStats(): Observable<CountryStats[]> {
    return this.http.get<CountryStats[]>(`${this.baseUrl}/countries`).pipe(
      map(countries => countries.map(country => this.processStats(country) as CountryStats))
    );
  }

  private fetchContinentStats(): Observable<ContinentStats[]> {
    return this.http.get<ContinentStats[]>(`${this.baseUrl}/continents`).pipe(
      map(continents => continents.map(continent => this.processStats(continent) as ContinentStats))
    );
  }

  private fetchHistoricalData(): Observable<HistoricalData> {
    return this.http.get<HistoricalData>(`${this.baseUrl}/historical/all?lastdays=30`);
  }

  private processStats<T extends GlobalStats>(stats: T): T {
    const isRecoveredEstimated = !stats.recovered;
    return {
      ...stats,
      recovered: stats.recovered || this.estimateRecovered(stats),
      active: stats.active || this.calculateActive(stats),
      isRecoveredEstimated
    };
  }

  private estimateRecovered(stats: GlobalStats): number {
    if (!stats.recovered) {
      const closedCases = stats.cases - (stats.active || 0);
      return Math.round(closedCases * 0.98);
    }
    return stats.recovered;
  }

  private calculateActive(stats: GlobalStats): number {
    if (!stats.active) {
      return stats.cases - (stats.deaths + this.estimateRecovered(stats));
    }
    return stats.active;
  }

  getGlobalStats(): Observable<GlobalStats> {
    return this.globalStatsSubject.asObservable() as Observable<GlobalStats>;
  }

  getAllCountriesStats(): Observable<CountryStats[]> {
    return this.countriesStatsSubject.asObservable();
  }

  getContinentStats(): Observable<ContinentStats[]> {
    return this.continentStatsSubject.asObservable();
  }

  getHistoricalData(): Observable<HistoricalData | null> {
    return this.historicalDataSubject.asObservable();
  }

  refreshData() {
    this.loadInitialData();
  }
}