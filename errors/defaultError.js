const { STATUS_CODE_DEFAULT_ERROR } = require('./errors');

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_DEFAULT_ERROR;
  }
}

module.exports = DefaultError;
