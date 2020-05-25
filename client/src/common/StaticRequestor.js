import Requestor from './Requestor'

let host = 'localhost'
let port = 9615

let StaticRequestor = {
    waitForStatusChangeP: (path, status, callback) => Requestor.waitForStatusChangeP(host, port, path, status, callback),
    getP: (path) => Requestor.getP(host, port, path),
    putP: (path, json) => Requestor.putP(host, port, path, json),
    postP: (path, json) => Requestor.postP(host, port, path, json)
}

export default StaticRequestor
