var http = require('http')

http.createServer(function(req, res){
    console.log('req', req.method, req.url)
    res.writeHead(200, {"Content-Type": "text/plain"});  
    res.write(`Hello World1`);  
    res.write(`\n\rmethod:${req.method}\n\rurl:${req.url}`);  
    res.end();
}).listen('8080')