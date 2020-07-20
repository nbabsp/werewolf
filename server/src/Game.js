const GamePlayer = require('./GamePlayer')

const crypto = require('crypto')

let generateId = () => crypto.randomBytes(8).toString('hex')

let shuffle = inputArray => {
    let arr = inputArray.slice()
    let outputArray = []
    while(arr.length > 0) {
        outputArray.push(arr.splice(Math.floor(arr.length * Math.random()), 1)[0])
    }
    return outputArray
}

class Game {
    constructor(name, players) {
        this.id = generateId()
        this.name = name
        this.players = []
        this._handlers = {}
        this.status = 'creating'
        this.cards = []
        this.roles = {}
        this.center = {}
        this.robberSwapIds = []
        this.troublemakerSwapIds = []
        this.drunkSwapIds = []
        players.forEach(player => this.join(player))
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            players: this.players,
            cards: this.cards,
            center: this.center,
            status: this.status,
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
        console.log('game hand', this._handlers)
    }

    cleanup() {
        this.players.forEach( player => {
            if (this._handlers[player.id]) delete this._handlers[player.id]
        })
        console.log('game hand', this._handlers)
    }

    join(player) {
        this.players.push(new GamePlayer(player))
        Object.values(this._handlers).forEach(callback => callback(this))
    }

    getPlayer(playerId) {
        return this.players.find((player) => player.id == playerId)
    }

    start(deck) {
        console.log('starting:', deck)
        if (this.players.length < 3) throw 'Not enough players'
        if (deck.length != (this.players.length + 3)) throw 'Wrong number of cards'
        this.deal(deck)
        this.updateStatus('preparing')
    }

    deal(deck) {
        this.cards = deck
        let shuffledDeck = shuffle(deck)
        console.log('deck:', shuffledDeck)
        for(let len = this.players.length, i = 0; i < len; i++) {
            this.roles[this.players[i].id] = shuffledDeck[i]
            this.players[i].startRole = shuffledDeck[i]
            this.players[i].role = shuffledDeck[i]
            console.log(this.players[i].startRole)
        }
        this.center.left = shuffledDeck[shuffledDeck.length - 1]
        this.center.center = shuffledDeck[shuffledDeck.length - 2]
        this.center.right = shuffledDeck[shuffledDeck.length - 3]
    }

    updateStatus(status) {
        this.status = status
        Object.values(this._handlers).forEach(callback => callback(this))
    }

    daybreak() {
        if(this.robberSwapIds.length > 0) {
            let p1 = this.players.find(player => player.id == this.robberSwapIds[0])
            let p2 = this.players.find(player => player.id == this.robberSwapIds[1])
            let tempRole = p1.role
            p1.role = p2.role
            p2.role = tempRole
        }
        if(this.troublemakerSwapIds.length > 0) {
            let p1 = this.players.find(player => player.id == this.troublemakerSwapIds[0])
            let p2 = this.players.find(player => player.id == this.troublemakerSwapIds[1])
            let tempRole = p1.role
            p1.role = p2.role
            p2.role = tempRole
        }
        if(this.drunkSwapIds.length > 0) {
            let p1 = this.players.find(player => player.id == this.drunkSwapIds[0])
            let centerCardRole = this.center[this.drunkSwapIds[1]]
            let tempRole = p1.role
            p1.role = centerCardRole
            this.center[this.drunkSwapIds[1]] = tempRole
        }
        this.updateStatus('day')
    }

    robberNightAction(swapIds) {
        this.robberSwapIds = swapIds
    }
    
    troublemakerNightAction(swapIds) {
        this.troublemakerSwapIds = swapIds
    }
    
    drunkNightAction(swapIds) {
        this.drunkSwapIds = swapIds
    }

    nightAction(playerId) {
        let player = this.getPlayer(playerId)
        if (!player) return false
        player.nightActionComplete = true
        if (this.players.filter(player => player.nightActionComplete).length == this.players.length) {
            this.daybreak()
        }
        return true
    }

    prepare(playerId) {
        let player = this.getPlayer(playerId)
        if (!player) return false
        player.prepared = true
        if (this.players.filter(player => player.prepared).length == this.players.length) {
            this.updateStatus('night')
        }
        return true
    }

    voteAction(playerId, votedId) {
        let player = this.getPlayer(playerId)
        console.log('PLAYER', playerId)
        if (!player) return false
        let votedPlayer = this.getPlayer(votedId)
        console.log('VOTED', votedId)
        if (!votedPlayer) return false
        votedPlayer.votes.push(player.name)
        player.voted = true
        player.votedId = votedId
        return true
    }

    end() {
        this.status = 'done'
    }
}

module.exports = Game
