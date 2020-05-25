import { LitElement, html, css} from 'lit-element'
import './BaseCard'

class BasePlayer extends LitElement {
    static get properties() {
        return {
            player: { type: Object },
            role: { type: String },
            votes: { type: Array },
            dead: { type: Boolean }
        }
    }

    static get styles() {
        return css`
        :host {
            display: inline-block;
            margin: 10px;
            vertical-align: top;
        }

        .name {
            width: 100px;
            height: 20px;
            margin-top: 5px;
            background-color: #36393E;
            color: #FFFFFF;
            display: block;
            text-align: center;
        }

        .votes {
            width: 100px;
            height: 20px;
            margin-top: 5px;
            background-color: #22DDDD;
            color: #000000;
            display: block;
            text-align: center;
        }
        `
    }

    constructor() {
        super()
        this.player = {}
        this.role = null
        this.votes = []
        this.dead = false
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: this.player.id }))
    }

    listVotes() {
        let str = ''
        this.votes.forEach(name => str = str.concat(name, ', '))
        return str.substring(0, str.length - 2)
    }

    render() {
        return html`
            <div id='basePlayer' style='background-color:${ this.dead ? '#FF0000' : '#777777' }'>
                <base-card .role=${ this.role } @clicked=${ this.handleClick }></base-card>
                <div class='name'>${ this.player.name }</div>
                ${ (this.votes.length > 0) ? html`<div class='votes'>${ this.listVotes() }</div>` : ''}
            </div>
        `
    }
}

customElements.define('base-player', BasePlayer)
