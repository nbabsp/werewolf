import { LitElement, html, css } from 'lit-element'
import ErrorPopup from './ErrorPopup'

class TextGrabber extends LitElement {
    static get properties() {
        return {
            buttonText: { type: String },
            instructionText: { type: String },
            onText: { type: Function }
        }
    }

    static get styles() {
        return css`
        .grabber {
            box-sizing: border-box;
            padding-top: 20%;
            width: 80%;
            height: 80%;
            margin: 10%;
            background-color: #dddddd;
            font-size: 14px;
            font-family: arial, sans-serif;
            font-weight: 100;
            line-height: 18px;
            color: #000000;
        }

        .grabberInstruction {
            display: block;
            width: 100%;
            height: 20px;
            padding-top: 2px;
            margin: 0 auto;
            background-color: #EEEEEE;
            color: #000000;
            text-align: center;
        }

        .grabberInput {
            display: block;
            width: 100%;
            margin: 20px auto 20px auto;
        }
        
        .grabberButton {
            display: block;
            width: 150px;
            height: 20px;
            padding-top: 2px;
            margin: 0 auto;
            background-color: #36393E;
            color: #FFFFFF;
            text-align: center;
            cursor: pointer;
        }
        `
    }

    constructor() {
        super()
        this.buttonText = ''
        this.instructionText = ''
        this.onText = null
    }

    firstUpdated(changedProperties) {
        let input = this.shadowRoot.getElementById('box')
        input.focus()
        let button = this.shadowRoot.getElementById('btn')
        input.addEventListener("keyup", function(event) {
            if (event.keyCode == 13) button.click()
        })    
    }

    onClick() {
        let input = this.shadowRoot.getElementById('box')
        if (input.value) {
            this.onText(input.value)
        } else {
            ErrorPopup.post('Input a name')
        }
    }

      
    render() {
        return html`
            <div class='grabber'>
                <div class='grabberInstruction'>${ this.instructionText }</div>
                <input type='text' id='box' maxlength='15' class='grabberInput'></input>
                <div class='grabberButton' id='btn' @click=${ this.onClick }>${ this.buttonText }</div>
            </div>
        `
    }
}

customElements.define('text-grabber', TextGrabber)

export default TextGrabber
