import './InputPopover.css'

function createButton(text, onClick) {
    let button = document.createElement('div')
    button.className = 'grabberButton'
    button.appendChild(document.createTextNode(text))
    button.onclick = onClick
    return button
}

class TextGrabber {
    constructor(buttonText, onText) {
        let box = document.createElement("INPUT");
        box.className = 'grabberInput'
        box.setAttribute("type", "text");
        let button = createButton(buttonText, () => {
            if(box.value) onText(box.value)
        })
        this.element = document.createElement('div')
        this.element.className = 'grabber'
        this.element.appendChild(box)
        this.element.appendChild(button)
    }
}

let InputPopover = {
    getP: (action) => new Promise((resolve, reject) => {
        let grabber = new TextGrabber(action, (name) => {
            grabber.element.remove()
            resolve(name)
        })
        document.body.appendChild(grabber.element)
    })
}

export default InputPopover
