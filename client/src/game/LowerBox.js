import Timer from "./Timer";
import './LowerBox.css'

class LowerBox {
    constructor() {
        this.element = document.createElement('div')
        this.element.className = 'lowerBox'
    
        let infoBox = document.createElement('div')
        infoBox.className = 'infoBox'
    
        this.timer = new Timer()
    
        let descriptionBox = document.createElement('div')
        descriptionBox.className = 'description'
        this._description = document.createTextNode('')
        descriptionBox.appendChild(this._description)
        
        this.myCardWrapper = document.createElement('div')
        this.myCardWrapper.className = 'myCardWrapper'
    
        infoBox.appendChild(this.timer.element)
        infoBox.appendChild(descriptionBox)
    
        this.element.appendChild(infoBox)
        this.element.appendChild(this.myCardWrapper)
    }
    set description(description) {
        this._description.nodeValue = description
    }
    set card(card) {
        this.myCardWrapper.appendChild(card)
    }
    set time(time) {
        this.timer.time = time
    }
}
export default LowerBox