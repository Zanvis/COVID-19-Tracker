import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

export interface GlobalStats {
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  updated: number;
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

@Injectable({
  providedIn: 'root'
})
export class CovidDataService {
  private baseUrl = 'https://disease.sh/v3/covid-19';
  private globalStatsSubject = new BehaviorSubject<GlobalStats | null>(null);
  private countriesStatsSubject = new BehaviorSubject<CountryStats[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getGlobalStats().subscribe();
    this.getAllCountriesStats().subscribe();
  }

  getGlobalStats(): Observable<GlobalStats> {
    if (this.globalStatsSubject.value) {
      return this.globalStatsSubject.asObservable() as Observable<GlobalStats>;
    }

    return this.http.get<GlobalStats>(`${this.baseUrl}/all`).pipe(
      tap(stats => this.globalStatsSubject.next(stats))
    );
  }

  getAllCountriesStats(): Observable<CountryStats[]> {
    if (this.countriesStatsSubject.value.length > 0) {
      return this.countriesStatsSubject.asObservable();
    }

    return this.http.get<CountryStats[]>(`${this.baseUrl}/countries`).pipe(
      tap(countries => this.countriesStatsSubject.next(countries))
    );
  }

  getCountryStats(country: string): Observable<CountryStats | undefined> {
    return this.getAllCountriesStats().pipe(
      map(countries => countries.find(c => c.country.toLowerCase() === country.toLowerCase()))
    );
  }

  refreshData() {
    this.getGlobalStats().subscribe();
    this.getAllCountriesStats().subscribe();
  }
}

