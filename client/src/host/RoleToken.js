import { LitElement, html, css} from 'lit-element'
import StaticRequestor from '../common/StaticRequestor'

class RoleToken extends LitElement {
    static get properties() {
        return {
            id: { type: String },
            role: { type: String },
            selected: { type: Boolean }
        }
    }

    static get styles() {
        return css`
            .token {
                position: relative;
                display: inline-block;
                cursor: pointer;
                margin: 5px;
                height: 50px;
                width: 50px;
                border-radius: 50%;
                background-position: center top;
                background-repeat: none;
                background-size: cover;
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
        <div class='token' @click=${ this.handleClick } style=${ `background-image: url('${ StaticRequestor.basePath }/WerewolfImages/Werewolf/${ this.role }.png'); box-shadow: 0px 0px 4px 3px ${ this.selected ? '#ff0000' : '#222222' };` }/>
        `
    }
}

customElements.define('role-token', RoleToken)
