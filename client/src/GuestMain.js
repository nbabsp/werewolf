import StaticRequestor from './common/StaticRequestor'
import InputPopover from './common/InputPopover'
import ErrorPopup from './common/ErrorPopup'
import GameFactory from './game/GameFactory'
import GameMaster from './game/GameMaster'
import GameView from './game/GameView'
import './components/SessionControls'
import './components/BaseLobby'

let PlayerRequestor = {
    registerP: (name) => StaticRequestor.postP('/players/register', {name: name}),
    getSessionP: (sessionId) => StaticRequestor.getP(`/sessions/${sessionId}`),
    joinSessionP: (sessionId, playerId) => StaticRequestor.putP(`/sessions/${sessionId}/players/${playerId}`),
    activateP: (sessionId, playerId) => StaticRequestor.postP(`/sessions/${sessionId}/players/${playerId}/activate`),
    statusSource: (sessionId, playerId) => StaticRequestor.eventSource(`/sessions/${sessionId}/status/${playerId}`)
}

let waitInLobbyP = (lobby, playerId, sessionId) => new Promise((resolve, reject) => {
    let source = PlayerRequestor.statusSource(sessionId, playerId)
    source.onmessage = (e) => {
        let session = JSON.parse(e.data)
        lobby.players = session.players
        if (session.status != 'lobby') {
            source.close()
            resolve(session.gameId)
        }
    }
    source.onerror = (e) => {
        console.log('got an error', e)
    }
})

async function playP(sessionId, playerId) {
    await PlayerRequestor.activateP(sessionId, playerId)

    let lobby = document.createElement('base-lobby')
    lobby.name = sessionId
    document.body.appendChild(lobby)
    let gameId = await waitInLobbyP(lobby, playerId, sessionId)
    lobby.remove()

    let _clickObservers = []
    let interaction = {
        onClick(id) {
            _clickObservers.forEach(callback => callback(id))
        },
        observeClick(callback) {
            _clickObservers.push(callback)
        }
    }
    let game = await GameFactory.createP(gameId, playerId)

    let sessionControls = document.createElement('session-controls')
    sessionControls.name = sessionId
    document.body.appendChild(sessionControls)

    let main = new GameView(game, interaction)
    document.body.appendChild(main.element)
    
    sessionControls.addEventListener('reset', async () => {
        main.element.remove()
        sessionControls.remove()
        playP(sessionId, playerId)
    })

    let GM = new GameMaster(game, interaction)
    await GM.playP()
    sessionControls.status = 'done'
}

async function findSessionP() {
    console.log('hi1')
    let sessionId = await InputPopover.getP('Input group name', 'JOIN GROUP')
    console.log('hi2 sessionId:', sessionId)
    let session = await PlayerRequestor.getSessionP(sessionId)
    console.log('hi3 session:', session)
    console.log('got session', session)
    while(!session) {
        ErrorPopup.post('Group not found')
        sessionId = await InputPopover.getP('Input group name', 'JOIN GROUP')
        session = await PlayerRequestor.getSessionP(sessionId)
    }
    return session.id
}

async function registerPlayerP(sessionId) {
    let repeat = true
    let name = null
    console.log('repeat:', repeat)
    while(repeat) {
        name = await InputPopover.getP('Input your name', 'REGISTER')
        let session = await PlayerRequestor.getSessionP(sessionId)
        repeat = false
        session.players.forEach(player => {
            if (player.name == name) {
                repeat = true
                ErrorPopup.post('Name unavailable')
            }
        })
    }
    let player = await PlayerRequestor.registerP(name)
    console.log('got player', player)
    return player.id
}

async function mainP() {
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault()
        e.returnValue = ''
    })
    console.log('hi0')
    let sessionId = await findSessionP()
    let playerId = await registerPlayerP(sessionId)
    await PlayerRequestor.joinSessionP(sessionId, playerId)
    if (process.env.ENV == 'debug') {
        let player = await PlayerRequestor.registerP('AI-1')
        await PlayerRequestor.joinSessionP(sessionId, player.id)
        player = await PlayerRequestor.registerP('AI-2')
        await PlayerRequestor.joinSessionP(sessionId, player.id)
    }

    playP(sessionId, playerId)
}

export default mainP
