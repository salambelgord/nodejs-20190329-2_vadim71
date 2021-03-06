const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  let readFile;
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
    
    readFile = fs.createReadStream(filepath);
    readFile.on("error", (err) => {
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('No supporting');
        }
    else  if (err.code === 'ENOENT' ){
       res.statusCode = 404;
       res.end('No such file or directory');
        } 
         
      else  {res.statusCode = 500;
      res.end('Something went wront');
      }
    });
    res.on("close", (err) => {
    readFile.destroy();
    });

    res.statusCode = 200;
    readFile.pipe(res);

    break;

  default:
    res.statusCode = 501;
    res.end('Not implemented');
}
});

module.exports = server;