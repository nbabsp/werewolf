import StaticRequestor from '../common/StaticRequestor'
import ErrorPopup from '../common/ErrorPopup'
import './components/HostControls'

let HostRequestor = {
    clearSessionsP: () => StaticRequestor.getP(`/sessions/clear`),
    createSessionP: () => StaticRequestor.postP(`/sessions/create`),
    createP: (sessionId, playerIds, deck) => StaticRequestor.postP(`/sessions/${sessionId}/game/${JSON.stringify(playerIds)}/${JSON.stringify(deck)}`),
    clearP: (sessionId) => StaticRequestor.deleteP(`/sessions/${sessionId}/game`),
    getPlayersP: (sessionId) => StaticRequestor.getP(`/sessions/${sessionId}/players`),
    startP: (gameId, deck) => StaticRequestor.postP(`/games/${gameId}/start/${JSON.stringify(deck)}`),
    voteNowP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voteNow`),
    endSessionGameP: (sessionId) => StaticRequestor.getP(`/sessions/${sessionId}/endGame`)
}

async function hostGameP(sessionId) {
    let gameId = null
    let lobby = document.createElement('host-controls')
    lobby.name = sessionId

    lobby.addEventListener('start', async () => {
        let players = JSON.parse(await HostRequestor.getPlayersP(sessionId))
        let playerIds = players.filter(player => player.active).map(player => player.id)
        let game = await HostRequestor.createP(sessionId, playerIds, lobby.deck)
        gameId = game.id
        lobby.hiddenRoles = true
        lobby.status = 'voting'
        console.log('Starting Game', gameId)
    })

    lobby.addEventListener('vote', async () => {
        await HostRequestor.voteNowP(gameId)
        await HostRequestor.clearP(sessionId)
        lobby.status = 'preGame'
    })

    lobby.addEventListener('terminate', async () => {
        await HostRequestor.clearP(sessionId)
    })

    document.body.appendChild(lobby)
}

async function mainP() {
    await HostRequestor.clearSessionsP() // clean up the sessions before we start
    let session = await HostRequestor.createSessionP()
    console.log('created session', session)
    return await hostGameP(session.id)
}

export default mainP
