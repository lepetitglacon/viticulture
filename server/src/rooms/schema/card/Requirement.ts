import { Schema, Context, type } from "@colyseus/schema";
import {AbstractCard} from "./AbstractCard";

export abstract class Requirement extends Schema {
    @type("number") public red: number;
    @type("number") public white: number;
    @type("number") public rose: number;
    @type("number") public champagne: number;

    constructor() {
        super();

    }
}