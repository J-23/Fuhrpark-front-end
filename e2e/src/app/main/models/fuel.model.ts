export class Fuel
{
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;

    constructor(fuel?) {
        var fuel = fuel || {};

        this.id = fuel.id || 0;
        this.name = fuel.name || null;
        this.createDate = fuel.createDate || new Date();
        this.updateDate = fuel.updateDate || null;
    }
}