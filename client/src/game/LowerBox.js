import { LitElement, html, css} from 'lit-element'
import './BaseCard.js'
import './DescriptoinBox.js'
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
            display: block;
            margin: auto;
            width: 480px;
            height: 157px;
        }
        .infoBox {
            background-color: #555555;
            color: #FFFFFF;
            display: inline-block;
            position: relative;
            text-align: center;
            width: 360px;
            height: 100%;
            vertical-align: top;
        }
        .myCardWrapper {
            background-color: #555555;
            display: inline-block;
            margin: auto;
            padding: 10px;
            height: 157px;
            width: 120px;
            border-width: 1px;
            border-color: #000000;
            border-left-style: solid;
            box-sizing: border-box;
        }    
        `
    }

    constructor() {
        super()
        this.role = null
        this.time = null
    }

    render() {
        return html`
            <div class='infoBox'>
                <count-down-timer time=${ this.time }></count-down-timer>
                <description-box role=${ this.role }></description-box>
            </div><div class='myCardWrapper'>
                        <base-card .role=${ this.role }></base-card>
                  </div>
        `
    }
}

customElements.define('lower-box', LowerBox)
