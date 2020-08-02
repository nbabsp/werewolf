import { LitElement, html, css} from 'lit-element'
import StaticRequestor from '../../common/StaticRequestor'

class CardGrid extends LitElement {
    static get properties() {
        return {
            cards: { type: Array },
            role: { type: String },
            highlighted: { type: Boolean }
        }
    }

    static get styles() {
        return css`

        .token {
            position: relative;
            display: inline-block;
            margin: 5px;
            height: 50px;
            width: 50px;
            border-radius: 50%;
            background-position: center top;
            background-repeat: none;
            background-size: cover;
            box-shadow: 0px 0px 4px 3px #222222
        }

        .grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            background-color: #999999;
            border-style: solid;
            border-width: 2px;
            border-color: #aa4444;
        }
        `
    }

    constructor() {
        super()
        this.cards = []
        this.count = 0
        this.role = null
        this.highlighted = false
    }

    clearHilight() {
        let grid = this.shadowRoot.getElementById('grid')
        if(!grid) return
        let nodes = grid.childNodes
        for(let i=0; i < nodes.length; i++) {
            if (nodes[i].nodeName.toLowerCase() == 'div') {
                nodes[i].style.boxShadow = '0px 0px 4px 3px #222222'
            }
        }
    }

    render() {
        return html`
        <div id='grid' class='grid'>${this.cards.map( role => {
            return html`<div class='token' style=${ `background-image: url('${ StaticRequestor.basePath }/WerewolfImages/Werewolf/${ role }.png');box-shadow: 0px 0px 4px 3px ${ !this.highlighted && (role == this.role) ? '#55FF55;' : '#222222;'}${role == this.role ? this.highlighted = true : ''}`}></div>`
        })}</div>
        `
    }
}

customElements.define('card-grid', CardGrid)
