const HTTP = require('http'),
      Cors = require('cors'),
      Express = require('express');

const app = Express();

app.use(Cors());

app.get('/findServer', (req, res) => setTimeout(() => {
  res.send('http://localhost:8080');
}, 0));

const server = HTTP.createServer(app);
const port = 8081;

server.listen(port, () => console.log(`API running on localhost:${port}`));