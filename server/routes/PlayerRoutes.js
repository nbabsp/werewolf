let PlayerRoutes = {
    register(context, playerDatabase) {
        context.app.post('/players/register', function(req, res) {
            if (!req.body.name) return context.sendError(res, 'missing name in register player')
            context.sendJSON(res, playerDatabase.register(req.body.name))
        })

        context.app.get('/players/:playerId', function(req, res) {
            context.sendJSON(res, playerDatabase.get(req.params.playerId))
        })

        context.app.get('/players/clear', function(req, res) {
            context.sendJSON(res, playerDatabase.clear())
        })
    }
}

module.exports = PlayerRoutes
