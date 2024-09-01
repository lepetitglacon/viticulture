import { Schema, Context, type } from "@colyseus/schema";
import {AbstractCard} from "./AbstractCard";

export abstract class SummerWorkerCard extends AbstractCard {

    constructor(config) {
        super(config);

    }
}