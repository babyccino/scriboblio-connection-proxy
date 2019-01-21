module.exports = class Routes {
  constructor(redisClient, requestNewInstance) {
    this.redisClient = redisClient;
    this.requestNewInstance = requestNewInstance;
    this.getPublic = this.getPublic.bind(this);
  }

  async getPublic(req, res) {
    try {
      let min = 1,
          max = 7;
      const offset = 0,
            count = 1;
      let args = ['playerCountIndex', min, max, 'limit', offset, count];
      let zRange = await this.redisClient.zrangebyscoreAsync(args);
      console.log(zRange);
      if (zRange.length > 0) {
        const uri = zRange[0];
        res.status(200).send(uri);
      } else {
        min = 0;
        max = 0;
        args = ['playerCountIndex', min, max, 'limit', offset, count];
        zRange = await this.redisClient.zrangebyscoreAsync(args);
        if (zRange.length > 0) {
          const uri = zRange[0];
          res.status(200).send(uri);
        } else {
          res.status(200).send(await requestNewInstance());
        }
      }
    } catch(e) {
      console.error(e);
      res.sendStatus(500);
    }
  }

  async getPrivate(req, res) {
    try {
      let min = 1,
          max = 7;
      const offset = 0,
            count = 1;
      let args = ['player_count_index', min, max, 'limit', offset, count];
      let zRange = await this.redisClient.zrangebyscoreAsync(args);
      console.log(zRange);
      if (zRange.length > 0) {
        const ip = zRange[0];
        res.status(200).send(ip);
      } else {
        min = 0;
        max = 0;
        args = ['player_count_index', min, max, 'limit', offset, count];
        zRange = await this.redisClient.zrangebyscoreAsync(args);
        if (zRange.length < 1) {
          res.sendStatus(404);
        } else {
          res.status(200).send(ip);
        }
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  }
}
