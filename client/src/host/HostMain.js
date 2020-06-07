import StaticRequestor from '../common/StaticRequestor'
import './HostControls'

let HostRequestor = {
    createP: (name) => StaticRequestor.postP('/games/create', {name: name}),
    clearP: () => StaticRequestor.postP(`/games/clear`),
    startP: (gameId, deck) => StaticRequestor.postP(`/games/${gameId}/start/${JSON.stringify(deck)}`),
}

async function hostGameP(gameId) {
    console.log('hosting game:', gameId)
    let lobby = document.createElement('host-controls')
    lobby.startCallback = async () => {
        console.log('waiting done', gameId)
        try {
            await HostRequestor.startP(gameId, lobby.deck)
            lobby.hide()
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    document.body.appendChild(lobby)
}

async function mainP() {
    await HostRequestor.clearP()
    let game = await HostRequestor.createP('New Game')
    await hostGameP(game.id)
}

export default mainP
