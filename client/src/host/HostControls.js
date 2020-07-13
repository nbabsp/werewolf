import { LitElement, html, css } from 'lit-element'
import '../components/CTAButton'
import './SelectionGrid'
import '../components/NameList'

class HostControls extends LitElement {
    static get properties() {
        return {
            name: { type: String },
            deck: { type: Array },
            deckIds: { type: Array },
            names: { type: Array },
            hiddenRoles: { type: Boolean },
            hiddenPlayers: { type: Boolean },
            status: { type: String }
        }
    }

    constructor() {
        super()
        this.createCallback = null
        this.startCallback = null
        this.voteCallback = null
        this.restartCallback = null
        this.endCallback = null
        this.name = ''
        this.deck = []
        this.deckIds = []
        this.names = []
        this.hiddenRoles = true
        this.hiddenPlayers = true
        this.status = 'preGame'
    }

    static get styles() {
        return css`
            .topBar {
                overflow: auto;
                position: absolute;
                display: flex;
                flex-wrap: wrap;
                top: 0;
                left: 0;
                width: 100%;
                max-height: 100%;
                box-shadow: 0px 0px 4px 2px #888888;
                padding: 2px;
                background-color: #101060;
                font-size: 14px;
                font-family: arial, sans-serif;
                font-weight: 100;
                line-height: 18px;
                color: #000000;
                z-index: 9;
            }

            .infoText {
                display: block;
                width: 300px;
                background-color: #5050aa;
                color: #000000;
                text-align: center;
                margin: 10px auto 10px auto;
            }

            .name {
                position: relative;
                display: inline-block;
                width: 65px;
                float: left;
                margin-left: 10px;
                top: 15px;
                color: #FFFFFF;
                text-align: center;
                z-index: 8;
            }

            .cornerButton {
                position: relative;
                display: inline-block;
                width: 65px;
                height: 38px;
                padding-left: auto;
                margin-right: 10px;
                top: 5px;
                padding-top: 2px;
                background-color: #36393E;
                color: #FFFFFF;
                text-align: center;
                cursor: pointer;
                z-index: 8;
            }

            .cornerButton2 {
                position: relative;
                display: inline-block;
                width: 65px;
                height: 38px;
                margin-left: auto;
                margin-right: 10px;
                top: 5px;
                padding-top: 2px;
                background-color: #FF3333;
                color: #FFFFFF;
                text-align: center;
                cursor: pointer;
                z-index: 8;
            }

            .startButton {
                position: relative;
                margin: auto;
                margin-top: 12px;
                margin-bottom: 12px;
                text-align: center;
            }
        `
    }

    handleCreateClick(event) {
        if (this.createCallback) this.createCallback()
    }

    handleStartClick(event) {
        if (this.startCallback) this.startCallback()
    }

    handleVoteClick(event) {
        if (this.voteCallback) this.voteCallback()
    }
    
    handleRestartClick(event) {
        if (this.restartCallback) this.restartCallback()
    }

    handleEndClick(event) {
        if (this.endCallback) this.endCallback()
    }

    handleSelectionClick(event) {
        let grid = this.shadowRoot.getElementById('selectedGrid')
        if (this.deckIds.includes(event.detail.id)) {
            let index = this.deckIds.indexOf(event.detail.id)
            if (index !== -1) {
                this.deckIds.splice(index, 1)
                this.deck.splice(index, 1)
                grid.selectedCard(event.detail.id, false)
            }
        } else {
            this.deckIds.push(event.detail.id)
            this.deck.push(event.detail.role)
            grid.selectedCard(event.detail.id, true)
        }
    }

    handleKickClick(event) {
        let grid = this.shadowRoot.getElementById('selectedGrid')
        if (this.deckIds.includes(event.detail.id)) {
            let index = this.deckIds.indexOf(event.detail.id)
            if (index !== -1) {
                this.deckIds.splice(index, 1)
                this.deck.splice(index, 1)
                grid.selectedCard(event.detail.id, false)
            }
        } else {
            this.deckIds.push(event.detail.id)
            this.deck.push(event.detail.role)
            grid.selectedCard(event.detail.id, true)
        }
    }

    toggleHiddenRoles() {
        this.hiddenRoles = !this.hiddenRoles
        this.hiddenPlayers = true
    }

    toggleHiddenPlayers() {
        this.hiddenPlayers = !this.hiddenPlayers
        this.hiddenRoles = true
    }
    
    render() {
        return html`
            <div class='topBar'>
                <div class='name'>${ this.name }</div>
                ${  this.status == 'beforeGame' ? html`
                        <div style='width:100%;display:block;'>
                            <cta-button class='startButton' id='createButton' text='CREATE GAME' @click=${ this.handleCreateClick }></cta-button>
                        </div>
                ` : this.status == 'preGame' ? html`
                        <cta-button class='startButton' text='START GAME' @click=${ this.handleStartClick }></cta-button>
                        <div class='cornerButton2' @click=${ this.handleEndClick }>END\nGAME</div>
                        <div class='cornerButton' @click=${ this.toggleHiddenRoles }>${ this.hiddenRoles ? 'SELECT\nROLES' : 'HIDE\nROLES' }</div>
                        <div style='display:block;flex-basis:100%;'>
                            ${ !this.hiddenRoles ? html`<selection-grid id='selectedGrid' .selected=${ this.deckIds } @clicked=${ this.handleSelectionClick }></selection-grid>`: ''}
                        </div>
                ` : this.status == 'voting' ? html`
                        <div class='cornerButton2' @click=${ this.handleEndClick }>END\nGAME</div>
                        <div class='cornerButton' @click=${ this.handleVoteClick }>VOTE\nNOW</div>
                ` : this.status == 'endGame' ? html`
                        <div class='cornerButton2' @click=${ this.handleEndClick }>END\nGAME</div>
                        <div class='cornerButton' @click=${ this.handleRestartClick }>NEW\nGAME</div>
                ` : '' }
            </div>
        `
    }
}

customElements.define('host-controls', HostControls)
