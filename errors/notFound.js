const { STATUS_CODE_NOT_FOUND } = require('./errors');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_NOT_FOUND;
  }
}

module.exports = NotFound;
