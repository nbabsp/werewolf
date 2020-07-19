class GamePlayer {
    constructor(player) {
        this.id = player.id
        this.name = player.name
        this.active = true
        this.startRole = null
        this.role = null
        this.prepared = false
        this.votes = []
        this.nightActionComplete = false
        this.voted = false
        this.votedId = null
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            active: this.active,
            startRole: this.startRole,
            role: this.role,
            prepared: this.prepared,
            votes: this.votes,
            nightActionComplete: this.nightActionComplete,
            voted: this.voted,
            votedId: this.votedId
        }
    }
}

module.exports = GamePlayer
