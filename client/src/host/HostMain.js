import Requestor from '../common/Requestor'
import './HostControls'

let host = 'localhost'
let port = 9615

let HostRequestor = {
    createP: (name) => Requestor.postP(host, port, '/games/create', {name: name}),
    clearP: () => Requestor.postP(host, port, `/games/clear`),
    startP: (gameId) => Requestor.postP(host, port, `/games/${gameId}/start`),
}

async function hostGameP(gameId) {
    console.log('hosting game:', gameId)
    let lobby = document.createElement('host-controls')
    lobby.startCallback = () => {
        console.log('waiting done', gameId)
        HostRequestor.startP(gameId)
    }
    document.body.appendChild(lobby)
}

async function mainP() {
    await HostRequestor.clearP()
    let game = await HostRequestor.createP('New Game')
    await hostGameP(game.id)
}

export default mainP
