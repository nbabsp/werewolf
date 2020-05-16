import { LitElement, html, css} from 'lit-element'

class CTAButton extends LitElement {
    static get properties() {
        return {
            text: { type: String }
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
                width: 150px;
                height: 20px;
                padding-top: 2px;
                margin: 5px auto;
                background-color: #36393E;
                color: #FFFFFF;
                text-align: center;
                cursor: pointer;
            }
        `
    }

    constructor() {
        super()
        this.text = 'OK'
    }

    render() {
        return html`
            <div>${this.text}</div>
        `
    }
}

customElements.define('cta-button', CTAButton)
