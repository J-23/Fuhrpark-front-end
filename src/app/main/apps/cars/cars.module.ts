import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, 
    MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, 
    MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, 
    MatMenuModule, MatToolbarModule, MatDatepickerModule, MatRadioModule, MatStepperModule, 
    MatAutocompleteModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { FuseSidebarModule, FuseConfirmDialogModule } from '@fuse/components';
import { CarsComponent } from './cars.component';
import { CarsService } from './cars.service';
import { AuthorizedUserGuard } from 'app/main/guards/authorized-user.guard';
import { CarFormComponent } from './car-form/car-form.component';
import { CarService } from './car-form/car.service';
import { RouterModule } from '@angular/router';
import { CarRemoveFormComponent } from './car-remove-form/car-remove-form.component';
import { CarBusinessComponent } from './car-form/car-business/car-business.component';
import { CarSpecComponent } from './car-form/car-spec/car-spec.component';
import { CarGeneralComponent } from './car-form/car-general/car-general.component';
import { CarSidebarComponent } from './car-sidebar/car-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { NextFocusDirective } from 'app/main/directives/next-focus.directive';

const routes = [
  {
      path        : 'detail/:id',
      component: CarFormComponent,
      resolve: {
          data: CarService
      },
      canActivate: [AuthorizedUserGuard]
  },
  {
      path        : 'list',
      component: CarsComponent,
      resolve  : {
          data: CarsService
      },
      canActivate: [AuthorizedUserGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    
    FuseSharedModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    MatRadioModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatStepperModule,
    MatAutocompleteModule,

    NgxChartsModule,
    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
    }),

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseWidgetModule,
    FuseSidebarModule,

    TranslateModule
  ],
  declarations: [
    CarsComponent,
    CarSidebarComponent,
    CarFormComponent,
    CarGeneralComponent,
    CarSpecComponent,
    CarBusinessComponent,
    CarRemoveFormComponent,
    NextFocusDirective
  ],
  providers: [
    CarsService,
    CarService
  ],
  entryComponents: [
    CarRemoveFormComponent
  ]
})
export class CarsModule { }
