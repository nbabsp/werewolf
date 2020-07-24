const crypto = require('crypto')

let generateId = () => crypto.randomBytes(8).toString('hex')

class PlayerDatabase {
    constructor() {
        this._players = {}
    }

    register(name) {
        let id = generateId()
        this._players[id] = {
            id: id,
            name: name,
            active: true
        }
        return this._players[id]
    }

    get(id) {
        return this._players[id]
    }

    clear() {
        this._players = {}
    }
}

module.exports = PlayerDatabase
