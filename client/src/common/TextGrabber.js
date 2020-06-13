import { LitElement, html, css } from 'lit-element'
import './InputPopover'

class TextGrabber extends LitElement {
    static get properties() {
        return {
            name: { type: String },
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
        
        .grabberInput {
            display: block;
            width: 300px;
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
        this.onText = null
    }

    onClick() {
        let input = this.shadowRoot.getElementById('box')
        if (input.value && input.value.length <= 15) {
            this.onText(input.value)
        }
    }

    render() {
        return html`
            <div class='grabber'>
                <input type='text' id='box' class='grabberInput'></input>
                <div class='grabberButton' @click=${ this.onClick }>${ this.buttonText }</div>
            </div>
        `
    }
}

customElements.define('text-grabber', TextGrabber)

export default TextGrabber
