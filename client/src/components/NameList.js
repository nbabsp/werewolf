import { LitElement, html, css} from 'lit-element'

class NameList extends LitElement {
    static get properties() {
        return {
            names: { type: Array },
            playerList: { type: Object }
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
                width: 100%;
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
        this.playerList = {}
    }

    render() {
        return html`
            <div>${Object.keys(this.playerList).map(name => html`
                <div class='item' style=background-color:${ this.playerList[name] ? '#CCEEAA' : '#EEBAAA' }>${name}</div>
            `)}</div>
        `
    }
}

customElements.define('name-list', NameList)
