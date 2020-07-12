import { LitElement, html, css} from 'lit-element'

class CountDownTimer extends LitElement {
    static get properties() {
        return {
            time: { type: Number },
            status: { type: String },
        }
    }

    static get styles() {
        return css`
        :host {
            display: flex;
            height: 50%;
            width: 100%;
            border-width: 1px;
            border-color: #000000;
            border-bottom-style: solid;
            border-right-style: solid;
            box-sizing: border-box;
            align-items: center;
            justify-content: center;
            font-size: 35px;
            line-height: 35px;
            cursor: pointer;
        }
        `
    }

    constructor() {
        super()
        this.time = null
        this.status = 'preparing'
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: 'ready' }))
    }

    render() {
        return html`
            <div @click=${ this.handleClick } style='color:${ (this.status == 'preparing') ? '#00FF00' : (this.status == 'waiting') ? '#0000FF' : (this.time <=0) ? '#DD4040' : '#FFFFFF'};font-weight:${ !(this.time) || (this.time <=0) ? '800' : '400'}'>${ this.status == 'preparing' ? 'CLICK TO START' : (this.status == 'waiting') ? 'WAITING...' : (this.time) ? `${Math.floor(this.time/60)}:${this.time%60>=10 ? this.time%60 : `0${this.time%60}`}` : ''}</div>            
        `
    }
}

customElements.define('count-down-timer', CountDownTimer)
