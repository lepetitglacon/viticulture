import { Schema, Context, type } from "@colyseus/schema";
import {AbstractCard} from "./AbstractCard";

export abstract class VignardCard extends AbstractCard {
    @type("number") public type: number;
    @type("number") public value: number;

    constructor(config) {
        super(config);

    }
}