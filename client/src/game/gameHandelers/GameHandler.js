import StaticRequestor from '../../common/StaticRequestor'

let GameMasterRequestor = {    
    voteP: (gameId, playerId, voteId) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/vote/${voteId}/`),
    votedP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voted/`),
    playersP: (gameId) => StaticRequestor.getP(`/games/${gameId}/players/`),
    gameP: (gameId) => StaticRequestor.getP(`/games/${gameId}/`),
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
        await this.timerP(0) // give players a chance to internalize their card
        console.log('night!')
        this._status = 'night'
        this._startNightP()
        await this.timerP(0) // give players a chance to perform their action
        this._status = 'day'
        console.log('day!')
        this._endNightP()

        let arr = this._game.players.filter(p => p.id != this._player.id)
        if (arr.length > 0) {
            let id = arr[Math.floor(Math.random() * arr.length)].id
            this._game.setRole(id, 'selected2')
            this._voteId = id
        }

        await this.timerP(5) // countdown to vote
        this._status = 'ending'
        await GameMasterRequestor.voteP(this._game.id, this._player.id, this._voteId)

        await this.timerP(3) // countdown to display end

        this._endGameP()
    }

    async _startNightP() {}
    async _endNightP() {}
    async _endGameP() {

        let players = await GameMasterRequestor.playersP(this._game.id)
        let newPlayer
        this._game.players.forEach(player => {
            newPlayer = players.find(p => p.id == player.id)
            player.role = newPlayer.role
            player.votes = newPlayer.votes
            this._game.setRole(player.id, player.role)
            this._game.setVotes(player.id, player.votes)
        })

        let game = await GameMasterRequestor.gameP(this._game.id)
        this._game.center = game.center
        this._game.setRole('left', this._game.center['left'])
        this._game.setRole('center', this._game.center['center'])
        this._game.setRole('right', this._game.center['right'])

        console.log(this._game)

        let voted = []

        this._game.players.forEach( player => {
            if (!voted[0]) {
                voted.push(player)
            } else if (player.votes.length > voted[0].votes.length) {
                    voted = []
                    voted.push(player)
            } else if (player.votes.length == voted[0].votes.length) {
                voted.push(player)
            }
        })

        if (voted[0].votes.length =! 1) {
            voted.forEach(player => this._game.setDeath(player.id, true))
        }
    }
}

export default GameHandler
