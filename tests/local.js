const config = require('./../config'),
      HTTP = require('http'),
      Express = require('express'),
      Cors = require('cors'),
      commandLineArgs = require('command-line-args'),
      UninjectedRoutes = require('./../routes/index'),
      { promisify } = require('util');

const Redis = require('redis'),
      client = Redis.createClient();
client.zrangebyscoreAsync = promisify(client.zrangebyscore).bind(client);

const optionDefinitions = [
  { name: 'port', alias: 'p', type: Number }
];
const options = commandLineArgs(optionDefinitions);
const port = options.port || config.connectionProxy.port || 8080;

const app = Express();
app.use(Cors());

const routes = new UninjectedRoutes(client, () => "localhost");
app.get('/public', routes.getPublic.bind(routes));

const server = HTTP.createServer(app);
client.on('connect', () => {
  server.listen(port, () => console.log(`API running on localhost:${port}`));
});

client.on('error', err => {
  console.log('Something went wrong:', err);
});
