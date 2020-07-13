import '../components/TextGrabber'

let InputPopover = {
    getP: (instruction, action) => new Promise((resolve, reject) => {
        let grabber = document.createElement('text-grabber')
        grabber.instructionText = instruction
        grabber.buttonText = action
        grabber.onText = (name) => {
            grabber.remove()
            resolve(name)
        }
        document.body.appendChild(grabber)
    })
}

export default InputPopover