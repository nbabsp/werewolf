import './Timer.css'

class Timer {
    constructor() {
        this.timerText = document.createTextNode('')
        this.element = document.createElement('div')
        this.element.className = 'timer'
        this.element.appendChild(this.timerText)
    }
    set time(time) {
        if (!time) {
            this.timerText.nodeValue = ''
            return
        }
        this.timerText.nodeValue = `${Math.floor(time/60)}:${time%60>=10 ? time%60 : `0${time%60}`}`
        if(time <= 0) {
            this.element.style.color = '#DD4040'
            this.element.style.fontWeight = '800'
        }
    }
}

export default Timer
