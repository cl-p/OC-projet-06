const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// on demande au module http de node, de créer un server http 
const server = http.createServer(app);


// quand server http rencontre une erreur, il va appeler la fontion errorHandler
server.on('error', errorHandler);

// evenement listening --> server http est prêt à recevoir des requêtes http
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  //permet de savoir lorsque le server est prêt
  console.log('Listening on ' + bind);
});


// maintenant que le server http est configuré, que les evenements ont un callback, on demande au server d'écouter sur le port/ de réserver le port 3000
server.listen(port);
