let host = 'http://localhost:9615'
class CardView {
    constructor(width) {
        this.back = `${host}/WerewolfImages/Werewolf/back.png`
        this.element = document.createElement('img') 
        this.element.src = this.back
        this.element.style.width = `${width}px`
        this.element.style.height = `${width/400*548}px` 
        this.element.style.display = 'block'
    }

    set role(role) {
        if(role) {
            this.element.src = `${host}/WerewolfImages/Werewolf/${role}.png`
        } else {
            this.element.src = this.back
        }
    }

}

export default CardView