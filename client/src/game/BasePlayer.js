import { LitElement, html, css} from 'lit-element'
import './BaseCard'
import StaticRequestor from '../common/StaticRequestor'

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
        .basePlayer {
            position: relative;
            display: inline-block;
            vertical-align: top;
            width: 30%;
            margin-top: 2%;
            margin-bottom: 2%;
            margin-left: 1%;
            margin-right: 1%;
        }

        .name {
            width: 100%;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;margin-top: 5px;
            background-color: #36393E;
            color: #FFFFFF;
            position: relative;
        }

        .votes {
            width: 100%;
            background-color: rgba(3, 3, 3, 0.5);
            color: #FFFFFF;
            display: block;
            text-align: center;
            top: 34%;
            position: absolute;
            z-index: 8;
        }
        
        .dead {
            width: 100%;
            height: 84%;
            top: 0px;
            z-index: 7;
            position: absolute;
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
            <div id='basePlayer' class='basePlayer'>
                <base-card .role=${ this.role } @clicked=${ this.handleClick }></base-card>
                <div class='name'>${ this.player.name }</div>
                ${ (this.votes.length > 0) ? html`<div class='votes'>${ this.listVotes() }</div>` : ''}
                ${ (this.dead) ? html`<img class='dead' src='${ StaticRequestor.basePath }/WerewolfImages/Werewolf/dead.png'></img>` : ''}
            </div>
        `
    }
}

customElements.define('base-player', BasePlayer)
