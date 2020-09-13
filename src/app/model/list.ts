import { Main } from './main';
import { Weather } from './weather';
import { Clouds } from './clouds';
import { Wind } from './wind';

export interface List {
    dt: number;
    main: Main;
    weather: Weather;
    clouds: Clouds;
    wind: Wind;
    visibility: number;
    pop: number;
    sys: {
        pod: string
    };
    dt_txt: string;

}