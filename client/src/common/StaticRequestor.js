import Requestor from './Requestor'

let protocol = (process.env.HOST == 'local') ? 'http' : 'https'
let host = (process.env.HOST == 'local') ? 'localhost' : 'werewolf.invades.space'
let port = (process.env.HOST == 'local') ? 9615 : 443
// let protocol = 'https'
// let host = 'werewolf.invades.space'
// let port = 443
// let protocol = 'http'
// let host = 'localhost'
// let port = 9615

let StaticRequestor = {
    getP: (path) => Requestor.getP(host, port, path),
    putP: (path, json) => Requestor.putP(host, port, path, json),
    postP: (path, json) => Requestor.postP(host, port, path, json),
    eventSource: (path) => new EventSource(`${protocol}://${host}:${port}${path}`),
    basePath: `${protocol}://${host}:${port}`
}

export default StaticRequestor
