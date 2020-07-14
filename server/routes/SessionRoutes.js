let SessionRoutes = function(context, sessionDatabase, playerDatabase, gameDatabase) {
    context.app.post('/sessions/create', function(req, res) {
        context.sendJSON(res, sessionDatabase.create())
    })

    context.app.get('/sessions/:sessionId', function(req, res) {
        context.sendJSON(res, sessionDatabase.get(req.params.sessionId))
    })

    context.app.post('/sessions/:sessionId/game', function(req, res) {
        let session = sessionDatabase.get(req.params.sessionId)
        if (!session) return context.sendError(res, 'bad session id')
        session.game = gameDatabase.create(session.name) // backwards compatibility
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

    context.app.get('/sessions/clear', function(req, res) {
        context.sendJSON(res, sessionDatabase.clear())
    })
}

module.exports = SessionRoutes
