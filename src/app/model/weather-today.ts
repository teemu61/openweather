import { Sys } from './sys';
import { Main } from './main';
import { Weather } from './weather';
import { Wind } from './wind';
import { Clouds } from './clouds';

export interface WeatherToday {
    coordi: Coordinates;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
    description: string;
}
