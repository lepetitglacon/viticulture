import {Player} from "../rooms/schema/Player";

export default class PlayerFactory {

    static createPlayer(options) {
        console.log(options)
        const player = new Player()
        player.name = options?.playerName ?? 'Unknown'
        return player
    }

}