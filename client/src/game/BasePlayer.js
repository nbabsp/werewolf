import { LitElement, html, css} from 'lit-element'
import './BaseCard'

let host = 'http://localhost:9615'

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
            height: 167px;
            width: 100px;

        }

        .name {
            width: 100px;
            height: 20px;
            margin-top: 5px;
            background-color: #36393E;
            color: #FFFFFF;
            display: block;
            text-align: center;
            position: relative;
        }

        .votes {
            width: 100px;
            height: 20px;
            margin-top: 5px;
            background-color: rgba(3, 3, 3, 0.5);
            color: #FFFFFF;
            display: block;
            text-align: center;
            top: 50px;
            position: absolute;
            z-index: 9;
        }
        
        .dead {
            width: 100px;
            height: 137px;
            z-index: 8;
            position: absolute;
        }

        .card {
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
            <div id='basePlayer' style='background-color:${ this.dead ? '#FF0000' : '#777777' };position:relative'>
                <div class='card'>    
                    <base-card .role=${ this.role } @clicked=${ this.handleClick }></base-card>
                    <div class='name'>${ this.player.name }</div>
                </div>
                ${ (this.votes.length > 0) ? html`<div class='votes'>${ this.listVotes() }</div>` : ''}
                ${ (this.dead) ? html`<img class='dead' src='${ host }/WerewolfImages/Werewolf/dead.png'></img>` : ''}
                </div>
        `
    }
}

customElements.define('base-player', BasePlayer)
