import './BaseCard'
import { LitElement, html, css} from 'lit-element'

class CenterCardGrid extends LitElement {
    static get properties() {
        return {
            num: { type: Number }
        }
    }

    static get styles() {
        return css`
        :host {
            background-color: #444444;
            width: 100%;
            display: flex;
            padding-left: 2%;
            padding-right: 2%;
            box-sizing: border-box;
            justify-content: space-between;
        }
        .card {
            width: 30%;
            height: fit-content;
            margin: 1.5%;
            position: relative;
            height: clamp(0px, 39.1vw, 169px);
        }
        `
    }

    constructor() {
        super()
        this.num = null
    }

    exposeCard(id, role) {
        let baseCard = this.shadowRoot.getElementById(id)
        baseCard.role = role
    }

    leftCardClicked(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: 'left' }))
    }
    centerCardClicked(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: 'center' }))
    }
    rightCardClicked(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: 'right' }))
    }

    render() {
        return html`
            <div class='card'><base-card id=left .num=${ this.num } @clicked=${ this.leftCardClicked }/></div>
            <div class='card'><base-card id=center .num=${ this.num + 1 } @clicked=${ this.centerCardClicked }/></div>
            <div class='card'><base-card id=right .num=${ this.num + 2 } @clicked=${ this.rightCardClicked }/></div>
        `
    }
}

customElements.define('center-card-grid', CenterCardGrid)
