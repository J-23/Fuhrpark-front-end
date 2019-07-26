export class EngineOil
{
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;

    constructor(engineOil?) {
        var engineOil = engineOil || {};

        this.id = engineOil.id || 0;
        this.name = engineOil.name || null;
        this.createDate = engineOil.createDate || new Date();
        this.updateDate = engineOil.updateDate || null;
    }
}