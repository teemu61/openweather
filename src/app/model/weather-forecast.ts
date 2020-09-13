import { City } from './city';
import { Main } from './main';
import { Wind } from './wind';
import { Clouds } from './clouds';
import { Sys } from './sys';
import { List } from './list';

export interface WeatherForecast {
    cod: string;
    message: number;
    cnt: number
    list: List[];
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    city: City
 
}