import { CarSubgroup } from "./car-subgroup.model";

export class CarGroup {
    id: number;
    name: string;
    carSubgroups: CarSubgroup[] = [];

    constructor(carGroup) {
        var carGroup = carGroup || {};

        this.id = carGroup.id || 0;
        this.name = carGroup.name || null;

        if (carGroup.carSubgroups) {
            for (var i = 0; i < carGroup.carSubgroups.length; i++) {
                this.carSubgroups.push(new CarSubgroup(carGroup.carSubgroups[i]));
            }
        }
    }
}