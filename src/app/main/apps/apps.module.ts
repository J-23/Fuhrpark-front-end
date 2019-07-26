import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { CarsComponent } from './cars/cars.component';
import { EngineOilsComponent } from './engine-oils/engine-oils.component';
import { FuelsComponent } from './fuels/fuels.component';
import { GearOilsComponent } from './gear-oils/gear-oils.component';
import { ManufacturersComponent } from './manufacturers/manufacturers.component';
import { TypsComponent } from './typs/typs.component';
import { UsersComponent } from './users/users.component';
import { MatButtonModule, MatChipsModule, MatExpansionModule, MatFormFieldModule, 
    MatIconModule, MatInputModule, MatPaginatorModule, MatRippleModule, 
    MatSelectModule, MatSortModule, MatSnackBarModule, MatTableModule, MatTabsModule, 
    MatMenuModule, MatToolbarModule, MatDatepickerModule, MatRadioModule, MatStepperModule, 
    MatAutocompleteModule } from '@angular/material';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { CarsService } from './cars/cars.service';
import { FuseSidebarModule, FuseConfirmDialogModule } from '@fuse/components';
import { CarSidebarComponent } from './cars/car-sidebar/car-sidebar.component';
import { CarFormComponent } from './cars/car-form/car-form.component';
import { CarService } from './cars/car-form/car.service';
import { ManufacturersService } from './manufacturers/manufacturers.service';
import { TypsService } from './typs/typs.service';
import { FuelsService } from './fuels/fuels.service';
import { EngineOilsService } from './engine-oils/engine-oils.service';
import { GearOilsService } from './gear-oils/gear-oils.service';
import { UsersService } from './users/users.service';
import { MainFormComponent } from './main-form/main-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { CarGeneralComponent } from './cars/car-form/car-general/car-general.component';
import { CarSpecComponent } from './cars/car-form/car-spec/car-spec.component';
import { CarBusinessComponent } from './cars/car-form/car-business/car-business.component';
import { CarGroupsComponent } from './car-groups/car-groups.component';
import { CarSubgroupsComponent } from './car-subgroups/car-subgroups.component';
import { CarGroupsService } from './car-groups/car-groups.service';
import { CarSubgroupsService } from './car-subgroups/car-subgroups.service';
import { NewSubgroupComponent } from './car-subgroups/new-subgroup/new-subgroup.component';
import { NewGroupComponent } from './car-groups/new-group/new-group.component';
import { ConfirmFormComponent } from './confirm-form/confirm-form.component';
import { AuthorizedUserGuard } from '../guards/authorized-user.guard';
import { CarRemoveFormComponent } from './cars/car-remove-form/car-remove-form.component';
import { CarsModule } from './cars/cars.module';

const routes = [
    {
        path        : 'cars',
        loadChildren: './cars/cars.module#CarsModule',
        canActivate: [AuthorizedUserGuard]
    },
    {
        path: 'car-groups',
        redirectTo: 'apps/cars/list'
        /*component: CarGroupsComponent,
        resolve: {
            data: CarGroupsService, CarSubgroupsService
        },
        canActivate: [AuthorizedUserGuard]*/
    },
    {
        path: 'car-subgroups',
        redirectTo: 'apps/cars/list'
        /*component: CarSubgroupsComponent,
        resolve: {
            data: CarSubgroupsService, CarsService
        },
        canActivate: [AuthorizedUserGuard]*/
    },
    {
        path        : 'engine-oils',
        component: EngineOilsComponent,
        resolve  : {
            data: EngineOilsService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path        : 'fuels',
        component: FuelsComponent,
        resolve  : {
            data: FuelsService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path        : 'gear-oils',
        component: GearOilsComponent,
        resolve  : {
            data: GearOilsService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path        : 'manufacturers',
        component: ManufacturersComponent,
        resolve  : {
            data: ManufacturersService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path        : 'typs',
        component: TypsComponent,
        resolve  : {
            data: TypsService
        },
        canActivate: [AuthorizedUserGuard]
    },
    {
        path        : 'users',
        component: UsersComponent,
        resolve : {
            data: UsersService
        },
        canActivate: [AuthorizedUserGuard]
    }
];

@NgModule({
    imports     : [
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

        TranslateModule,


        CarsModule
    ],
    declarations: [
        CarGroupsComponent,
        CarSubgroupsComponent,
        NewGroupComponent,
        NewSubgroupComponent,
        EngineOilsComponent,
        FuelsComponent,
        GearOilsComponent,
        ManufacturersComponent,
        TypsComponent,
        UsersComponent,
        MainFormComponent,
        ConfirmFormComponent
    ],
    providers: [
        CarGroupsService,
        CarSubgroupsService,
        ManufacturersService,
        TypsService,
        FuelsService,
        EngineOilsService,
        GearOilsService,
        UsersService
    ],
    entryComponents: [
        MainFormComponent,
        ConfirmFormComponent
    ]
})
export class AppsModule
{
}
