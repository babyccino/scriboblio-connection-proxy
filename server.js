const config = require('./config'),
      HTTP = require('http'),
      Express = require('express'),
      Cors = require('cors'),
      EC2 = require('aws-sdk/clients/ec2'),
      commandLineArgs = require('command-line-args'),
      { promisify } = require('util');

const Redis = require('redis'),
      client = Redis.createClient(/* config.redis.port, config.redis.ip */);
client.zrangebyscoreAsync = promisify(client.zrangebyscore).bind(client);

const app = Express();
app.use(Cors());
const ec2Options = {
  /*
  accessKeyId:,
  secretAccessKey:,
  credentials
  */
};
const ec2 = new EC2(options);

const UninjectedRoutes = require('./routes/index'),
      routes = new UninjectedRoutes(client, ec2);

app.get('/public', routes.getPublic.bind(routes));

const server = HTTP.createServer(app);


const commandLineArgsOptions = [
  { name: 'port', alias: 'p', type: Number }
];
const options = commandLineArgs(optionDefinitions);
const port = options.port || config.connectionProxy.port || 8080;

client.on('connect', () => {
  server.listen(port, () => console.log(`API running on localhost:${port}`));
});

client.on('error', err => {
  console.log('Something went wrong:', err);
});
