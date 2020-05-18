import { LitElement, html, css } from 'lit-element'
import '../components/CTAButton'

class HostControls extends LitElement {

    constructor() {
        super()
        this.startCallback = null
    }

    static get styles() {
        return css`
            :host {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                box-shadow: 0px 0px 4px 2px #888888;
                padding: 2px;
                background-color: #FF7777;
                font-size: 14px;
                font-family: arial, sans-serif;
                font-weight: 100;
                line-height: 18px;
                color: #000000;
            }
        `
    }

    handleClick(event) {
        if (this.startCallback) this.startCallback()
    }

    render() {
        return html`
            <div>
                <cta-button text='START GAME' @click=${ this.handleClick }></cta-button>
            </div>
        `
    }
}

customElements.define('host-controls', HostControls)
