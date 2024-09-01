import { Schema, Context, type } from "@colyseus/schema";
import {AbstractCard} from "./AbstractCard";

export class Deck extends Schema {
    @type("string") public name: string;
    @type("number") public maxSize: number;
    @type({set: AbstractCard}) public cards: Set<AbstractCard>;

    constructor(config) {
        super();
        
    }
}