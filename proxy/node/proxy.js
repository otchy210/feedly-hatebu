const http = require('http');
const https = require('https');

const writeError = (res, status, message) => {
    res.writeHead(status);
    res.end(message);
}

const errorMethodNotAllowed = (res) => {
    writeError(res, 405, 'Method Not Allowed');
}

const errorBadRequest = (res) => {
    writeError(res, 400, 'Bad Request');
}

const errorInternalServerError = (res) => {
    writeError(res, 500, 'Internal Server Error');
}

const parseUrlParams = (url) => {
    if (!url) {
        return {};
    }
    const index = url.indexOf('?');
    if (index < 0) {
        return {};
    }
    const substr = url.slice(index + 1);
    return substr.split('&').map(param => param.split('=')).reduce((prev, [key, value]) => {
        prev[key] = value || null;
        return prev;
    }, {});
}

const server = http.createServer((req, res) => {
    if (req.method !== 'GET') {
        errorMethodNotAllowed(res);
        return;
    }
    const params = parseUrlParams(req.url);
    const targetUrl = params.url;
    if (!targetUrl) {
        errorBadRequest(res);
        return;
    }
    https.get(`https://b.hatena.ne.jp/entry/jsonlite/?url=${targetUrl}`, (resp) => { 
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
            res.end(data);
        }); 
    }).on('error', (err) => {
        console.error(err);
        errorInternalServerError();
    });
});
server.listen(8102);
console.log('Proxy server is running on "http://localhost:8102"');
