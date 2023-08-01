const { STATUS_CODE_BAD_REQUEST } = require('./errors');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_BAD_REQUEST;
  }
}

module.exports = BadRequest;
