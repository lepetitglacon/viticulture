import { Room, Client } from "@colyseus/core";
import { State } from "./schema/states/State";
import PlayerFactory from "../factory/PlayerFactory";

export class MyRoom extends Room<State> {
  maxClients = 20;

  players = new Map()
  gameStartTimeout = null
  timeToStartGame = 3000

  onCreate (options: any) {
    this.setState(new State());

    this.onMessage("ready", (client, data = {}) => {

      const player = this.state.players.get(client.sessionId)
      player.ready = !player.ready


      if (player.ready) {
        console.log(client.sessionId, "is ready!");
        if (this.state.isEveryoneReady()) {
          console.log(`Everyone is ready ! Starting in ${(this.timeToStartGame / 1000)}s`);
          this.gameStartTimeout = setTimeout(() => {
            console.log("Game started");
          }, this.timeToStartGame)
        }
      } else {
        console.log(client.sessionId, "is not ready!");
        player.ready = false
        if (this.gameStartTimeout !== null) {
          console.log("reset game start timer");
          clearTimeout(this.gameStartTimeout);
        }
      }

    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.createPlayer(client, options)
  }

  createPlayer(client: Client, options: any) {
    this.state.players.set(client.sessionId, PlayerFactory.createPlayer({...options}))
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
