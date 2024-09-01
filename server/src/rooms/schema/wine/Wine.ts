import { Schema, Context, type } from "@colyseus/schema";

export class Wine extends Schema {
    @type("string") public type: string;
    @type("boolean") public isWine: boolean;
    @type("number") public value: boolean;

    constructor(config) {
        super();

    }
}