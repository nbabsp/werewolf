import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {    
    voteP: (gameId, playerId, voteId) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/vote/${voteId}`),
    votedP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voted`),
    playersP: (gameId) => StaticRequestor.getP(`/games/${gameId}/players`),
    gameP: (gameId) => StaticRequestor.getP(`/games/${gameId}`),
    endNightActionP: (gameId, playerId) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/endNightAction`),
    statusSource: (gameId, playerId) => StaticRequestor.eventSource(`/games/${gameId}/status/${playerId}`),
}

let waitForStatusP = (gameId, playerId, status) => new Promise((resolve, reject) => {
    let source = GameMasterRequestor.statusSource(gameId, playerId)
    source.onmessage = (e) => {
        console.log('got message', JSON.parse(e.data))
        let game = JSON.parse(e.data)
        if (game.status == status) {
            source.close()
            resolve(game)
        }
    }
    source.onerror = (e) => {
        console.log('got an error', e)
        source.close()
    }
})

class GameHandler {
    constructor(game) {
        this._game = game
        this._player = game.player
        this._status = 'unknown'
        this._voteId = null
        this._midClick = false
    }

    _exposeRole(id) {
        if (id == 'left' || id == 'center' || id == 'right') {
            this._game.setRole(id, this._game.center[id])
        }
        else {
            let player = this._game.players.find(player => player.id == id)
            this._game.setRole(player.id, player.role)
            if (player.id == this._player.id) {
                this._game.setRole('lower', player.role)
            }
        }
    }

    _hideRole(id) {
        this._game.setRole(id, null)
        if (id == this._player.id) {
            this._game.setRole('lower', null)
        }
    }

    onClick(id) {
        switch (this._status) {
            case 'night':
                this._nightClick(id)
                break
            case 'day':
                this._dayClick(id)
                break
            default:
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
        let waitP = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000))
        await this.timerP(0) // give players a chance to internalize their card
        console.log('night!')
        this._status = 'night'
        this._startNightP()
        await this.timerP(10) // give players a chance to perform their action
        while(this._midClick) await waitP(1)
        await GameMasterRequestor.endNightActionP(this._game.id, this._player.id)
        this._status = 'night action over'
        await waitForStatusP(this._game.id, this._player.id, 'day')
        this._endNightP()
        console.log(this._game)
        this._status = 'day'
        console.log('day!')
        this._game.setDescription('discussion')
        // randomly select voted player
        let arr = this._game.players.filter(p => p.id != this._player.id)
        if (arr.length > 0) {
            let id = arr[Math.floor(Math.random() * arr.length)].id
            this._game.setRole(id, 'selected2')
            this._voteId = id
        }
        await this.timerP(5) // countdown for discussion
        await GameMasterRequestor.voteP(this._game.id, this._player.id, this._voteId)
        let game = await waitForStatusP(this._game.id, this._player.id, 'voted')
        this._status = 'voted'
        console.log('voted!')
        this._endGameP(game)
    }

    async _startNightP() {}
    async _endNightP() {}
    
    _endGameP(game) {
        let newPlayer
        this._game.players.forEach(player => {
            newPlayer = game.players.find(p => p.id == player.id)
            player.role = newPlayer.role
            player.votes = newPlayer.votes
            this._game.setRole(player.id, player.role)
            this._game.setVotes(player.id, player.votes)
        })

        this._game.center = game.center
        this._game.setRole('left', this._game.center['left'])
        this._game.setRole('center', this._game.center['center'])
        this._game.setRole('right', this._game.center['right'])
        this._game.setRole('lower', this._player.role)

        console.log(this._game)

        let killed = []

        this._game.players.forEach( player => {
            if (!killed[0]) {
                killed.push(player)
            } else if (player.votes.length > killed[0].votes.length) {
                killed = []
                killed.push(player)
            } else if (player.votes.length == killed[0].votes.length) {
                killed.push(player)
            }
        })

        if (killed[0].votes.length != 1) {
            killed.forEach(player => this._game.setDeath(player.id, true))
        }
    }
}

export default GameHandler
