import StaticRequestor from '../common/StaticRequestor'
import './HostControls'

let HostRequestor = {
    createP: (name) => StaticRequestor.postP('/games/create', {name: name}),
    clearP: () => StaticRequestor.postP(`/games/clear`),
    startP: (gameId, deck) => StaticRequestor.postP(`/games/${gameId}/start/${JSON.stringify(deck)}`),
    voteNowP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voteNow`),
}

async function hostGameP(gameId, deck, deckIds) {
    console.log('hosting game:', gameId)
    let lobby = document.createElement('host-controls')
    lobby.deck = deck
    lobby.deckIds = deckIds
    lobby.startCallback = async () => {
        try {
            await HostRequestor.startP(gameId, lobby.deck)
            lobby.hiddenRoles = true
            lobby.status = 'voting'
            console.log('Starting Game', gameId)
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    lobby.startVoteCallback = async () => {
        try {
            await HostRequestor.voteNowP(gameId)
            lobby.status = 'endGame'
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    lobby.startRestartCallback = async () => {
        try {
            lobby.remove()
            await HostRequestor.clearP()
            let game = await HostRequestor.createP('New Game')
            return (await hostGameP(game.id, lobby.deck, lobby.deckIds))
        } catch (e) {
            console.log('Error: ', e)
        }
    }

    document.body.appendChild(lobby)
}

async function mainP() {
    await HostRequestor.clearP()
    let game = await HostRequestor.createP('New Game')
    await hostGameP(game.id, [], [])
}

export default mainP
