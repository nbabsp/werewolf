class GamePlayer {
    constructor(player) {
        this.id = player.id
        this.name = player.name
        this.startRole = null
        this.role = null
        this.prepared = false
        this.votes = []
        this.nightActionComplete = false
        this.votedId = null
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            startRole: this.startRole,
            role: this.role,
            prepared: this.prepared,
            votes: this.votes,
            nightActionComplete: this.nightActionComplete,
            votedId: this.votedId
        }
    }
}

module.exports = GamePlayer
