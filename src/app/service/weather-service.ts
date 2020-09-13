import { environment } from './../../environments/environment.prod';

import { LocationService } from './location-service';
import { WeatherToday } from './../model/weather-today';
import { Injectable, OnInit } from '@angular/core';
import { catchError, flatMap } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { WeatherForecast } from '../model/weather-forecast';
import { Location } from './../model/location';


const APP_ID = environment.API_KEY;
const BASE_URL = 'http://api.openweathermap.org/data/2.5';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  private extractData(res: Response): any {
    const body = res;
    return body || { };
  }

  getWeatherByCity(city: string): Observable<WeatherToday> {

    const url = `${BASE_URL}/weather?q=${city}&appid=${APP_ID}&units=metric`;
    console.log("getWeather called: ", url);
    return this.http.get(url).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getWeatherByLocation(lon: number, lat: number): Observable<WeatherToday> {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=metric`;
    console.log("getWeather called: ", url);
    return this.http.get(url).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getForecastByCity(city: string): Observable<WeatherForecast> {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${APP_ID}&units=metric`;
    console.log("getForecast called: ", url);
    let ret = this.http.get(url).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
    return ret;
  }

  getForecastByLocation(lon: number, lat: number): Observable<WeatherForecast> {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=metric`;
    console.log("getForecastByLocation called: ", url);
    let ret = this.http.get(url).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
    return ret;
  }

  private handleError(error: HttpErrorResponse): any {
    console.log("handleError called ", error)
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}