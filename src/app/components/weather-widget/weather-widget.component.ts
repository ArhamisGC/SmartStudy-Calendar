import { Component } from '@angular/core';
import {LanguagesEnum, NgxWeatherOptionModel, TemperatureUnitsEnum, WidgetTypeEnum} from "ngx-weather";

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrl: './weather-widget.component.css'
})
export class WeatherWidgetComponent {
  title = 'Tiempo en ..';
  protected readonly JSON = JSON;
  weatherOptions: NgxWeatherOptionModel[] = [
    {
      location: 'Tafira Alta, Canarias',
      type: WidgetTypeEnum.DAY,
      lang: LanguagesEnum.Spanish,
      temperatureUnits: TemperatureUnitsEnum.CELSIUS
    },
    {
      location: 'La Laguna, Canarias',
      type: WidgetTypeEnum.DAY,
      lang: LanguagesEnum.Spanish,
      temperatureUnits: TemperatureUnitsEnum.CELSIUS
    }];

}
