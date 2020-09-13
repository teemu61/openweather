import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WeatherCardListComponent } from './weather-card-list/weather-card-list.component';
import { WeatherComponent } from './weather/weather.component';


const routes: Routes = [
  {
    path: 'forecast/:id',
    component: WeatherCardListComponent,
    data: { title: 'Weather forecast' }
  },
  {
    path: 'today/:id',
    component: WeatherComponent,
    data: { title: 'Weather today' }
  },
  {
    path: 'forecast',
    component: WeatherCardListComponent,
    data: { title: 'Weather forecast' }
  },
  {
    path: 'today',
    component: WeatherComponent,
    data: { title: 'Weather today' }
  },
  { path: '',
    redirectTo: '/today',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
