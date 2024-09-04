import { MapSchema, SetSchema, Schema, type } from "@colyseus/schema";
import {Player} from "../Player";
import {Client} from "@colyseus/core";
import GameStartingState from "../../../enums/GameStartingState";
import {ChatMessage} from "../chat/ChatMessage";

export class State extends Schema {

  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ set: ChatMessage }) chatMessages = new SetSchema<ChatMessage>();

  @type("boolean") started: boolean = false;
  @type("string") season: string = 'summer';
  @type("string") startingState: string = 'parents';

  currentPlayerTurn: Player = null;

  gameStartTimeout = null
  @type("number") timeToStartGame = 3000

  constructor() {
    super();
    this.bind()
  }

  isEveryoneReady() {
    let isEveryoneReady = true
    for (const [id, player] of this.players) {
      if (!player.ready) {isEveryoneReady = false}
    }
    return isEveryoneReady
  }

  hasEveryonePlayedThisTurn() {
    let hasEveryonePlayedThisTurn = true
    for (const [id, player] of this.players) {
      if (!player.hasPlayedThisTurn) {hasEveryonePlayedThisTurn = false}
    }
    return hasEveryonePlayedThisTurn
  }

  onMessage(client: Client, type: string|number, data: any) {
    console.log('onMessage', client.sessionId, type, data)
    const player = this.players.get(client.sessionId)

    switch (type) {

      case 'chat': {
        this.chatMessages.add(new ChatMessage({
          player: player,
          message: data.message
        }))
        break
      }

      case 'ready': {
        player.ready = !player.ready
        if (player.ready) {
          console.log(client.sessionId, "is ready!");
          if (this.isEveryoneReady()) {
            console.log(`Everyone is ready ! Starting in ${(this.timeToStartGame / 1000)}s`);
            this.gameStartTimeout = setTimeout(() => {
              console.log("Game started");
              this.started = true
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
        break
      }

      case 'play': {
        if (player === this.currentPlayerTurn) {

        } else {
          client.send('error', 'Not your turn')
        }
        break
      }

      default: {
        console.log(client.sessionId, type, data);
      }
    }
  }

  bind() {

  }

  update(deltaTime) {
    if (this.started) {

      this.currentPlayerTurn = this.players.get('')

      switch (this.startingState) {
        case GameStartingState.SHUFFLECARDS: {
          // TODO Shuffle cards

          this.setStartingState(GameStartingState.PARENTS)
          break
        }
        case GameStartingState.PARENTS: {


          if (this.hasEveryonePlayedThisTurn()) {
            this.setStartingState(GameStartingState.VIGNARDS)
          }
          break
        }
        case GameStartingState.VIGNARDS: {

          break
        }
      }
    }
  }

  getNextPlayer() {

    let i = 0
    let chooseNext = false
    for (const [key, player] of this.players) {
      if (chooseNext) {
        this.currentPlayerTurn = player
      }
      if (this.currentPlayerTurn === null) {
        this.currentPlayerTurn = player
        return
      }
      if (player === this.currentPlayerTurn) {
        if (i === this.players.size) {
          chooseNext = true
        }
      }
      i++
    }
  }

  setStartingState(state: string) {
    this.startingState = state
  }
}
