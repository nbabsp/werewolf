import { LitElement, html, css } from 'lit-element'
import '../components/CTAButton'
import './SelectionGrid'

class HostControls extends LitElement {
    static get properties() {
        return {
            deck: { type: Array },
            deckIds: { type: Array },
            hiddenRoles: { type: Boolean },
            status: { type: String }
        }
    }

    constructor() {
        super()
        this.startCallback = null
        this.startVoteCallback = null
        this.deck = []
        this.deckIds = []
        this.hiddenRoles = true
        this.status = 'preGame'
    }

    static get styles() {
        return css`
            .topBar {
                overflow: auto;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 46px;
                max-height: 100%;
                box-shadow: 0px 0px 4px 2px #888888;
                padding: 2px;
                background-color: #FF7777;
                font-size: 14px;
                font-family: arial, sans-serif;
                font-weight: 100;
                line-height: 18px;
                color: #000000;
            }

            .cornerButton {
                position: absolute;
                width: 60px;
                height: 38px;
                right: 10px;
                top: 5px;
                padding-top: 2px;
                background-color: #36393E;
                color: #FFFFFF;
                text-align: center;
                cursor: pointer;
            }

            .startButton {
                margin-top: 12px;
            }
        `
    }

    handleStartClick(event) {
        if (this.startCallback) this.startCallback()
    }

    handleVoteClick(event) {
        if (this.startVoteCallback) this.startVoteCallback()
    }
    
    handleRestartClick(event) {
        if (this.startRestartCallback) this.startRestartCallback()
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

    toggleHidden() {
        this.hiddenRoles = !this.hiddenRoles
    }
    
    render() {
        return html`
            <div class='topBar' style='height:${this.hiddenRoles ? '46px' : '690px'}'>
                ${ this.status == 'preGame' ? html`
                        ${ !this.hiddenRoles ? html`<selection-grid id='selectedGrid' .selected=${this.deckIds} @clicked=${ this.handleSelectionClick }></selection-grid>`: ''}
                        <cta-button class='startButton' text='START GAME' @click=${ this.handleStartClick }></cta-button>
                        <div class='cornerButton' @click=${ this.toggleHidden }>${this.hiddenRoles ? 'SELECT\nROLES' : 'HIDE\nROLES'}</div>
                ` : this.status == 'voting' ? html`
                        <div class='cornerButton' @click=${ this.handleVoteClick }>VOTE\nNOW</div>
                ` : this.status == 'endGame' ? html`
                        <div class = cornerButton @click=${ this.handleRestartClick }>NEW\nGAME</div>
                ` : '' }
            </div>
        `
    }
}

customElements.define('host-controls', HostControls)
