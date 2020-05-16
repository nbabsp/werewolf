const http = require('http')

let _toJSON = (body) => {
    if (body.byteLength == 0) {
        return
    }
    let decoder = new TextDecoder('utf-8')
    return JSON.parse(decoder.decode(body))
}

let _onEnd = (res, body, resolve, reject) => {
    if (res.statusCode < 200 || res.statusCode > 299) {
        reject({
            statusCode: res.statusCode,
            error: _toJSON(body)
        })
    }
    else {
        resolve(res.headers['content-type'] == 'application/json' ? _toJSON(body) : body)
    }
}

let _requestP = (options, data) => new Promise((resolve, reject) => {
    http.request(options, (res) => {
        let chunks = []
        res.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
        res.on('end', () => _onEnd(res, Buffer.concat(chunks), resolve, reject))
    }).on('error', reject).end(data)
})

let _authRequestP = function(host, port, method, path, headers, data) {
    headers = Object.assign({}, headers)
    let options = {
        method: method,
        protocol: 'http:',
        host: host,
        port: port,
        path: path,
        headers: headers
    }
    return _requestP(options, data)
}

let _sendJSONP = function(host, port, method, path, json) {
    let data = JSON.stringify(json)
    let headers = {
        'Content-Type': 'application/json'
    }
    return _authRequestP(host, port, method, path, headers, data)
}

let Requestor = {
    waitForStatusChangeP: async (host, port, path, status, callback) => {
        async function _waitP(sec) {
            if(sec < 1) {
                return Promise.reject("Time must be greater than 1 second")
            }
            console.log('waiting...')
            return new Promise(resolve => setTimeout(resolve, sec*1000))
        }
        let response = await _authRequestP(host, port, 'GET', path, {})
        if (callback) callback(response)
        while(response.status == status) {
            await _waitP(1)
            response = await _authRequestP(host, port, 'GET', path, {})
            if (callback) callback(response)
        }
        return response
    },
    getP: (host, port, path) => _authRequestP(host, port, 'GET', path, {}),
    putP: (host, port, path, json) => _sendJSONP(host, port, 'PUT', path, json),
    postP: (host, port, path, json) => _sendJSONP(host, port, 'POST', path, json),
}

export default Requestor