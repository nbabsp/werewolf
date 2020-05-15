import Requestor from '../common/Requestor'

let host = 'localhost'
let port = 9615

let GameRequestor = {
    werewolfP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/werewolf`),
    minionP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/minion`),
    masonP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/mason`),
    seerP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/seer`),
    robberP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/robber`),
    troublemakerP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/troublemaker`),
    drunkP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/drunk`),
    insomniacP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/insomniac`)
}

let GameMasterRequestor = {
    statusP: (gameId) => Requestor.getP(host, port, `/games/${gameId}/status`),
    
    werewolfP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/werewolf`),
    minionP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/minion`),
}

class GameHandler {
    constructor(game) {
        this._game = game
        this._player = game.player
    }

    onClick(id) {
        if (id == 'left' || id == 'center' || id == 'right') {
            console.log('clicked center card', id)
            this._game.setRole(id, this._game.center[id])
            return
        }
        console.log('got a click', id)
        let player = this._game.players.find(player => player.id == id)
        this._game.setRole(player.id, player.startRole)
    }

    async timerP(duration) {
        let waitP = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000))
        this._game.time = duration
        while(duration >= 0) {
            await waitP(1)
            duration = duration - 1
            this._game.time = duration
        }
        this._game.time = null
    }

    async playP() {
        await this.timerP(5) // give players a chance to internalize their card
        console.log('night!')
        this._startNightP()
        await this.timerP(5) // give players a chance to perform their action
        console.log('day!')
        this._endNightP()
    }

    async _startNightP() {}
    async _endNightP() {}
}

class GameHandlerWerewolf extends GameHandler {
    constructor(game) {
        super(game)
        this._werewolfIds = []
        this._clicked = null
    }

    async _startNightP() {
        this._werewolfIds = await GameMasterRequestor.werewolfP(this._game.id, this._player.id)
        this._werewolfIds.forEach(playerId => this._game.setRole(playerId, 'werewolf'))
    }

    async _clickable(id) {
        this._werewolfIds = await GameMasterRequestor.werewolfP(this._game.id, this._player.id)
        let status = await GameMasterRequestor.statusP(this._game.id)
        console.log(this._werewolfIds.length == 2)
        console.log(status.status == 'night')
        console.log(this._clicked == null)
        console.log((id == 'left' || id == 'center' || id == 'right'))
        console.log(this._werewolfIds.length == 2 && status.status == 'night' && this._clicked == null && (id == 'left' || id == 'center' || id == 'right'))

        if (this._werewolfIds.length == 2 && status.status == 'night' && this._clicked == null && (id == 'left' || id == 'center' || id == 'right')) {
            return true
        }
        return false
    }
    
    async onClick(id) {
        if(await this._clickable(id)) {
            this._clicked = id
            this._clicked = this._game.setRole(id, this._game.center[id])
        }
    }


    async _endNightP() {
        this._werewolfIds.forEach(playerId => this._game.setRole(playerId, null))
        console.log('before')
        if(this._clicked != null) {
            console.log('after')
            this.game.setRole(this._clicked, null)
        }
    }
}

class GameHandlerMinion extends GameHandler {
    constructor(game) {
        super(game)
        this._werewolfIds = []
    }

    async _startNightP() {
        this._werewolfIds = await GameMasterRequestor.minionP(this._game.id, this._player.id)
        this._werewolfIds.forEach(playerId => this._game.setRole(playerId, 'werewolf'))
    }

    async _endNightP() {
        this._werewolfIds.forEach(playerId => this._game.setRole(playerId, null))
    }
}

class GameMaster {
    constructor (game, interaction) {
        this._game = game
        switch (this._game.player.startRole) {
            case 'werewolf':
                this._handler = new GameHandlerWerewolf(this._game)
                break
            default:
                this._handler = new GameHandler(this._game)
                break
        }
        interaction.observeClick(id => this._handler.onClick(id))
    }

    async playP() {
        return this._handler.playP()
    }
}

export default GameMaster
