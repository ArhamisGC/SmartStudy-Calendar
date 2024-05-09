import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { LanguagesEnum, NgxWeatherOptionModel, TemperatureUnitsEnum, WidgetTypeEnum } from "ngx-weather";
import {User} from "../../interfaces/user.interface";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-weather-widget',
  templateUrl: './weather-widget.component.html',
  styleUrls: ['./weather-widget.component.css'],

})
export class WeatherWidgetComponent implements OnInit, OnDestroy{
  private subscription: Subscription | undefined;
  constructor(private userService: UserService) {
  }

  @Input() context: 'header' | 'dashboard' = 'dashboard';

  title = 'Tiempo en ...';
  activeLocation = 'Tafira Alta, Canarias';  // Default location
  userData: User | undefined;

  ngOnInit(): void {
    this.subscription = this.userService.getUserData().subscribe((user: User) => {
      this.userData = user;
      if (this.userData.universidad === 'ULPGC') {
        this.activeLocation = 'Tafira Alta, Canarias';
      }else{
        this.activeLocation = 'La Laguna, Canarias';
      }
    }, (error: any) => {
      console.error(error);
    });
  }



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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
