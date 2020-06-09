import { LitElement, html, css} from 'lit-element'

class RestartButton extends LitElement {
    static get properties() {
        return {
            hidden: { type: Boolean }
        }
    }

    static get styles() {
        return css`
        .button {
            position: absolute;
            width: 80px;
            height: 38px;
            right: 10px;
            top: 51px;
            padding-top: 2px;
            background-color: #36393E;
            color: #FFFFFF;
            text-align: center;
            cursor: pointer;
        }
        `
    }

    constructor() {
        super()
        this.hidden = true
    }

    handleClick(event) {
        this.dispatchEvent(new Event('clicked'))
    }

    render() {
        return html`
            ${ !this.hidden ? html`<div class='button' @click=${ this.handleClick }>RETURN TO\nLOBBY</div>` : '' }
        `
    }
}

customElements.define('restart-button', RestartButton)
