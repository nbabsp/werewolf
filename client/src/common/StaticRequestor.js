import Requestor from './Requestor'

let host = 'localhost'
let port = 9615

let StaticRequestor = {
    getP: (path) => Requestor.getP(host, port, path),
    putP: (path, json) => Requestor.putP(host, port, path, json),
    postP: (path, json) => Requestor.postP(host, port, path, json),
    eventSource: (path) => new EventSource(`http://${host}:${port}${path}`)
}

export default StaticRequestor
