import './BaseCard'
import { LitElement, html, css} from 'lit-element'

class CenterCardGrid extends LitElement {
    static get properties() {
        return {
        }
    }

    static get styles() {
        return css`
        :host {
            background-color: #444444;
            width: 100%;
            display: flex;
            padding: 2%;
            box-sizing: border-box;
            justify-content: space-between;
        }
        .card {
            width: 30%;
            height: fit-content;
            margin: 2%;
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
            <div class='card'><base-card id=left @clicked=${ this.leftCardClicked }/></div>
            <div class='card'><base-card id=center @clicked=${ this.centerCardClicked }/></div>
            <div class='card'><base-card id=right @clicked=${ this.rightCardClicked }/></div>
        `
    }
}

customElements.define('center-card-grid', CenterCardGrid)
