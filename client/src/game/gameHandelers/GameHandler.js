import StaticRequestor from '../../common/StaticRequestor'
import Stopwatch from '../../common/Stopwatch'

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
    }

    resolve(value) {
        this._resolve(value)
    }

    reject(value) {
        this._reject(value)
    }
}

class Timer {
    constructor(duration, onTime, onEnd) {
        this._sw = new Stopwatch()
        this._duration = duration
        this._onTime = onTime
        this._onEnd = onEnd
    }

    start() {
        this._sw.start(ticks => {
            let time = this._duration - ticks > 0 ? this._duration - ticks : 0
            if (this._onTime) this._onTime(time)
            if (time == 0) {
                this._sw.stop()
                if (this._onEnd) this._onEnd()
            }
        })
    }

    cancel() {
        this._sw.stop()
        if (this._onTime) this._onTime(0)
        if (this._onEnd) this._onEnd()
    }
}

let GameMasterRequestor = {    
    prepareP: (gameId, playerId) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/prepare`),
    endNightActionP: (gameId, playerId) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/endNightAction`),
    voteP: (gameId, playerId, voteId) => StaticRequestor.postP(`/games/${gameId}/players/${playerId}/vote/${voteId}`),
    statusSource: (gameId, playerId) => StaticRequestor.eventSource(`/games/${gameId}/status/${playerId}`),
}

let waitForStatusP = (gameId, playerId, status) => new Promise((resolve, reject) => {
    let source = GameMasterRequestor.statusSource(gameId, playerId)
    source.onmessage = (e) => {
        let game = JSON.parse(e.data)
        if (game.status == status) {
            source.close()
            resolve(game)
        }
    }
    source.onerror = (e) => {
        console.log('got an error', e)
    }
})

class GameHandler {
    constructor(game) {
        this._game = game
        this._player = game.player
        this._status = 'unknown'
        this._voteId = null
        this._midClick = false
        this._completeDeferred = new Deferred()
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
            this._game.setRole(id, 'myCard')
            this._game.setRole('lower', 'myCard')
        }
    }

    onClick(id) {
        switch (this._status) {
            case 'prepare':
                this._prepClick(id)
                break
            case 'night':
                this._nightClick(id)
                break
            case 'day':
                this._dayClick(id)
                break
            case 'endGame':
                this._endGameClick(id)
                break
            default:
                break
        }
    }

    async _prepClick(id) {
        if (id == 'timerClick') {
            this._game.setTimerStatus('waiting')
            await GameMasterRequestor.prepareP(this._game.id, this._player.id)
        }
    }

    _nightClick(id) {}

    async _dayClick(id) {
        if (this._player.id == id) return
        let player = this._game.players.find(player => player.id == id)
        if (!player || id == this._voteId) return
        if (this._voteId) this._game.setRole(this._voteId, null)
        this._game.setRole(id, 'selected')
        this._voteId = id
        await GameMasterRequestor.voteP(this._game.id, this._player.id, this._voteId)
    }

    _endGameClick(id) {
        if (id == 'timerClick') {
            this._completeDeferred.resolve()
        }
    }

    _startTimer(duration, onEnd) {
        if (this._timer) this._cancelTimer()
        this._timer = new Timer(duration, time => this._game.time = time, onEnd)
        this._timer.start()
    }

    _cancelTimer() {
        if (this._timer) this._timer.cancel()
        this._timer = null
    }

    async preparePhaseP() {
        let waitP = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000))
        await waitP(0.5)
        this._status = 'prepare'
        this._game.setRole(this._player.id, 'myCard')
        await waitForStatusP(this._game.id, this._player.id, 'night')
        this._game.setTimerStatus('game')
    }

    async nightPhaseP() {
        let waitP = (sec) => new Promise(resolve => setTimeout(resolve, sec*1000))
        
        this._status = 'night'
        console.log('night!')
        this._startNightP()
        await new Promise(resolve => this._startTimer(30, resolve)) // give players a chance to perform their action
        while(this._midClick) await waitP(1)
        await GameMasterRequestor.endNightActionP(this._game.id, this._player.id)

        this._status = 'night action over'
        let game = await waitForStatusP(this._game.id, this._player.id, 'day')
        this._updateBoard(game)
        await this._endNightP()
    }

    async discussionPhaseP() {
        this._status = 'day'
        console.log('day!')
        this._game.setDescription('discussion')
        // randomly select voted player
        let arr = this._game.players.filter(p => p.id != this._player.id)
        if (arr.length > 0) {
            let id = arr[Math.floor(Math.random() * arr.length)].id
            this._dayClick(id)
        }
        this._startTimer(300) // countdown for discussion
    }

    async endPhaseP() {
        let game = await waitForStatusP(this._game.id, this._player.id, 'endGame')
        this._cancelTimer()
        this._endGame(game)
        this._game.setEndGame(true)
        this._game.setTimerStatus('rejoining')
        this._status = 'endGame'
        console.log('endGame!')
        await this._completeDeferred.promise
    }

    async playP() {        
        await this.preparePhaseP()
        await this.nightPhaseP()
        await this.discussionPhaseP()
        await this.endPhaseP()
    }

    async _startNightP() {}
    async _endNightP() {}
    
    _updateBoard(game) {
        let newPlayer
        this._game.players.forEach(player => {
            newPlayer = game.players.find(p => p.id == player.id)
            player.role = newPlayer.role
        })
        this._game.center = game.center
    }

    _endGame(game) {
        let newPlayer
        this._game.players.forEach(player => {
            newPlayer = game.players.find(p => p.id == player.id)
            player.role = newPlayer.role
            player.votes = newPlayer.votes
            player.votedId = newPlayer.votedId
            this._game.setRole(player.id, player.role)
            this._game.setVotes(player.id, player.votes)
        })

        this._game.center = game.center
        this._game.setRole('left', this._game.center['left'])
        this._game.setRole('center', this._game.center['center'])
        this._game.setRole('right', this._game.center['right'])
        this._game.setRole('lower', this._player.role)

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
        
        killed.forEach( player => {
            if (player.role == 'hunter') {
                let p = this._game.players.find(p => p.id == player.votedId)
                if(!killed.includes(p)) {
                    killed.push(p)
                }
            }
        })

        if (killed[0].votes.length != 1) {
            killed.forEach(player => this._game.setDeath(player.id, true))
        }
    }
}

export default GameHandler
