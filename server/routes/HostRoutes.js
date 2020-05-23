let HostRoutes = function(context, gameDatabase) {
    context.app.post('/games/create', function(req, res) {
        if (!req.body.name) return context.sendError(res, 'missing name in create game')
        context.sendJSON(res, gameDatabase.create(req.body.name))
    })

    context.app.get('/games/find', function(req, res) {
        context.sendJSON(res, gameDatabase.find())
    })

    context.app.post('/games/clear', function(req, res) {
        context.sendJSON(res, gameDatabase.clear())
    })
}

module.exports = HostRoutes
