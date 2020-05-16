import { LitElement, html, css} from 'lit-element'

class NameList extends LitElement {
    static get properties() {
        return {
            names: { type: Array }
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
                width: 450px;
                padding-top: 5px;
                padding-bottom: 5px;
                margin: 0 auto;
                text-align: center;
            }

            .item {
                background-color: #EEEEEE;
                display: block;
                width: 100%;
                height: 20px;
                padding-top: 2px;
                margin: 2px auto;
                text-align: center;
            }
        `
    }

    constructor() {
        super()
        this.names = []
    }

    render() {
        return html`
            <div>${this.names.map(item => html`<div class='item'>${item}</div>`)}</div>
        `
    }
}

customElements.define('name-list', NameList)
