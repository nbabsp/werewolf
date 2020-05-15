import './CenterCardGrid.css'
import CardView from './CardView'

let host = 'http://localhost:9615'


class CardGrid {
    constructor(game, interaction) {
        this.element = document.createElement('div')
        this.element.className = 'centerCardGrid'

        let wrapper = document.createElement('div')
        wrapper.className = 'centerCard'
        wrapper.onclick = () => interaction.onClick('left')
        let leftCardView = new CardView(100)
        game.observeRole('left', (role) => leftCardView.role = role)
        wrapper.appendChild(leftCardView.element)
        this.element.appendChild(wrapper)

        wrapper = document.createElement('div')
        wrapper.className = 'centerCard'
        wrapper.onclick = () => interaction.onClick('center')
        let centerCardView = new CardView(100)
        game.observeRole('center', (role) => centerCardView.role = role)
        wrapper.appendChild(centerCardView.element)
        this.element.appendChild(wrapper)

        wrapper = document.createElement('div')
        wrapper.className = 'centerCard'
        wrapper.onclick = () => interaction.onClick('right')
        let rightCardView = new CardView(100)
        game.observeRole('right', (role) => rightCardView.role = role)
        wrapper.appendChild(rightCardView.element)
        this.element.appendChild(wrapper)
    }
}

export default CardGrid