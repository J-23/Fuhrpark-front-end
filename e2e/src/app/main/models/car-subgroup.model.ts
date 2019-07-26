import { Car } from "./car.model";

export class CarSubgroup {
    id: number;
    name: string;
    cars: CarInfo[] = [];

    constructor(carSubgroup?) {
        var carSubgroup = carSubgroup || {};

        this.id = carSubgroup.id || 0;
        this.name = carSubgroup.name || null;

        if (carSubgroup.cars) {
            for (var i = 0; i < carSubgroup.cars.length; i++) {
                this.cars.push(new CarInfo(carSubgroup.cars[i]));
            }
        }
    }
}

export class CarInfo  {
    id: number;
    registrationNumber: string;
    model: string;
    typ: any;
    manufacturer: any;
    user: any;

    constructor(car?) {
        var car = car || {};

        this.id = car.id || 0;
        this.registrationNumber = car.registrationNumber || null;
        this.model = car.model || null;
        this.typ = car.typ || null;
        this.manufacturer = car.manufacturer || null;
        this.user = car.user || null;
    }
}