import { LitElement, html, css} from 'lit-element'

let descriptions = {
    werewolf: 'Look for other Werewolves',
    loneWerewolf: 'Look at a center card',
    minion: 'Look for the Werewolves',
    mason: 'Look for other Masons',
    seer: 'Look at another player\'s card or two center cards',
    robber: 'Swap your card with another player\'s card',
    troublemaker: 'Swap two other player\'s cards',
    drunk: 'Swap your card with one of the center cards',
    insomniac: 'Look at your card at the end of the night phase',
    villager: 'Listen carefully',
    hunter: 'Do nothing at night. If you die, who ever you point at also dies.',
    tanner: 'Don\'t die... or well... do die',
    discussion: 'Discuss the night phase',
    blank: ''
}

class InfoBar extends LitElement {
    static get properties() {
        return {
            role: { type: String },
            time: { type: Number },
            status: { type: String }
        }
    }

    static get styles() {
        return css`
        .host {
            display: block;
            position: relative;
            width: 100%;
            background-color: #9D7D71;
            height: 50px;
            color: #FFFFFF;
            text-align: center;
        }
        
        .bar {
            display: flex;
            justify-content: space-between;
        }

        .btn {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 42px;
            line-height: 21px;
            right: 0px;
            top: 0px;
            margin: 5px;
            line-height: 22px;
            background-color: #36393E;
            color: #FFFFFF;
            text-align: center;
            cursor: pointer;
        }

        .description {
            display: flex;
            align-items: center;
            margin: auto;
        }

        .timer {
            font-size: clamp(10px, 10vw, 40px);
            line-height: clamp(10px, 9vw, 40px);
            margin: 5px;
        }
        `
    }

    constructor() {
        super()
        this.role = null
        this.time = null
        this.status = 'preparing'
    }

    handleClick(event) {
        this.dispatchEvent(new CustomEvent('clicked', { detail: 'timerClick' }))
    }

    changeDescription(role) {
        this.role = role
    }

    changeStatus(status) {
        this.status = status
    }

    render() {
        if (this.status != 'rejoining') { 
            return html`
                <div class='host'>
                    <div class='bar'>
                        <div class='description'>${ descriptions[this.role || 'blank'] }</div>
                        <div class='timer'
                            style='color:${(this.time <=0) ? '#DD4040' : '#39C68B' };
                            font-weight:${!(this.time) || (this.time <=0) ? '800' : '400'}'>
                            ${ (this.time) ? `${Math.floor(this.time/60)}:${this.time%60>=10 ? this.time%60 : `0${this.time%60}`}` : '0:00'}
                        </div>            
                    </div>
                    ${  this.status == 'preparing' ? html`<div class='btn' @click=${ this.handleClick }>READY TO START</div>` : 
                        this.status == 'waiting' ? html`<div class='btn' @click=${ this.handleClick }>WAITING</div>` : ''
                    }
                </div>
            `
        }
    }
}

customElements.define('info-bar', InfoBar)
