import Requestor from '../../common/Requestor'
let host = 'localhost'
let port = 9615

let GameMasterRequestor = {    
    werewolfP: (gameId, playerId) => Requestor.getP(host, port, `/games/${gameId}/players/${playerId}/werewolf`),
    roleP: (gameId, id) => Requestor.getP(host, port, `/games/${gameId}/players/${id}/startRole`),
}

class GameHandler {
    constructor(game) {
        this._game = game
        this._player = game.player
        this._status = 'unknown'
        this._voteId = null
    }

    _exposeStartRole(id) {
        if (id == 'left' || id == 'center' || id == 'right') {
            this._game.setRole(id, this._game.center[id])
        }
        else {
            let player = this._game.players.find(player => player.id == id)
            this._game.setRole(player.id, player.startRole)
        }
    }

    _hideRole(id) {
        this._game.setRole(id, null)
    }

    onClick(id) {
        switch (this._status) {
            case 'night':
                this._nightClick(id)
                break
            case 'day':
                this._dayClick(id)
                break
        }
    }

    _nightClick(id) {}
    _dayClick(id) {
        if (this._player.id == id) return
        let player = this._game.players.find(player => player.id == id)
        if (!player || id == this._voteId) return
        if (this._voteId) this._game.setRole(this._voteId, null)
        this._game.setRole(id, 'selected2')
        this._voteId = id
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
        await this.timerP(0) // give players a chance to internalize their card
        console.log('night!')
        this._status = 'night'
        this._startNightP()
        await this.timerP(20) // give players a chance to perform their action
        this._status = 'day'
        console.log('day!')
        
        let arr = this._game.players.filter(p => p.id != this._player.id)
        if (arr.length > 0) {
            let id = arr[Math.floor(Math.random() * arr.length)].id
            this._game.setRole(id, 'selected2')
            this._voteId = id
        }

        this._endNightP()
    }

    async _startNightP() {}
    async _endNightP() {}
}

export default GameHandler
