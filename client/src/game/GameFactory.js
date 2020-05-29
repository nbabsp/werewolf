import StaticRequestor from '../common/StaticRequestor'

let GameFactoryRequestor = {
    getP: (gameId) => StaticRequestor.getP(`/games/${gameId}`),
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
        this._deathObservers = {}
        this.players.forEach(player => this._deathObservers[player.id] = [])
        this._voteObservers = {}
        this.players.forEach(player => this._voteObservers[player.id] = [])
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

    setDeath(id, dead) {
        this._deathObservers[id].forEach(callback => callback(dead))
    }

    setVotes(id, votes) {
        this._voteObservers[id].forEach(callback => callback(votes))
    }

    observeRole(id, callback) {
        this._roleObservers[id].push(callback)
    }

    observeDeath(id, callback) {
        this._deathObservers[id].push(callback)
    }

    observeVotes(id, callback) {
        this._voteObservers[id].push(callback)
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
