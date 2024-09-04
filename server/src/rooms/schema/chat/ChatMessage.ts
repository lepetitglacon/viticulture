import { Schema, Context, type } from "@colyseus/schema";
import { Player } from "../Player";

export class ChatMessage extends Schema {
    @type("number") public timestamp: number;
    @type("string") public message: string;
    @type("boolean") public private: boolean;
    @type("boolean") public isError: boolean;
    @type("boolean") public debug: boolean;
    @type(Player) public player: Player;

    constructor(config) {
        super();
        this.player = config.player ?? {
            name: 'Server'
        } as Player
        this.timestamp = new Date().getTime()
        this.message = config.message ?? ''
        this.private = config.private ?? false
        this.isError = config.isError ?? false
        this.debug = config.debug ?? false
    }
}