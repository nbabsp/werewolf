import './TextGrabber'

let InputPopover = {
    getP: (action) => new Promise((resolve, reject) => {
        let grabber = document.createElement('text-grabber')
        grabber.buttonText = action
        grabber.onText = (name) => {
            grabber.remove()
            resolve(name)
        }
        document.body.appendChild(grabber)
    })
}

export default InputPopover