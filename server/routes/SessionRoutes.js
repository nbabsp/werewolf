let SessionRoutes = function(context, sessionDatabase) {
    context.app.post('/sessions/create', function(req, res) {
        context.sendJSON(res, sessionDatabase.create())
    })

    context.app.get('/sessions/:sessionId', function(req, res) {
        context.sendJSON(res, sessionDatabase.get(req.params.sessionId))
    })

    context.app.get('/sessions/clear', function(req, res) {
        context.sendJSON(res, sessionDatabase.clear())
    })
}

module.exports = SessionRoutes
