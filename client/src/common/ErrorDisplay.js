import { LitElement, html, css } from 'lit-element'

class ErrorDisplay extends LitElement {
    static get properties() {
        return {
            instructionText: { type: String },
            onClick: { type: Function }
        }
    }

    static get styles() {
        return css`
        .popup {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 20%;
            margin-bottom: 0px;
            background-color: #886666;
            font-size: 24px;
            font-family: arial, sans-serif;
            font-weight: 100;
            line-height: 18px;
            color: #FFFFFF;
        }

        .grabberInstruction {
            display: block;
            width: 100%;
            height: 20px;
            padding-top: 2px;
            margin: 11% auto;
            color: #FFFFFF;
            text-align: center;
        }
        
        .grabberButton {
            display: block;
            width: 50px;
            height: 40px;
            padding-top: 2px;
            float: right;
            background-color: #36393E;
            color: #FF0000;
            font-size: 34px;
            text-align: center;
            vertical-align: middle;
            line-height: 40px;
            cursor: pointer;
        }
        `
    }

    constructor() {
        super()
        this.instructionText = ''
        this.onClick = null
    }

    onClick() {
        let input = this.shadowRoot.getElementById('box')
        if (input.value && input.value.length <= 15) {
            this.onText(input.value)
        }
    }

      
    render() {
        return html`
            <div class='popup'>
                <div class='grabberButton' id='btn' @click=${ this.onClick }>X</div>
                <div class='grabberInstruction'>${ this.instructionText }</div>
            </div>
        `
    }
}

customElements.define('error-display', ErrorDisplay)

export default ErrorDisplay
