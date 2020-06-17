import './ErrorDisplay'

let ErrorPopup = {
    post: (instruction) => new Promise((resolve, reject) => {
        let display = document.createElement('error-display')
        display.instructionText = instruction
        display.onClick = () => {
            display.remove()
            resolve()
        }
        document.body.appendChild(display)
    })
}

export default ErrorPopup