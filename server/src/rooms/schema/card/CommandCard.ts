import { Schema, Context, type } from "@colyseus/schema";
import {AbstractCard} from "./AbstractCard";
import {Requirement} from "./Requirement";

export abstract class CommandCard extends AbstractCard {
    @type(Requirement) public requirements: Requirement;
    @type("number") public golds: number;

    constructor() {
        super();

    }
}