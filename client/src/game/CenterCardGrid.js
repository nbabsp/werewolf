import './CenterCardGrid.css'
import './BaseCard'

let host = 'http://localhost:9615'


class CardGrid {
    constructor(game, interaction) {
        this.element = document.createElement('div')
        this.element.className = 'centerCardGrid'

        let wrapper = document.createElement('div')
        wrapper.className = 'centerCard'
        wrapper.onclick = () => interaction.onClick('left')
        let leftCard = document.createElement('base-card')
        game.observeRole('left', (role) => leftCard.role = role)
        wrapper.appendChild(leftCard)
        this.element.appendChild(wrapper)

        wrapper = document.createElement('div')
        wrapper.className = 'centerCard'
        wrapper.onclick = () => interaction.onClick('center')
        let centerCard = document.createElement('base-card')
        game.observeRole('center', (role) => centerCard.role = role)
        wrapper.appendChild(centerCard)
        this.element.appendChild(wrapper)

        wrapper = document.createElement('div')
        wrapper.className = 'centerCard'
        wrapper.onclick = () => interaction.onClick('right')
        let rightCard = document.createElement('base-card')
        game.observeRole('right', (role) => rightCard.role = role)
        wrapper.appendChild(rightCard)
        this.element.appendChild(wrapper)
    }
}

export default CardGrid