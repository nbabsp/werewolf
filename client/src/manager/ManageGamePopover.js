import Button from '../common/Button'
import './ManageGamePopover.css'

class GameManager {
    constructor(callback) {
        let endButton = new Button('END GAME', () => callback())
        this.element = document.createElement('div')
        this.element.className = 'gameManager'
        this.element.appendChild(endButton.element)
    }
}

let ManageGamePopover = {
    manageP: () => new Promise((resolve, reject) => {
        let manager = new GameManager(() => {
            manager.element.remove()
            resolve()
        })
        document.body.appendChild(manager.element)
    })
}

export default ManageGamePopover
