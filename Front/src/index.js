import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import http from 'http';
import Router from './router.js';
import CashRegisterController from './Controllers/cashRegisterController.js';

// Définir __dirname manuellement (car ES modules n'ont pas __dirname par défaut)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  {
    url: '/test',
    controller: CashRegisterController
  }
];

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/Styles')) {
    const filePath = path.join(__dirname, req.url); 
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Fichier non trouvé');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
    return;
  }
  const router = new Router(routes, req, res);
  router.run();
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
