import { LocationService } from './../service/location-service';
import { Observable, observable, BehaviorSubject, of, fromEvent } from 'rxjs';
import { WeatherService } from './../service/weather-service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig, throwMatDialogContentAlreadyAttachedError } from "@angular/material/dialog";
import { MatCardModule } from '@angular/material/card';
import { WeatherToday } from '../model/weather-today';
import { WeatherForecast } from '../model/weather-forecast';
import { map, catchError, finalize, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { List } from '../model/list';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-weather-card-list',
  templateUrl: './weather-card-list.component.html',
  styleUrls: ['./weather-card-list.component.css']
})
export class WeatherCardListComponent implements OnInit {

    public forecast$: Observable<WeatherForecast>;
    public forecast: WeatherForecast;
    public list: List[];
    public loading: boolean = true;
    public data: any[] = [];
    public city: string;
    @ViewChild('input') input: ElementRef;

    constructor( 
      private weatherService: WeatherService,
      private locationService: LocationService,
      private route: ActivatedRoute, 
      private router: Router,
      private registry: SvgIconRegistry
      ) {
        registry.getAll();
      }

    ngOnInit() { 
      console.log("forecast ngOnInit called")
      this.fetchForecastByLocation();
    }

    ngAfterViewInit(): void {
  
      fromEvent(this.input.nativeElement,'keyup').pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
            console.log("search city: ", this.input.nativeElement.value)
            if (this.input.nativeElement.value != "") {
              this.fetchForecastByCity(this.input.nativeElement.value);
            } else {
              this.fetchForecastByLocation();
            }
          })
       ).subscribe();
  
    }

    fetchForecastByCity(city) {

      this.forecast$ = this.weatherService.getForecastByCity(city);

      this.forecast$.subscribe(i => {
        this.city = this.capitaliceFirstLetter(city); //after succesfull call update view
        this.forecast = i;
        this.list = i.list.slice(0,7);
        this.loading = false;
        this.list.forEach(k => {
          k.weather[0].icon = k.weather[0].icon.slice(0, -1);
        })
        
        this.updateChart();
      })
    }

    fetchForecastByLocation() {

      console.log("fetchForecastByLocation called ")

      let position$ = this.locationService.getCurrentPosition();

      position$.subscribe(position => {
        this.weatherService.getForecastByLocation(position.coords.longitude, position.coords.latitude).pipe(
          ).subscribe(i => {
            this.city = i.city.name;
            this.forecast = i;
            this.list = i.list.slice(0,7);
            this.loading = false;
            this.list.forEach(k => {
              k.weather[0].icon = k.weather[0].icon.slice(0, -1);
            })
            this.updateChart();
          })
        })
      }


    capitaliceFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    updateChart() {
      this.data = [];
      this.list.forEach(i => {
        let tmp: any[] = [];
        const unixTime = i.dt;
        const date = new Date(unixTime*1000);
        tmp.push(date); tmp.push(i.main.temp);
        this.data.push(tmp);
      })
    }

    type = 'LineChart';
    title= 'Forecast';

    columnNames = ["temp"];
    options = {   
      hAxis: { title: 'Date' },
      vAxis: { title: 'Temperature' },
    };
    width = 550;
    height = 400;

}
