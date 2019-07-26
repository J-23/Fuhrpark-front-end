import { Fuel } from "./fuel.model";
import { EngineOil } from "./engine-oil.model";
import { GearOil } from "./gear-oil.model";
import { User } from "./user.model";
import { Typ } from "./typ.model";
import { Manufacturer } from "./manufacturer.model";

export class Car
{
    id: number;
    typ: Typ;
    manufacturer: Manufacturer;
    registrationNumber: string;
    model: string;
    color: string;
    chassisNumber: string;
    decommissioned: boolean;
    carSpec: CarSpec;
    carBusiness: CarBusiness;

    constructor(car?) {
        var car = car || {};

        this.id = car.id || 0;
        this.typ = new Typ(car.typ) || null;
        this.manufacturer = new Manufacturer(car.manufacturer) || null;
        this.registrationNumber = car.registrationNumber || new Date();
        this.model = car.model || null;
        this.color = car.color || null;
        this.chassisNumber = car.chassisNumber || null;
        this.decommissioned = car.decommissioned;
        this.carSpec = new CarSpec(car.carSpec);
        this.carBusiness = new CarBusiness(car.carBusiness);
    }
}

export class CarSpec {
    performance? : number;
    engineDisplacement?: number;
    maxSpeed?: number;
    totalWeight?: number;
    engineCode: string;
    productionDate?: Date;
    registrationDate?: Date;
    catalyst: boolean;
    hybridDrive: boolean;
    fuel: Fuel;
    engineOil: EngineOil;
    gearOil: GearOil;

    constructor(carSpec?) {
        var carSpec = carSpec || {};

        this.performance = carSpec.performance || null;
        this.engineDisplacement = carSpec.engineDisplacement || null;
        this.maxSpeed = carSpec.maxSpeed || null;
        this.totalWeight = carSpec.totalWeight || null;

        this.engineCode = carSpec.engineCode || null;
        this.productionDate = carSpec.productionDate || null;
        this.registrationDate = carSpec.registrationDate || null;

        this.catalyst = carSpec.catalyst;
        this.hybridDrive = carSpec.hybridDrive;

        this.fuel = new Fuel(carSpec.fuel) || null;
        this.engineOil = new EngineOil(carSpec.engineOil) || null;
        this.gearOil = new GearOil(carSpec.gearOil) || null;
    }
}

export class CarBusiness {
    location: string;
    createDate: Date;
    updateDate?: Date;
    user?: User;

    constructor(carBusiness?) {
        var carBusiness = carBusiness || {};

        this.location = carBusiness.location || null;
        this.createDate = carBusiness.createDate || new Date();
        this.updateDate = carBusiness.updateDate || null;
        this.user = new User(carBusiness.user) || null;
    }
}
