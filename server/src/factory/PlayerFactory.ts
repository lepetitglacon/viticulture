import {Player} from "../rooms/schema/Player";

export default class PlayerFactory {

    static createPlayer({options}) {
        const player = new Player(options)

        return player
    }

}