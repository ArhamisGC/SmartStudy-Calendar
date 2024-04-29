import { Component } from '@angular/core';
import { LanguagesEnum, NgxWeatherOptionModel, TemperatureUnitsEnum, WidgetTypeEnum } from "ngx-weather";

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css'],

})
export class WeatherWidgetComponent {
  title = 'Tiempo en ...';
  activeLocation = 'Tafira Alta, Canarias';  // Default location
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
    }
  ];

  setActiveLocation(location: string) {
    this.activeLocation = location;
  }
}
