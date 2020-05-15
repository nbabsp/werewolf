import Requestor from '../common/Requestor'

let host = 'localhost'
let port = 9615

let GameFactoryRequestor = {
    getP: (gameId) => Requestor.getP(host, port, `/games/${gameId}`),
}

class Game {
    constructor(gameId, players, player, center) {
        this.id = gameId
        this.players = players
        this.player = player
        this.center = center
        this._timeObservers = []
        this._roleObservers = {}
        this.players.forEach(player => this._roleObservers[player.id] = [])
        this._roleObservers.left = []
        this._roleObservers.center = []
        this._roleObservers.right = []
    }

    set time(time) {
        this._timeObservers.forEach(callback => callback(time))
    }

    setRole(id, role) {
        this._roleObservers[id].forEach(callback => callback(role))
    }

    observeRole(id, callback) {
        this._roleObservers[id].push(callback)
    }

    observeTime(callback) {
        this._timeObservers.push(callback)
    }

    playersWithIds(ids) {
        return this.players.filter((player) => ids.find(id => player.id == id))
    }
}

let GameFactory = {
    createP: async (gameId, playerId) => {
        let game = await GameFactoryRequestor.getP(gameId)
        let player = game.players.find(player => player.id == playerId)
        return new Game(gameId, game.players, player, game.center)
    }
}

export default GameFactory
