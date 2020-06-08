import { LitElement, html, css} from 'lit-element'
import StaticRequestor from '../common/StaticRequestor'

class SelectCard extends LitElement {
    static get properties() {
        return {
            id: { type: String },
            role: { type: String },
            selected: { type: Boolean }
        }
    }

    static get styles() {
        return css`
            .wrapper {
                display: inline-block;
                margin: auto;
                object-fit: contain;
                cursor: pointer;
                margin: 10px;
                height: 137px;
                width: 100px;
            }

            img {
                height: 137px;
                width: 100px;
                z-index: 1;
                position: absolute;
            }

            .selected {
                width: 100px;
                height: 137px;
                z-index: 8;
                position: absolute;
            }

            .card {
                postion: absolute;
            }
        `
    }

    constructor() {
        super()
        this.id = null
        this.role = null
        this.selected = false
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: {id: this.id, role: this.role} }))
    }

    render() {
        return html`
            <div class='wrapper' @click=${ this.handleClick }>
                <div class='card'>
                    <img src=${ `${ StaticRequestor.basePath }/WerewolfImages/Werewolf/${ this.role || 'back' }.png` }></img>
                </div>
                ${ (this.selected) ? html`<img class='selected' style='opacity:0.9' src='${ StaticRequestor.basePath }/WerewolfImages/Werewolf/check.png'></img>` : ''}
            </div>
        `
    }
}

customElements.define('select-card', SelectCard)
