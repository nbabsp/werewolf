const Game = require('./Game')

class GameDatabase {
    constructor() {
        this._games = []
        this._handlers = {}
    }

    addListener(playerId, callback) {
        let game = this._games.find(game => game.status == 'creating')
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

    find() {
        let game = this._games.find(game => game.status == 'creating')
        return game ? game.json : { status: 'closed' }
    }

    create(name) {
        let game = new Game(name)
        this._games.push(game)

        // notify handlers that we have an available game
        Object.values(this._handlers).forEach(callback => callback(game))
        return game
    }

    clear() {
        this._games = []
    }
}

module.exports = GameDatabase
