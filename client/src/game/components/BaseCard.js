import { LitElement, html, css} from 'lit-element'
import StaticRequestor from '../../common/StaticRequestor'

class BaseCard extends LitElement {
    static get properties() {
        return {
            role: { type: String },
            num: { type: Number}
        }
    }

    static get styles() {
        return css`
            :host {
                position: absolute;
                max-height: 100%;
                width: clamp(0px, 28.7vw, 124px);
            }
            img {
                display: block;
                margin: auto;
                width: 100%;
                object-fit: contain;
                cursor: pointer;
                z-index: 1;
            }
        `
    }

    constructor() {
        super()
        this.role = null
        this.num = null
    }

    animate(num) {
        let card = this
        let pos = 0
        let rightDelta = (num % 3 - this.num % 3) * 137
        let downDelta = (Math.floor(num / 3) - Math.floor(this.num / 3)) * 208
        let id = setInterval(() => {
            if ((pos >= Math.abs(rightDelta)) && (pos >= Math.abs(downDelta))) {
                clearInterval(id);
            } else {
                pos++;
                if (pos <= Math.abs(rightDelta)) {
                    if(Math.sign(rightDelta) == 1) {
                        card.style.left = 'min(' + pos + 'px, ' + pos/4.31496 + 'vw)'
                    } else {
                        card.style.left = 'max(' + -1*pos + 'px, ' + -1 * pos/4.31496 + 'vw)'
                    }
                }
                if (pos <= Math.abs(downDelta)) {
                    if(Math.sign(downDelta) == 1) {
                        card.style.top = 'min(' + pos + 'px, ' + pos/4.31496 + 'vw)'
                    } else {
                        card.style.top = 'max(' + -1*pos + 'px, ' + -1 * pos/4.31496 + 'vw)'
                    }
                }
            }
        }, 5)
    }

    deanimate() {
        this.style.left = '0px'
        this.style.top = '0px'
    }

    handleClick(event) {
        this.dispatchEvent(new Event('clicked'))
    }

    render() {
        return html`
            <img id='card' @click=${ this.handleClick } src=${ `${ StaticRequestor.basePath }/WerewolfImages/Werewolf/${ this.role || 'back' }.png` }></img>
        `
    }
}

customElements.define('base-card', BaseCard)
