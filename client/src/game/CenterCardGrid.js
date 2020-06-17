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
            width: 480px;
            height: 157px;
            margin: auto;
            display: flex;
            padding-left: 45px;
            padding-right: 145px;
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
            <div><base-card id=left @clicked=${ this.leftCardClicked }/></div>
            <div><base-card id=center @clicked=${ this.centerCardClicked }/></div>
            <div><base-card id=right @clicked=${ this.rightCardClicked }/></div>
        `
    }
}

customElements.define('center-card-grid', CenterCardGrid)
