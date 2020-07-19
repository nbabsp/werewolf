let SessionRoutes = function(context, sessionDatabase, playerDatabase, gameDatabase) {
    context.app.get('/sessions/:sessionId/status/:playerId', (req, res) => {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        let playerId = req.params.playerId
        let player = session.getPlayer(playerId)
        if (!player) return context.sendError(res, 'unregistered playerId')

        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream'
        });
        res.flushHeaders()

        session.addListener(playerId, session => {
            res.write(`data: ${JSON.stringify(session.json)}\n\n`)
        })

        req.on('close', () => {
            console.log('closed from client', playerId)
            session.removeListener(playerId)
        })
    })

    context.app.post('/sessions/create', function(req, res) {
        context.sendJSON(res, sessionDatabase.create())
    })

    context.app.get('/sessions/:sessionId', function(req, res) {
        context.sendJSON(res, sessionDatabase.get(req.params.sessionId))
    })

    context.app.post('/sessions/:sessionId/game', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        session.game = gameDatabase.create(session.id) // backwards compatibility
        context.sendJSON(res, session.game)
    })

    context.app.get('/sessions/:sessionId/game', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        context.sendJSON(res, session.game)
    })

    context.app.delete('/sessions/:sessionId/game', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        if (!session.game) return context.sendError(res, 'no game in session')
        gameDatabase.clear(session.game.id)
        delete session.game
        context.sendJSON(res, {})
    })

    context.app.put('/sessions/:sessionId/players/:playerId', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        let player = playerDatabase.get(req.params.playerId)
        if (!player) return context.sendError(res, 'bad player id')
        session.join(player)
        context.sendJSON(res, {})
    })

    context.app.get('/sessions/clear', function(req, res) {
        context.sendJSON(res, sessionDatabase.clear())
    })

    context.app.get('/sessions/:sessionId/startGame', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        session.updateStatus('playing')
        session.players.forEach(player => player.active = false)
        context.sendJSON(res, {})
    })

    context.app.get('/sessions/:sessionId/endGame', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        session.updateStatus('lobby')
        context.sendJSON(res, {})
    })

    context.app.post('/sessions/:sessionId/players/:playerId/activate', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        let player = playerDatabase.get(req.params.playerId)
        if (!player) return context.sendError(res, 'bad player id')
        if (!session.activate(player.id)) return context.sendError(res, 'unregistered playerId')
        context.sendJSON(res, {})
    })
}

module.exports = SessionRoutes
