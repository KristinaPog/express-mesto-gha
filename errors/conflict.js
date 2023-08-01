const { STATUS_CODE_CONFLICT } = require('./errors');

class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_CONFLICT;
  }
}

module.exports = Conflict;
