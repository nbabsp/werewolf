import Requestor from './common/Requestor'
import InputPopover from './common/InputPopover'
import GameFactory from './game/GameFactory'
import GameMaster from './game/GameMaster'
import GameView from './game/GameView'
import './components/BaseLobby'

let host = 'localhost'
let port = 9615

let PlayerRequestor = {
    registerP: (name) => Requestor.postP(host, port, '/players/register', {name: name}),
    playerP: (playerId) => Requestor.getP(host, port, `/players/${playerId}`),
    playersP: (gameId) => Requestor.getP(host, port, `/games/${gameId}/players`),
    waitForStartP: (gameId, callback) => Requestor.waitForStatusChangeP(host, port, `/games/${gameId}/status`, 'creating', callback)
}

let findGameP = (playerId) => new Promise((resolve, reject) => {
    let source = new EventSource(`http://${host}:${port}/games/find/${playerId}`)
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

async function waitInLobbyP(gameId) {
    let lobby = document.createElement('base-lobby')
    document.body.appendChild(lobby)
    await PlayerRequestor.waitForStartP(gameId, async () => {
        lobby.players = await PlayerRequestor.playersP(gameId)
    })
    lobby.remove()
}

async function playP(playerId) {
    let gameId = await joinGameP(playerId)
    await waitInLobbyP(gameId)

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
}

async function mainP() {
    let name = await InputPopover.getP('REGISTER')
    let player = await PlayerRequestor.registerP(name)
    console.log('got player', player)
    playP(player.id)
}

export default mainP
