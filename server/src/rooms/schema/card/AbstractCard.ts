import { Schema, Context, type } from "@colyseus/schema";

export abstract class AbstractCard extends Schema {
    @type("string") public name: string;
    @type("boolean") public description: boolean;
    public onUse: Function;

    constructor(config) {
        super();
        
    }
}