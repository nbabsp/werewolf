const Game = require('./Game')

class GameDatabase {
    constructor() {
        this._games = []
        this._handlers = {}
    }

    addListener(gameName, playerId, callback) {
        let game = this._games.find(game => game.name == gameName && game.status == 'creating')
        if (game) {
            callback(game)
        }
        else {
            this._handlers[playerId] = callback
        }
    }

    removeListener(playerId) {
        delete this._handlers[playerId]
        console.log('hand', this._handlers)
    }

    get(id) {
        return this._games.find(game => game.id == id)
    }

    getByName(name) {
        return this._games.find(game => game.name == name)
    }

    create(name) {
        let game = new Game(name)
        this._games.push(game)
        console.log('After create:', this._games)

        // notify handlers that we have an available game
        Object.values(this._handlers).forEach(callback => callback(game))
        return game
    }

    clear(gameId) {
        this._games = this._games.filter(game => game.id != gameId)
        console.log('After clear:', this._games)
    }
}

module.exports = GameDatabase
