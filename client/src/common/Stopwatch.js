function createWorker() {
    let fn = function(e) {
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
    }
    let blob = new Blob(['let interval = null; self.onmessage = ', fn.toString()], { type: 'text/javascript' })
    return new Worker(URL.createObjectURL(blob))
}

class Stopwatch {
    constructor() {
        this._worker = createWorker()
        this._worker.onmessage = (e) => {
            console.log('stopwatch received from worker:', e.data)
            if (this._callback) this._callback(e.data)
        }
    }

    start(callback) {
        this._callback = callback
        this._worker.postMessage('start')
    }

    stop() {
        this._worker.postMessage('stop')
    }
}

export default Stopwatch
