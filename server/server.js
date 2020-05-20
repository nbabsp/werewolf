const http = require('http');
const express = require('express')
const path = require('path')
const crypto = require('crypto')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, './public')))

// allow CORS for development on different ports
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET')
    next()
})


let generateId = () => crypto.randomBytes(8).toString('hex')

class PlayerManager {
    constructor() {
        this._players = {}
    }

    register(name) {
        let id = generateId()
        this._players[id] = {
            id: id,
            name: name
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

let PM = new PlayerManager()

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

class GameMaster {
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

let GM = new GameMaster()

let _errorResponse = (res, msg) => res.writeHead(400, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
}).end(JSON.stringify({ err: msg }, null, 2))

let _jsonResponse = (res, obj) => res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
}).end(JSON.stringify(obj, null, 2))

///////////////////////////////////////////////////////// player registry
app.post('/players/register', function(req, res) {
    if (!req.body.name) return _errorResponse(res, 'missing name in register player')
    _jsonResponse(res, PM.register(req.body.name))
})

app.get('/players/:playerId', function(req, res) {
    _jsonResponse(res, PM.get(req.params.playerId))
})

app.get('/players/clear', function(req, res) {
    _jsonResponse(res, PM.clear())
})

///////////////////////////////////////////////////////// game master
app.post('/games/create', function(req, res) {
    if (!req.body.name) return _errorResponse(res, 'missing name in create game')
    _jsonResponse(res, GM.create(req.body.name))
})

app.get('/games/find', function(req, res) {
    _jsonResponse(res, GM.find())
})

app.post('/games/clear', function(req, res) {
    _jsonResponse(res, GM.clear())
})

///////////////////////////////////////////////////////// game
app.get('/games/:gameId', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    _jsonResponse(res, game.json)
})

app.get('/games/:gameId/players', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    _jsonResponse(res, game.players)
})

app.put('/games/:gameId/players/:playerId', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    let player = PM.get(req.params.playerId)
    if (!player) return _errorResponse(res, 'bad player')
    game.join(player)
    _jsonResponse(res, game.json)
})

app.get('/games/:gameId/players/:playerId', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    let player = game.getPlayer(req.params.playerId)
    if (!player) return _errorResponse(res, 'bad player')
    _jsonResponse(res, player.json)
})

app.get('/games/:gameId/center/left', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    _jsonResponse(res, { name: game.center.left })
})

app.get('/games/:gameId/center/center', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    _jsonResponse(res, { name: game.center.center })
})

app.get('/games/:gameId/center/right', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    _jsonResponse(res, { name: game.center.right })
})

app.post('/games/:gameId/start', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    game.start()
    _jsonResponse(res, { status: game.status })
})

app.post('/games/:gameId/end', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    game.end()
    _jsonResponse(res, { status: game.status })
})

app.get('/games/:gameId/status', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    _jsonResponse(res, game.json)
})

app.get('/games/:gameId/players/:id/startRole', function(req, res) {
    let game = GM.get(req.params.gameId)
    let id = req.params.id
    if (!game) return _errorResponse(res, 'bad game id')
    if (id == 'left' || id == 'center' || id == 'right') {
        _jsonResponse(res, game.center[id])
    }
    let player = game.getPlayer(id)
    if (!player) return _errorResponse(res, 'bad player')
    _jsonResponse(res, player.startRole)
})

///////////////////////////////////////////////////////// night actions
app.get('/games/:gameId/players/:playerId/werewolf', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    let player = game.getPlayer(req.params.playerId)
    if (!player) return _errorResponse(res, 'bad player')
    if (game.getPlayer(player.id).startRole != 'werewolf') return _errorResponse(res, 'not a werewolf')
    let werewolfPlayerIds = []
    game.players.forEach(player => {
        if (player.startRole == 'werewolf') werewolfPlayerIds.push(player.id)
    })
    _jsonResponse(res, werewolfPlayerIds)
})

app.get('/games/:gameId/players/:playerId/minion', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    let player = game.getPlayer(req.params.playerId)
    if (!player) return _errorResponse(res, 'bad player')
    if (game.getPlayer(player.id).startRole != 'minion') return _errorResponse(res, 'not a minion')
    let werewolfPlayerIds = []
    game.players.forEach(player => {
        if (player.startRole == 'werewolf') werewolfPlayerIds.push(player.id)
    })
    _jsonResponse(res, werewolfPlayerIds)
})

app.get('/games/:gameId/players/:playerId/mason', function(req, res) {
    let game = GM.get(req.params.gameId)
    if (!game) return _errorResponse(res, 'bad game id')
    let player = game.getPlayer(req.params.playerId)
    if (!player) return _errorResponse(res, 'bad player')
    if (game.getPlayer(player.id).startRole != 'mason') return _errorResponse(res, 'not a mason')
    let masonPlayerIds = []
    game.players.forEach(player => {
        if (player.startRole == 'mason') masonPlayerIds.push(player.id)
    })
    _jsonResponse(res, masonPlayerIds)
})
http.createServer(app).listen(9615);
