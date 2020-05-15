import Requestor from './common/Requestor'
import InputPopover from './common/InputPopover'
import LobbyView from './manager/LobbyView'
import ManageGamePopover from './manager/ManageGamePopover'

let host = 'localhost'
let port = 9615

let ManagerRequestor = {
    createP: (name) => Requestor.postP(host, port, '/games/create', {name: name}),
    clearP: () => Requestor.postP(host, port, `/games/clear`),
    startP: (gameId) => Requestor.postP(host, port, `/games/${gameId}/start`),
    playersP: (gameId) => Requestor.getP(host, port, `/games/${gameId}/players`)
}

async function waitP(sec) {
    if(sec < 1) {
        return Promise.reject("Time must be greater than 2 seconds")
    }
    console.log('waiting...')
    return new Promise(resolve => setTimeout(resolve, sec*1000))
}

async function manageLobbyP(gameId) {
    let started = false
    let lobby = new LobbyView(() => started = true)
    document.body.appendChild(lobby.element)
    while(!started) {
        lobby.players = await ManagerRequestor.playersP(gameId)
        await waitP(1)
    }
    lobby.element.remove()
}

async function manageGameP(gameId) {
    console.log('starting game', gameId)
    await manageLobbyP(gameId)
    await ManagerRequestor.startP(gameId)
    await ManageGamePopover.manageP(gameId)
    console.log('ending game', gameId)
    // await ManagerRequestor.endP(gameId)
    // start all over again
    // manageGameP(gameId)
}

async function mainP() {
    await ManagerRequestor.clearP()
    let name = await InputPopover.getP('CREATE NEW GAME')
    let game = await ManagerRequestor.createP(name)
    console.log('created game:', game)
    await manageGameP(game.id)
}

mainP()
