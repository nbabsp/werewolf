class GamePlayer {
    constructor(player) {
        this.id = player.id
        this.name = player.name
        this.startRole = null
        this.role = null
        this.votes = []
        this.nightActionComplete = false
        this.voted = false
        this.votedId = null
    }

    get json() {
        return {
            id: this.id,
            name: this.name,
            startRole: this.startRole,
            role: this.role,
            votes: this.votes,
            nightActionComplete: this.nightActionComplete,
            voted: this.voted,
            votedId: this.votedId
        }
    }
}

module.exports = GamePlayer
