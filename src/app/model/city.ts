import { Location } from './location';
export interface City{
    id: string;
    name: string;
    coord: Location;
    country: string;
    timezone: number;
    sunrise: number;
    sunset: number;
}