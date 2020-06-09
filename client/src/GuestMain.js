import StaticRequestor from './common/StaticRequestor'
import InputPopover from './common/InputPopover'
import GameFactory from './game/GameFactory'
import GameMaster from './game/GameMaster'
import GameView from './game/GameView'
import './components/BaseLobby'

let PlayerRequestor = {
    registerP: (name) => StaticRequestor.postP('/players/register', {name: name}),
    playerP: (playerId) => StaticRequestor.getP(`/players/${playerId}`),
    playersP: (gameId) => StaticRequestor.getP(`/games/${gameId}/players`),
    findGameSource: (playerId) => StaticRequestor.eventSource(`/games/find/${playerId}`),
    statusSource: (playerId, gameId) => StaticRequestor.eventSource(`/games/${gameId}/status/${playerId}`)
}

let findGameP = (playerId) => new Promise((resolve, reject) => {
    let source = PlayerRequestor.findGameSource(playerId)
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

async function joinGameP(playerId) {
    let div = document.createElement('div')
    div.appendChild(document.createTextNode('Looking for a Game...'))
    document.body.appendChild(div)
    let gameId = await findGameP(playerId)
    div.remove()
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

async function playP(playerId) {
    let gameId = await joinGameP(playerId)

    let lobby = document.createElement('base-lobby')
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
    if (await GM.playP()) {
        main.element.remove()
        playP(playerId)
    }
}

async function mainP() {
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault()
        e.returnValue = ''
    })
    
    let name = await InputPopover.getP('REGISTER')
    let player = await PlayerRequestor.registerP(name)
    console.log('got player', player)
    playP(player.id)
}

export default mainP
