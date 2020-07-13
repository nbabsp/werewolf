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
    statusSource: (playerId, gameId) => StaticRequestor.eventSource(`/games/${gameId}/status/${playerId}`),
    getSessionP: (sessionId) => StaticRequestor.getP(`/sessions/${sessionId}`)
}

let findGameP = (gameName, playerId) => new Promise((resolve, reject) => {
    let source = PlayerRequestor.findGameSource(gameName, playerId)
    source.onmessage = (e) => {
        console.log('got message', e, e.data)
        console.log('closing', playerId)
        source.close()
        resolve(e.data)
    }
    source.onerror = (e) => {
        console.log('got an error', e)
        source.close()
    }
})

async function joinGameP(gameName, playerId) {
    let div = document.createElement('div')
    div.appendChild(document.createTextNode('Waiting for host to restart game'))
    div.style.textAlign = 'center'
    div.style.margin = 'auto'
    document.body.appendChild(div)
    let gameId = await findGameP(gameName, playerId)
    div.remove()
    // inject two more players in debug environment
    if (process.env.ENV == 'debug') {
        let player = await PlayerRequestor.registerP('AI-1')
        await findGameP(gameName, player.id)
        player = await PlayerRequestor.registerP('AI-2')
        await findGameP(gameName, player.id)
    }
    return gameId
}

let waitInLobbyP = (lobby, playerId, gameId) => new Promise((resolve, reject) => {
    let source = PlayerRequestor.statusSource(playerId, gameId)
    source.onmessage = (e) => {
        let game = JSON.parse(e.data)
        lobby.players = game.players
        if (game.status != 'creating') {
            source.close()
            resolve(game)
        }
    }
    source.onerror = (e) => {
        console.log('got an error', e)
        source.close()
    }
})

async function playP(session, playerId) {
    let gameId = await joinGameP(session.name, playerId)

    let lobby = document.createElement('base-lobby')
    lobby.name = session.name
    document.body.appendChild(lobby)
    await waitInLobbyP(lobby, playerId, gameId)
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
    playP(session, playerId)
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
    return session
}

async function joinSessionP(session) {
    let name = await InputPopover.getP('Input your name', 'REGISTER')
    let player = await PlayerRequestor.registerP(name)
    console.log('got player', player)
    return player.id
}

async function mainP() {
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault()
        e.returnValue = ''
    })

    let session = await findSessionP()
    let playerId = await joinSessionP(session)
    playP(session, playerId)
}

export default mainP
