import { LitElement, html, css } from 'lit-element'

class SessionControls extends LitElement {
    static get properties() {
        return {
            name: { type: String },
            status: { type: String }
        }
    }

    constructor() {
        super()
        this.name = ''
        this.status = 'playing'
    }

    static get styles() {
        return css`
            .topBar {
                position: relative;
                display: block;
                width: 100%;
                max-width: 430px;
                margin: auto;
                height: 50px;
                padding: 2px;
                background-color: #9D7D71;
                font-size: 14px;
                font-family: arial, sans-serif;
                font-weight: 100;
            }

            .name {
                position: absolute;
                left: 0px;
                top: 0px;
                margin-left: 10px;
                line-height: 55px;
                color: #FFFFFF;
            }

            .cornerButton {
                position: absolute;
                width: 75px;
                height: 45px;
                right: 0px;
                top: 0px;
                margin: 5px;
                line-height: 22px;
                background-color: #36393E;
                color: #FFFFFF;
                text-align: center;
                cursor: pointer;
            }
        `
    }

    handleResetClick(event) {
        this.dispatchEvent(new Event('reset'))
    }
    
    render() {
        if(this.status != 'playing') {
            return html`
                <div class='topBar'>
                    <div class='name'>${ this.name }</div>
                    <div class='cornerButton' @click=${ this.handleResetClick }>RETURN\nTO LOBBY</div>
                </div>
            `
        }
    }
}

customElements.define('session-controls', SessionControls)
