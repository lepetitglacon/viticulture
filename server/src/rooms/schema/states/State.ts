import { MapSchema, Schema, Context, type } from "@colyseus/schema";
import {Player} from "../Player";

export class State extends Schema {

  @type({ map: Player }) players = new MapSchema<Player>();

  @type("string") mySynchronizedProperty: string = "Hello world";
  @type("string") season: string = 'summer';

  constructor() {
    super();
  }

  isEveryoneReady() {
    let isEveryoneReady = true
    for (const [id, player] of this.players) {
      if (!player.ready) {isEveryoneReady = false}
    }
    return isEveryoneReady
  }
}
