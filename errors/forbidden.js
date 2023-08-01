const { STATUS_CODE_FORBIDDEN } = require('./errors');

class Forbitten extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_FORBIDDEN;
  }
}

module.exports = Forbitten;
