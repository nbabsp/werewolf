import StaticRequestor from '../common/StaticRequestor'
import './HostControls'

let HostRequestor = {
    createP: (name) => StaticRequestor.postP('/games/create', {name: name}),
    clearP: () => StaticRequestor.postP(`/games/clear`),
    startP: (gameId) => StaticRequestor.postP(`/games/${gameId}/start`),
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
