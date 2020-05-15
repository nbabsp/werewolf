import CardView from './CardView'

class PlayerView {
    constructor(name, onClick) {
        this.element = document.createElement('div')
        this.element.style.display = `inline-block`;
        this.element.style.margin = '10px'
        this.element.onclick = onClick
        this._cardWrapper = document.createElement('div')
        this._cardWrapper.style.paddingBottom = '3px'

        this.cardView = new CardView(100)
        this._cardWrapper.appendChild(this.cardView.element)

        let text = document.createElement('div')
        text.className = 'nameLabel'
        text.appendChild(document.createTextNode(name))

        this.element.appendChild(this._cardWrapper)
        this.element.appendChild(text)
    }

    set role(role) {
        this.cardView.role = role
    }
}

export default PlayerView