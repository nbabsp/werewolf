import './Button.css'

class Button {
    constructor(text, onClick) {
        let button = document.createElement('div')
        button.className = 'startButton'
        button.appendChild(document.createTextNode(text))
        button.onclick = onClick
        
        this.element = document.createElement('div')
        this.element.appendChild(button)
    }
}

export default Button