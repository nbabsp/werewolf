import StaticRequestor from '../common/StaticRequestor'
import ErrorPopup from '../common/ErrorPopup'
import './HostControls'

let HostRequestor = {
    clearSessionsP: () => StaticRequestor.getP(`/sessions/clear`),
    createSessionP: () => StaticRequestor.postP(`/sessions/create`),
    createP: (name) => StaticRequestor.postP(`/games/create/${name}`),
    clearP: (gameId) => StaticRequestor.postP(`/games/clear/${gameId}`),
    startP: (gameId, deck) => StaticRequestor.postP(`/games/${gameId}/start/${JSON.stringify(deck)}`),
    voteNowP: (gameId) => StaticRequestor.getP(`/games/${gameId}/voteNow`),
}

let registerPlayer = (name, gameName) => new Promise( async (resolve, reject) => {
    let player = await StaticRequestor.postP('/players/register', {name: name})
    let source = StaticRequestor.eventSource(`/games/find/${gameName}/${player.id}`)
    source.onmessage = (e) => {
        console.log('got message', e, e.data)
        console.log('closing', player.id)
        source.close()
        resolve(e.data)
    }
    source.onerror = (e) => {
        console.log('got an error', e)
        source.close()
    }
})

async function createGameP(session) {
    let lobby = document.createElement('host-controls')
    lobby.status = 'beforeGame'
    lobby.createCallback = async () => {
        try {
            let game = await HostRequestor.createP(session.name)
            lobby.remove()
            console.log('Creating Game')
            return await hostGameP(session, game.id, [], [])
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    document.body.appendChild(lobby)
}

async function hostGameP(session, gameId, deck, deckIds) {
    console.log('hosting game:', gameId)
    let lobby = document.createElement('host-controls')
    lobby.name = session.name
    lobby.deck = deck
    lobby.deckIds = deckIds
    if (process.env.ENV == 'debug') {
        await registerPlayer('a', session.name)
        await registerPlayer('b', session.name)
        lobby.deck = ['werewolf', 'werewolf', 'seer', 'robber', 'troublemaker', 'villager']
        lobby.deckIds = ['werewolf1', 'werewolf2', 'seer', 'robber', 'troublemaker', 'villager1']
    }

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
    lobby.voteCallback = async () => {
        try {
            await HostRequestor.voteNowP(gameId)
            lobby.status = 'endGame'
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    lobby.restartCallback = async () => {
        try {
            lobby.remove()
            await HostRequestor.clearP(gameId)
            let game = await HostRequestor.createP(session.name)
            return (await hostGameP(session, game.id, lobby.deck, lobby.deckIds))
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    lobby.endCallback = async () => {
        try {
            await HostRequestor.clearP(gameId)
            lobby.remove()
            return await createGameP(session)
        } catch (e) {
            console.log('Error: ', e)
        }
    }
    document.body.appendChild(lobby)
}

async function mainP() {
    await HostRequestor.clearSessionsP() // clean up the sessions before we start
    let session = await HostRequestor.createSessionP()
    console.log('got session', session)
    await createGameP(session)
}

export default mainP
