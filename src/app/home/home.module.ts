import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.accessToken, // Optional, can also be set per map (accessToken input of mgl-map)
    })
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
