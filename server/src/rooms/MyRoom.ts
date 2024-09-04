import { Room, Client } from "@colyseus/core";
import { State } from "./schema/states/State";
import PlayerFactory from "../factory/PlayerFactory";

export class MyRoom extends Room<State> {
  maxClients = 20;

  onCreate (options: any) {
    this.setState(new State());

    this.onMessage('*', (client, type,  data) => {
      this.state.onMessage(client, type, data)
    })

    let elapsedTime = 0;
    let fixedTimeStep = 1000 / 60;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= fixedTimeStep) {
        elapsedTime -= fixedTimeStep;
        this.fixedTick(fixedTimeStep);
      }
    });
  }

  fixedTick(deltaTime: number) {
    this.state.update(deltaTime)
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.createPlayer(client, options)
  }

  createPlayer(client: Client, options: any) {
    this.state.players.set(client.sessionId, PlayerFactory.createPlayer(options))
    this.state.onMessage(client, 'chat', {
      message: client.sessionId + " joined!"
    })
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.onMessage(client, 'chat', {
      message: client.sessionId + " left!"
    })
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
