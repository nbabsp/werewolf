const crypto = require('crypto')

let generateId = () => crypto.randomBytes(8).toString('hex')

let decks = [
    null,
    null,
    null,
    ['werewolf', 'robber', 'seer', 'werewolf', 'troublemaker', 'villager'],
    ['werewolf', 'insomniac', 'seer', 'mason', 'villager', 'villager', 'villager'],
    ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager', 'villager', 'villager'],
    ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager', 'villager', 'mason', 'mason'],
    ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager', 'villager', 'villager', 'mason', 'mason'],
    ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager', 'villager', 'villager', 'mason', 'mason', 'minion'],
    ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager', 'villager', 'villager', 'mason', 'mason', 'minion', 'insomniac'],
    ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager', 'villager', 'villager', 'mason', 'mason', 'minion', 'insomniac', 'tanner'],
]

class GamePlayer {
    constructor(player) {
        this.id = player.id
        this.name = player.name
        this.startRole = null
        this.role = null
        this.votes = []
        this.nightActionComplete = false
        this.voted = false
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            startRole: this.startRole,
            role: this.role,
            votes: this.votes,
            nightActionComplete: this.nightActionComplete,
            voted: this.voted
        }
    }
}

class Game {
    constructor(name) {
        this.id = generateId()
        this.name = name
        this.players = []
        this.status = 'creating'
        this.cards = {}
        this.roles = {}
        this.center = {}
        this._handlers = {}
        this.robberSwapIds = []
        this.troublemakerSwapIds = []
        this.drunkSwapIds = []
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            players: this.players,
            center: this.center,
            status: this.status,
        }
    }

    addListener(playerId, callback) {
        callback(this)
        this._handlers[playerId] = callback
    }

    removeListener(playerId) {
        delete this._handlers[playerId]
        console.log('game hand', this._handlers)
    }

    join(player) {
        if (this.players.find((current) => current.id == player.id)) {
            console.log('player already in game')
            return // accept the double-join
        }
        this.players.push(new GamePlayer(player))

        // notify handlers that we have a new player
        Object.values(this._handlers).forEach(callback => callback(this))
    }

    getPlayer(playerId) {
        return this.players.find((player) => player.id == playerId)
    }

    start() {
        let count = this.players.length
        this.deal(decks[count])
        this.updateStatus('night')
    }

    deal(deck) {
        if (!deck) {
            console.log('bad number of players')
            return
        }
        for(let len = this.players.length, i = 0; i < len; i++) {
            this.cards[this.players[i].id] = deck[i]
            this.roles[this.players[i].id] = deck[i]
            this.players[i].startRole = deck[i]
            this.players[i].role = deck[i]
        }
        this.center.left = deck[deck.length - 1]
        this.center.center = deck[deck.length - 2]
        this.center.right = deck[deck.length - 3]
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

    vote() {
        this.updateStatus('voted')
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

    voteAction(playerId, votedId) {
        let player = this.getPlayer(playerId)
        console.log('PLAYER', playerId)
        if (!player) return false
        let votedPlayer = this.getPlayer(votedId)
        console.log('VOTED', votedId)
        if (!votedPlayer) return false
        votedPlayer.votes.push(player.name)
        player.voted = true
        if (this.players.filter(player => player.voted).length == this.players.length) {
            this.vote()
        }
        return true

    }

    end() {
        this.status = 'done'
    }
}

module.exports = Game
