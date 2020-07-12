let HostRoutes = function(context, playerDatabase, gameDatabase) {

    context.app.post('/games/clear/:gameId', function(req, res) {
        if (!req.params.gameId) return context.sendError(res, 'bad game id')
        context.sendJSON(res, gameDatabase.clear(req.params.gameId))
    })

    context.app.post('/games/create/:name', function(req, res) {
        if (!req.params.name) return context.sendError(res, 'missing name in create game')
        context.sendJSON(res, gameDatabase.create(req.params.name))
    })

    context.app.get('/games/find/:gameName/:playerId', (req, res) => {
        let gameName = req.params.gameName
        let playerId = req.params.playerId
        let player = playerDatabase.get(playerId)
        if (!player) return context.sendError(res, 'unregistered playerId in find')

        res.writeHead(200, {
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream'
        });
        res.flushHeaders()

        gameDatabase.addListener(gameName, playerId, game => {
            console.log('observed', game)
            game.join(player)
            res.write(`data: ${game.id}\n\n`)
            res.end()
        })

        req.on('close', () => {
            console.log('closed from client', playerId)
            gameDatabase.removeListener(playerId)
        })
    })
}

module.exports = HostRoutes
