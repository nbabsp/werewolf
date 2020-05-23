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
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            startRole: this.startRole
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
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            players: this.players,
            center: this.center,
            status: this.status
        }
    }

    join(player) {
        if (this.players.find((current) => current.id == player.id)) {
            console.log('player already in game')
            return // accept the double-join
        }
        this.players.push(new GamePlayer(player))
    }

    getPlayer(playerId) {
        return this.players.find((player) => player.id == playerId)
    }

    start() {
        let count = this.players.length
        this.deal(decks[count])
        this.status = 'night'
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
        }
        this.center.left = deck[deck.length - 1]
        this.center.center = deck[deck.length - 2]
        this.center.right = deck[deck.length - 3]
    }

    end() {
        this.status = 'done'
    }
}

module.exports = Game
