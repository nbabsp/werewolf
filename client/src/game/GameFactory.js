import StaticRequestor from '../common/StaticRequestor'

let GameFactoryRequestor = {
    getP: (gameId) => StaticRequestor.getP(`/games/${gameId}`),
}

class Game {
    constructor(gameId, players, player, cards, center) {
        this.id = gameId
        this.players = players
        this.player = player
        this.cards = cards
        this.center = center
        this.gameTime = 0
        this._timeObservers = []
        this._timerStatusObservers = []
        this._roleObservers = {}
        this.players.forEach(player => this._roleObservers[player.id] = [])
        this._deathObservers = {}
        this.players.forEach(player => this._deathObservers[player.id] = [])
        this._voteObservers = {}
        this.players.forEach(player => this._voteObservers[player.id] = [])
        this._roleObservers.left = []
        this._roleObservers.center = []
        this._roleObservers.right = []
        this._roleObservers.lower = []
        this._descritionObservers = []
        this._endGameObservers = []
        this._swapObservers = []
        this._unswapObservers = []
    }

    set time(time) {
        this._timeObservers.forEach(callback => callback(time))
        this.gameTime = time
    }

    setTimerStatus(status) {
        this._timerStatusObservers.forEach(callback => callback(status))
    }

    setRole(id, role) {
        this._roleObservers[id].forEach(callback => callback(role))
    }

    setDescription(description) {
        this._descritionObservers.forEach(callback => callback(description))
    }

    setDeath(id, dead) {
        this._deathObservers[id].forEach(callback => callback(dead))
    }

    setVotes(id, votes) {
        this._voteObservers[id].forEach(callback => callback(votes))
    }

    setEndGame(endGame) {
        this._endGameObservers.forEach(callback => callback(endGame))
    }

    swapAnimate(ids) {
        this._swapObservers.forEach(callback => callback(ids))
    }

    swapDeanimate() {
        this._unswapObservers.forEach(callback => callback())
    }

    observeTimerStatus(callback) {
        this._timerStatusObservers.push(callback)
    }

    observeRole(id, callback) {
        this._roleObservers[id].push(callback)
    }

    observeDescription(callback) {
        this._descritionObservers.push(callback)
    }

    observeDeath(id, callback) {
        this._deathObservers[id].push(callback)
    }

    observeVotes(id, callback) {
        this._voteObservers[id].push(callback)
    }

    observeEndGame(callback) {
        this._endGameObservers.push(callback)
    }

    observeTime(callback) {
        this._timeObservers.push(callback)
    }

    observeSwapAnimate(callback) {
        this._swapObservers.push(callback)
    }

    observeSwapDeanimate(callback) {
        this._unswapObservers.push(callback)
    }
}

let GameFactory = {
    createP: async (gameId, playerId) => {
        let game = await GameFactoryRequestor.getP(gameId)
        let player = game.players.find(player => player.id == playerId)
        return new Game(gameId, game.players, player, game.cards, game.center)
    }
}

export default GameFactory
