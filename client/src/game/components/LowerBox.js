import { LitElement, html, css} from 'lit-element'
import './BaseCard.js'
import './DescriptionBox.js'
import './CountDownTimer'

class LowerBox extends LitElement {
    static get properties() {
        return {
            role: { type: String },
            time: { type: Number }
        }
    }

    static get styles() {
        return css`
        :host {
            display: flex;
            margin: auto;
            width: 100%;
            height: fit-content;
        }
        .infoBox {
            background-color: #555555;
            color: #FFFFFF;
            display: flex;
            flex-direction: column;
            position: relative;
            text-align: center;
            width: 75%;
            vertical-align: top;
            border-width: 1px;
            border-color: #000000;
            border-right-style: solid;
            box-sizing: border-box;
}
        .myCardWrapper {
            background-color: #555555;
            display: inline-block;
            height: 100%;
            max-height: 100%;
            width: 30%;
            padding: 1%;
            border-width: 1px;
            border-color: #000000;
            border-left-style: solid;
            box-sizing: border-box;
        }
        .card {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        `
    }

    constructor() {
        super()
        this.role = null
        this.time = null
        this.phase = null
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: event.detail }))
    }

    exposeCard(role) {
        let baseCard = this.shadowRoot.getElementById('lower')
        baseCard.role = role
    }

    changeDescription(role) {
        let description = this.shadowRoot.getElementById('description')
        description.role = role
    }

    changeTimerStatus(status) {
        let timer = this.shadowRoot.getElementById('timer')
        timer.status = status
    }

    render() {
        return html`
            <div class='infoBox'>
                <count-down-timer id='timer' time=${ this.time } @clicked=${ this.handleClick }></count-down-timer>
                <description-box id='description' role=${ this.role }></description-box>
            </div><div class='myCardWrapper'>
                        <div class='card'><base-card id='lower' .role=${ this.role }></base-card></div>
                  </div>
        `
    }
}

customElements.define('lower-box', LowerBox)
