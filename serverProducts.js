const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const products = [
  { id: 1, name: 'Keyboard', price: 30, company: 'Logic' },
  { id: 2, name: 'Mouse', price: 15, company: 'Master' },
  { id: 3, name: 'Monitor', price: 120, company: 'Acer' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log('URL:', req.url);
  console.log('Pathname:', pathname);
  console.log('Query:', query);

  let productId = null;

  // طريقة 1: باستخدام query string مثل /product?id=1
  if (pathname === '/product' && query.id) {
    productId = parseInt(query.id);
  }

  // طريقة 2: باستخدام المسار الديناميكي مثل /product/1
  else if (pathname.startsWith('/product/')) {
    const parts = pathname.split('/');
    productId = parseInt(parts[2]);
  }

  if (productId !== null) {
    const product = products.find(p => p.id === productId);

    if (product) {
      const filePath = path.join(__dirname, 'templates', 'products.html');

      fs.readFile(filePath, 'utf8', (err, html) => {
        if (err) {
          console.error('Error reading template:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error loading template');
          return;
        }

        const output = html
          .replace(/{{name}}/g, product.name)
          .replace(/{{price}}/g, product.price)
          .replace(/{{company}}/g, product.company);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(output);
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Product not found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
