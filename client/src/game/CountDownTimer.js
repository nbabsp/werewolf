import { LitElement, html, css} from 'lit-element'

class CountDownTimer extends LitElement {
    static get properties() {
        return {
            time: { type: Number }
        }
    }

    static get styles() {
        return css`
        :host {
            display: block;
            height: 50%;
            width: 100%;
            border-width: 1px;
            border-color: #000000;
            border-bottom-style: solid;
            border-right-style: solid;
            box-sizing: border-box;
            padding-top: 8%;
            font-size: 40px;
        }
        `
    }

    constructor() {
        super()
        this.time = null
    }

    render() {
        return html`
            <div style='color:${ !(this.time) || (this.time <=0) ? '#DD4040' : '#FFFFFF'};font-weight:${ !(this.time) || (this.time <=0) ? '800' : '400'}'>${ this.time ? `${Math.floor(this.time/60)}:${this.time%60>=10 ? this.time%60 : `0${this.time%60}`}` : '0:00' }</div>            
        `
    }
}

customElements.define('count-down-timer', CountDownTimer)
