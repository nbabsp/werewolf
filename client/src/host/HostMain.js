import StaticRequestor from '../common/StaticRequestor'
import ErrorPopup from '../common/ErrorPopup'
import './components/HostControls'

let HostRequestor = {
    clearSessionsP: () => StaticRequestor.getP(`/sessions/clear`),
    createSessionP: () => StaticRequestor.postP(`/sessions/create`),
    createP: (sessionId, deck) => StaticRequestor.postP(`/sessions/${sessionId}/game`, {deck: deck}),
    clearP: (sessionId) => StaticRequestor.deleteP(`/sessions/${sessionId}/game`),
    getPlayersP: (sessionId) => StaticRequestor.getP(`/sessions/${sessionId}/players`),
    voteNowP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voteNow`)
}

async function hostGameP(sessionId) {
    let gameId = null
    let lobby = document.createElement('host-controls')
    lobby.name = sessionId

    lobby.addEventListener('start', async () => {
        try {
            console.log('create')
            let game = await HostRequestor.createP(sessionId, lobby.deck)
            console.log('created')
            gameId = game.id
            lobby.hiddenRoles = true
            lobby.status = 'voting'
        } catch (e) {
            console.log('Error: ', e)
            if(e.error.err) ErrorPopup.post(e.error.err)
        }
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
