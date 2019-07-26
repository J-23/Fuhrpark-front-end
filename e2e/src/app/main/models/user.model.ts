export class User {
    id: number;
    name: string;
    createDate: Date;
    updateDate?: Date;

    constructor(user?) {
        user = user || {};

        this.id = user.id || 0;
        this.name = user.name || null;
        this.createDate = user.createDate || Date.now();
        this.updateDate = user.updateDate || null;
    }
}