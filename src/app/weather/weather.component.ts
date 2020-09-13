import { catchError } from 'rxjs/internal/operators';
import { LocationService } from './../service/location-service';
import { Location } from './../model/location';
import { WeatherForecast } from './../model/weather-forecast';
import { WeatherToday } from './../model/weather-today';
import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { map, flatMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { fromEvent, merge, Observable } from 'rxjs';
import { Wind } from '../model/wind';
import { Weather } from '../model/weather';
import { WeatherService } from '../service/weather-service';


export interface Element{
  name: string;
  temp_max: number;
  temp_min: number;
  humidity: number;
  description: string;
  sunrise: string;
  sunset: number;
}


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, AfterViewInit {

  rowCount: number;
  public city: string;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ["key","value"];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    public weatherService: WeatherService, 
    private locationService: LocationService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.loadWeatherByLocation();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    fromEvent(this.input.nativeElement,'keyup')
    .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          console.log("search city: ", this.input.nativeElement.value)
          if (this.input.nativeElement.value != "") {
            this.loadWeatherByCity(this.input.nativeElement.value);
          } else {
            this.loadWeatherByLocation();
          }
        })
     ).subscribe();
  }

  loadWeatherByCity(id: string) {
    this.weatherService.getWeatherByCity(id).pipe(
      map(weather => this.weatherToSummary(weather))
      ).subscribe(i => {
        this.city = this.capitaliceFirstLetter(i.name);
        this.updateDataSource(i);
      }) 
    }

  loadWeatherByLocation() {
    console.log("loadWeatherByLocation called")
    let position$ = this.locationService.getCurrentPosition();
    position$.subscribe(position => {
      console.log(position);
      this.weatherService.getWeatherByLocation(position.coords.longitude, position.coords.latitude).pipe(
        map(weather => this.weatherToSummary(weather))
        ).subscribe(i =>  {
          this.city = i.name;
          console.log("weather is: ",i)
          this.updateDataSource(i);
        }) 
      });
    }  

  updateDataSource(e: Element) {
    let data = [];
    for (const property in e) {
      let key = `${property}`;
      let value = `${e[property]}`;
      let item = {key, value};
      data.push(item);
    }
    console.log("data is: ",data);
    console.log("this.dataSource.data: ",this.dataSource.data)
    console.log("this.dataSource: ", this.dataSource)
    this.dataSource.data = data;
    this.dataSource.sort = this.sort;
    this.rowCount = data.length;
  }

   weatherToSummary(weather: WeatherToday) {
     return {
       name: weather.name,
       temp_max: weather.main.temp_max,
       temp_min: weather.main.temp_min,
       humidity: weather.main.humidity,
       description: weather.weather[0].description,
       sunrise: this.unixToString(weather.sys.sunrise),
       sunset: this.unixToString(weather.sys.sunset)
     } as unknown as Element;
  }

  capitaliceFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  unixToString(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }

}




