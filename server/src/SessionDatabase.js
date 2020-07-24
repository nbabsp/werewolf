const crypto = require('crypto')
const Session = require('./Session')

let generateId = () => crypto.randomBytes(2).toString('hex')

class SessionDatabase {
    constructor() {
        this._sessions = {}
    }

    create() {
        if (Object.keys(this._sessions).length > 200) {
            return null // fail if we have too many
        }
        let id = generateId()
        while (this._sessions[id]) {
            id = generateId()
        }

        this._sessions[id] = new Session(id)

        return this._sessions[id]
    }

    get(id) {
        console.log('session:', this._sessions[id])
        return this._sessions[id]
    }

    clear() {
        this._sessions = {}
    }
}

module.exports = SessionDatabase
