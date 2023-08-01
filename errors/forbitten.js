const { STATUS_CODE_FORBITTEN } = require('./errors');

class Forbitten extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_FORBITTEN;
  }
}

module.exports = Forbitten;
