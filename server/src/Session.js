const GamePlayer = require('./GamePlayer')

class Session {
    constructor(id) {
        this.id = id
        this._handlers = []
        this.status = 'lobby'
        this.players = []
        this.gameId = null
    }

    get json() {
        return {
            id: this.id,
            handlers: this._handlers,
            status: this.status,
            players: this.players,
            gameId: this.gameId
        }
    }

    async addListener(playerId, callback) {
        callback(this)
        this._handlers[playerId] = callback
        let waitP = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000))
        while(this._handlers[playerId]) {
            await waitP(15)
            console.log('yeet')
            callback(this)
        }
    }

    removeListener(playerId) {
        delete this._handlers[playerId]
        console.log('session listeners', this._handlers)
    }

    join(player) {
        if (this.players.find((current) => current.id == player.id)) {
            console.log('player already in session')
            return
        }
        this.players.push(player)
        Object.values(this._handlers).forEach(callback => callback(this))
    }

    getPlayer(playerId) {
        return this.players.find((player) => player.id == playerId)
    }

    getPlayers() {
        return this.players
    }

    updateStatus(status) {
        this.status = status
        Object.values(this._handlers).forEach(callback => callback(this))
    }

    activate(playerId) {
        let player = this.getPlayer(playerId)
        if (!player) return false
        player.active = true
        Object.values(this._handlers).forEach(callback => callback(this))
        return true
    }

}

module.exports = Session
