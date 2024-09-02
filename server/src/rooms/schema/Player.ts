import { Schema, Context, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("string") public name: string;
    @type("boolean") public ready: boolean;
    @type("string") public color: string;


    @type("number") public golds: number;
    @type("number") public points: number;
    @type("number") public wakeUpIndex: number;
    @type("number") public royalties: number;

    @type("number") public workers: number;
    @type("number") public bigWorkers: number;
    public parents: null;
    public buildings: Set<any>;
    public fields: Set<any>;

    constructor() {
        super();

        this.name = 'unknown'
        this.ready = false

        this.points = 0
        this.golds = 0
        this.wakeUpIndex = 0
        this.royalties = 0

        this.parents = null
        this.fields = new Set()
        this.buildings = new Set()


    }
}