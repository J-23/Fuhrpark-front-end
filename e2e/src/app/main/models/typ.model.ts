export class Typ
{
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;

    constructor(typ?) {
        var typ = typ || {};

        this.id = typ.id || 0;
        this.name = typ.name || null;
        this.createDate = typ.createDate || new Date();
        this.updateDate = typ.updateDate || null;
    }
}