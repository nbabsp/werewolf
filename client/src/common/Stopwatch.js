class Stopwatch {
    constructor() {
        this.callback = null
        this.myWorker = this.createWorker( (e) => {
            if (e.data == 'start') {
                clearInterval(interval)
                let d0 = (new Date()).valueOf()
                interval = setInterval( () => { 
                    let d = (new Date()).valueOf()
                    let diff = d - d0
                    let count = Math.floor(diff/1000)
                    self.postMessage(count)
                }, 100)
            }
            if (e.data == 'stop') {
                clearInterval(interval)
            }
        })

        this.myWorker.onmessage = (e) => {
            console.log('received', e.data)
            this.callback(e.data)
        }
    }

    createWorker(fn) {
        let blob = new Blob(['let interval = null;self.onmessage = ', fn.toString()], { type: 'text/javascript' })
        return new Worker(URL.createObjectURL(blob))
    }

    start(cb) {
        this.callback = cb
        this.myWorker.postMessage('start')
    }

    stop() {
        this.myWorker.postMessage('stop')
    }
}

export default Stopwatch
