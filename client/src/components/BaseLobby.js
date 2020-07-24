import { LitElement, html, css } from 'lit-element'
import './NameList'

class BaseLobby extends LitElement {
    static get properties() {
        return {
            name: { type: String }
        }
    }

    static get styles() {
        return css`
            .lobby {
                box-sizing: border-box;
                padding-top: 200px;
                width: 100%;
                height: 100%;
                background-color: #dddddd;
                font-size: 14px;
                font-family: arial, sans-serif;
                font-weight: 100;
                line-height: 18px;
                color: #000000;
            }

            .name {
                background-color: #EEEEEE;
                display: block;
                width: 100%;
                height: 20px;
                padding-top: 2px;
                margin: 2px auto;
                text-align: center;
            }
        `
    }

    constructor() {
        super()
        this.name = 'Untitled Game'
    }

    set players(players) {
        let playerList = {}
        players.forEach(player => {
            playerList[player.name] = player.active
        })
        let nameList = this.shadowRoot.getElementById('lobby-names')
        if (nameList) nameList.playerList = playerList
    }

    render() {
        return html`
            <div class='lobby'>
                <div class='name'>${ this.name }</div>
                <name-list id='lobby-names'></name-list>
            </div>
        `
    }
}

customElements.define('base-lobby', BaseLobby)

export default BaseLobby
