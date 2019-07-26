export class GearOil
{
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;

    constructor(gearOil?) {
        var gearOil = gearOil || {};

        this.id = gearOil.id || 0;
        this.name = gearOil.name || null;
        this.createDate = gearOil.createDate || new Date();
        this.updateDate = gearOil.updateDate || null;
    }
}