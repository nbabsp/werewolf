import Requestor from './Requestor'

let protocol = 'http'
let host = 'localhost'
let port = 9615

let StaticRequestor = {
    getP: (path) => Requestor.getP(host, port, path),
    putP: (path, json) => Requestor.putP(host, port, path, json),
    postP: (path, json) => Requestor.postP(host, port, path, json),
    eventSource: (path) => new EventSource(`${protocol}://${host}:${port}${path}`),
    basePath: `${protocol}://${host}:${port}`
}

export default StaticRequestor
