const Game = require('./Game')

class GameDatabase {
    constructor() {
        this._games = []
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
        return game
    }

    clear() {
        this._games = []
    }
}

module.exports = GameDatabase
