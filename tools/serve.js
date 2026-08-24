const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'site');
const PORT = process.env.PORT || 8788;   // the harness assigns PORT; 8788 when run by hand
const TYPES = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.json':'application/json','.svg':'image/svg+xml','.png':'image/png'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('404'); return; }
    res.writeHead(200, {'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream'});
    res.end(buf);
  });
}).listen(PORT, () => console.log('serving site on http://localhost:' + PORT));
