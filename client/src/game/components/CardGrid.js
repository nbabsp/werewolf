import { LitElement, html, css} from 'lit-element'
import StaticRequestor from '../../common/StaticRequestor'

class CardGrid extends LitElement {
    static get properties() {
        return {
            cards: { type: Array },
            count: { type: Number }
        }
    }

    static get styles() {
        return css`

        .token {
            position: relative;
            display: inline-block;
            cursor: pointer;
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

        .break {
            flex-basis: 100%;
            height: 0px;
        }

        .invisible {
            display: none;
        }
        `
    }

    constructor() {
        super()
        this.cards = []
        this.count = 0
    }

    render() {
        return html`
            <div class='grid'>${this.cards.map( role => {
                let rows = Math.ceil(this.cards.length / 6)
                let rowlength = Math.ceil(this.cards.length / rows)
                if (this.count <= rowlength) {
                    return html`<div class='token' style=${ `background-image: url('${ StaticRequestor.basePath }/WerewolfImages/Werewolf/${ role }.png'); `}></div>`
                } else {
                    return html`
                        <div class='token' style=${ `background-image: url('${ StaticRequestor.basePath }/WerewolfImages/Werewolf/${ role }.png');`}></div>
                        <div class=break></div>
                    `
                }
            })}</div>
        `
    }
}

customElements.define('card-grid', CardGrid)
