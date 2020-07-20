import StaticRequestor from './common/StaticRequestor'
import InputPopover from './common/InputPopover'
import ErrorPopup from './common/ErrorPopup'
import GameFactory from './game/GameFactory'
import GameMaster from './game/GameMaster'
import GameView from './game/GameView'
import './components/BaseLobby'

let PlayerRequestor = {
    registerP: (name) => StaticRequestor.postP('/players/register', {name: name}),
    findGameSource: (gameName, playerId) => StaticRequestor.eventSource(`/games/find/${gameName}/${playerId}`),
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
        source.close()
        reject()
    }
})

async function playP(sessionId, playerId) {
    //let gameId = await joinGameP(sessionId, playerId)
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

    let main = new GameView(game, interaction)
    document.body.appendChild(main.element)

    let GM = new GameMaster(game, interaction)
    await GM.playP()
    main.element.remove()
    playP(sessionId, playerId)
}

async function findSessionP() {
    let sessionId = await InputPopover.getP('Input group name', 'JOIN GROUP')
    let session = await PlayerRequestor.getSessionP(sessionId)
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

    let sessionId = await findSessionP()
    let playerId = await registerPlayerP(sessionId)
    await PlayerRequestor.joinSessionP(sessionId, playerId)
    playP(sessionId, playerId)
}

export default mainP
