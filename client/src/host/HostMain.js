import StaticRequestor from '../common/StaticRequestor'
import ErrorPopup from '../common/ErrorPopup'
import './components/HostControls'

let HostRequestor = {
    clearSessionsP: () => StaticRequestor.getP(`/sessions/clear`),
    createSessionP: () => StaticRequestor.postP(`/sessions/create`),
    createP: (sessionId) => StaticRequestor.postP(`/sessions/${sessionId}/game`),
    clearP: (sessionId) => StaticRequestor.deleteP(`/sessions/${sessionId}/game`),
    startP: (gameId, deck) => StaticRequestor.postP(`/games/${gameId}/start/${JSON.stringify(deck)}`),
    voteNowP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voteNow`),
    startSessionGameP: (sessionId) => StaticRequestor.getP(`/sessions/${sessionId}/startGame`),
    endSessionGameP: (sessionId) => StaticRequestor.getP(`/sessions/${sessionId}/endGame`)
}

async function hostGameP(session, gameId, deck, deckIds) {
    console.log('hosting game:', gameId)
    let lobby = document.createElement('host-controls')
    lobby.name = session.id
    lobby.deck = deck
    lobby.deckIds = deckIds
    if (process.env.ENV == 'debug') {
        lobby.deck = ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager']
        lobby.deckIds = ['werewolf1', 'werewolf2', 'seer', 'robber', 'troublemaker', 'villager1']
    }

    lobby.names = ['John', 'Smith', 'Fred']
    lobby.startCallback = async () => {
        try {
            await HostRequestor.startP(gameId, lobby.deck)
            await HostRequestor.startSessionGameP(session.id)
            lobby.hiddenRoles = true
            lobby.status = 'voting'
            console.log('Starting Game', gameId)
        } catch (e) {
            ErrorPopup.post(e.error.err)
            console.log('Error: ', e)
        }
    }
    lobby.voteCallback = async () => {
        try {
            await HostRequestor.voteNowP(gameId)
            await HostRequestor.endSessionGameP(session.id)
            lobby.status = 'endGame'
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    lobby.restartCallback = async () => {
        try {
            lobby.remove()
            await HostRequestor.clearP(session.id)
            let game = await HostRequestor.createP(session.id)
            return (await hostGameP(session, game.id, lobby.deck, lobby.deckIds))
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    lobby.endCallback = async () => {
        try {
            await HostRequestor.clearP(session.id)
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    document.body.appendChild(lobby)
}

async function mainP() {
    await HostRequestor.clearSessionsP() // clean up the sessions before we start
    let session = await HostRequestor.createSessionP()
    console.log('created session', session)
    let game = await HostRequestor.createP(session.id)
    console.log('initial game', game)
    return await hostGameP(session, game.id, [], [])
}

export default mainP
