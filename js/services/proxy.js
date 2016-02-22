'use strict';
const http = require('http');
const net = require('net');
const url = require('url');
const zlib = require('zlib');
const shttp = require('socks5-http-client');
const Socks = require('socks');
const config = require('../../config.json');

let _port ;
let _webContents;

let _synReply = (socket, code, reason, headers, cb) => {
    try {
        let statusLine = 'HTTP/1.1 ' + code + ' ' + reason + '\r\n';
        let headerLines = '';
        for (var key in headers) {
            headerLines += key + ': ' + headers[key] + '\r\n';
        }
        socket.write(statusLine + headerLines + '\r\n', 'UTF-8', cb);
    } catch (error) {
        cb(error);
    }
};

let requestRemote = (requestOptions, req, res, proxy) => {
    let resolveRes = (remoteResponse) => {
        // write out headers to handle redirects
        res.writeHead(remoteResponse.statusCode, '', remoteResponse.headers);

        let resObj = {
            'headers': remoteResponse.headers,
            'content-type': remoteResponse.headers['content-type'],
            'statusCode': remoteResponse.statusCode,
            'host': remoteResponse.socket._host,
            'path': remoteResponse.socket._httpMessage.path,
            'httpMessage': remoteResponse.socket._httpMessage
        };

        resObj.url = resObj.host + resObj.path;

        if(remoteResponse.headers['content-type'] && remoteResponse.headers['content-type'].indexOf('json') !== -1) {

            let body = [];
            remoteResponse.on('data',(chunk) => {  
                body.push(chunk);  
            });   
            remoteResponse.on('end',() => {
                let buffer = Buffer.concat(body);
                if(remoteResponse.headers['content-encoding'] && remoteResponse.headers['content-encoding'].indexOf('gzip') !== -1) {
                    zlib.gunzip(buffer, (err, dezipped) => {
                        try{
                            resObj.body = JSON.parse(dezipped.toString('utf-8'));
                        }catch (e) {
                            resObj.body = dezipped.toString('utf-8');
                        }
                        proxy.emit('beforeResponse', resObj);                      
                    });
                }else {
                    try{
                        resObj.body = JSON.parse(buffer.toString('utf-8'));
                    }catch (e) {
                        resObj.body = buffer.toString('utf-8');
                    }
                    proxy.emit('beforeResponse', resObj);
                }
            });

        }

        remoteResponse.pipe(res);
        res.pipe(remoteResponse);
    };

    let remoteRequest;
    if(config.agentType == '1') {
        requestOptions.socksHost = config.agentHost;
        requestOptions.socksPort = config.agentPort;
        remoteRequest= shttp.request(requestOptions, resolveRes);
    }else {
        remoteRequest= http.request(requestOptions, resolveRes);
    }
    
    remoteRequest.on('error', (e) => {
        proxy.emit('requestError', e, req, res);
        res.writeHead(502, 'Proxy fetch failed');
    });

    req.pipe(remoteRequest);

    res.on('close', function() {
        remoteRequest.abort();
    });
};

class Proxy {

    constructor(options) {
        this.port = options.port || 7777;
        this.onServerError = () => {};
        this.onBeforeRequest = (req) => {
            _webContents.send('HTTPData', 'req', req);
        };
        this.onBeforeResponse = (res) => {
            _webContents.send('HTTPData', 'res', res);
        };
        this.onRequestError = () => {};
    }

    start() {
        let server = http.createServer();

        server.on('request', this.requestHandler);
        server.on('connect', this.connectHandler);

        server.on('error', this.onServerError);
        server.on('beforeRequest', this.onBeforeRequest);
        server.on('beforeResponse', this.onBeforeResponse);
        server.on('requestError', this.onRequestError);

        server.listen(this.port);
        _port = this.port;
    }

    requestHandler(req, res) {
        try {
        
            let self = this; // this -> server
            let path = req.headers.path || url.parse(req.url).path;
            let requestOptions = {
                host: req.headers.host.split(':')[0],
                port: req.headers.host.split(':')[1] || 80,
                path: path,
                method: req.method,
                headers: req.headers
            };

            requestOptions.url = requestOptions.host + requestOptions.path;

            //check url
            if (requestOptions.host == '127.0.0.1' && requestOptions.port == _port) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.write('ok');
                res.end();
                return;
            }

            let reqObj = {};
            Object.assign(reqObj, requestOptions);
            var body = '';      
            req.on('data',function(chunk){  
                body += chunk;  
            });   
            req.on('end',function(){  
                reqObj.body = body;
                self.emit('beforeRequest', reqObj);
            });

            requestRemote(requestOptions, req, res, self);

        } catch (e) {
            console.log(`requestHandlerError + ${e.message}`);
        }
    }

    connectHandler(req, socket) {
        try {
            let self = this;

            let requestOptions = {
                host: req.url.split(':')[0],
                port: req.url.split(':')[1] || 443
            };

            if(config.agentType == '1') {
                let socksOptions = {
                    proxy: {
                        ipaddress: config.agentHost,
                        port: config.agentPort,
                        type: 5
                    },
                    target: {
                        host: requestOptions.host,  
                        port: requestOptions.port
                    }
                };

                Socks.createConnection(socksOptions, function(err, tunnel, info) {
                    if (err)
                        console.log(err);
                    else {
                        
                        _synReply(socket, 200, 'Connection established', {
                            'Connection': 'keep-alive'
                        },
                        function(error) {
                            if (error) {
                                console.log(`syn error: ${error.message}`);
                                tunnel.end();
                                socket.end();
                                return;
                            }
                            tunnel.resume();
                            tunnel.pipe(socket);
                            socket.pipe(tunnel);
                        });
                    }
                }); 
            }else {
                let ontargeterror = (e) => {
                    console.log(`${req.url} + Tunnel error: + ${e}`);
                    _synReply(socket, 502, 'Tunnel Error', {}, function() {
                        try {
                            socket.end();
                        }
                        catch(e) {
                            console.log(`end error + ${e.message}`);
                        }

                    });
                };

                let connectRemote = (requestOptions, socket) => {
                
                    let tunnel = net.createConnection(requestOptions, () => {
                        //format http protocol
                        _synReply(socket, 200, 'Connection established', {
                            'Connection': 'keep-alive'
                        },
                        function(error) {
                            if (error) {
                                console.log(`syn error: ${error.message}`);
                                tunnel.end();
                                socket.end();
                                return;
                            }
                            tunnel.pipe(socket);
                            socket.pipe(tunnel);
                        });
                    });

                    tunnel.setNoDelay(true);
                    tunnel.on('error', ontargeterror);
                    
                };

                connectRemote(requestOptions, socket);
            }

            self.emit('beforeRequest', requestOptions);

        } catch (e) {
            console.log(`connectHandler error: + ${e.message}`);
        }
    }

}

module.exports = {
    'init': function(options) {
        _webContents = options.webContents;
        var proxy = new Proxy({
            port: options.port
        });
        proxy.start();
    }
};