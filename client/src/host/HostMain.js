import StaticRequestor from '../common/StaticRequestor'
import ErrorPopup from '../common/ErrorPopup'
import './HostControls'

let HostRequestor = {
    createP: (name) => StaticRequestor.postP(`/games/create/${name}`),
    clearP: (gameId) => StaticRequestor.postP(`/games/clear/${gameId}`),
    startP: (gameId, deck) => StaticRequestor.postP(`/games/${gameId}/start/${JSON.stringify(deck)}`),
    statusSource: (playerId, gameId) => StaticRequestor.eventSource(`/games/${gameId}/status/${playerId}`),
    voteNowP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voteNow`),
}

async function createGameP() {
    let lobby = document.createElement('host-controls')
    lobby.status = 'beforeGame'
    lobby.createCallback = async (gameName) => {
        try {
            let game = await HostRequestor.createP(gameName)
            lobby.remove()
            console.log('Creating Game')
            return await hostGameP(game.id, gameName, [], [])
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    document.body.appendChild(lobby)

}

async function hostGameP(gameId, gameName, deck, deckIds) {
    console.log('hosting game:', gameId)
    let lobby = document.createElement('host-controls')
    lobby.name = gameName
    lobby.deck = deck
    lobby.deckIds = deckIds
    lobby.names = ['John', 'Smith', 'Fred']
    lobby.startCallback = async () => {
        try {
            await HostRequestor.startP(gameId, lobby.deck)
            lobby.hiddenRoles = true
            lobby.status = 'voting'
            console.log('Starting Game', gameId)
        } catch (e) {
            ErrorPopup.post(e.error.err)
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
            await HostRequestor.clearP(gameId)
            let game = await HostRequestor.createP(gameName)
            return (await hostGameP(game.id, gameName, lobby.deck, lobby.deckIds))
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    document.body.appendChild(lobby)
}

async function mainP() {
    await createGameP()
}

export default mainP
