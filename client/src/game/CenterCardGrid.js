import './CenterCardGrid.css'
import './BaseCard'
import { LitElement, html, css} from 'lit-element'
import './BasePlayer'

class CenterCardGrid extends LitElement {
    static get properties() {
        return {
        }
    }

    static get styles() {
        return css`
        :host {
            background-color: #444444;
            width: 480px;
            height: 157px;
            margin: auto;
            display: flex;
            padding-left: 45px;
            padding-right: 45px;
            padding-bottom: 10px;
            padding-top: 10px;
            box-sizing: border-box;
            justify-content: space-between;
        }
        `
    }

    constructor() {
        super()
    }

    exposeCard(id, role) {
        let baseCard = this.shadowRoot.getElementById(id)
        baseCard.role = role
    }

    cardClicked(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: event.detail }))
    }

    render() {
        return html`
            <div><base-card id=left @clicked=${ this.cardClicked }/></div>
            <div><base-card id=center @clicked=${ this.cardClicked }/></div>
            <div><base-card id=right @clicked=${ this.cardClicked }/></div>
        `
    }
}

customElements.define('center-card-grid', CenterCardGrid)
