export class Manufacturer
{
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;

    constructor(manufacturer?) {
        var manufacturer = manufacturer || {};

        this.id = manufacturer.id || 0;
        this.name = manufacturer.name || null;
        this.createDate = manufacturer.createDate || new Date();
        this.updateDate = manufacturer.updateDate || null;
    }
}