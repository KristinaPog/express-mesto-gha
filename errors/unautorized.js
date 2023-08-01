const { STATUS_CODE_UNAUTORIZED } = require('./errors');

class Unautorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODE_UNAUTORIZED;
  }
}

module.exports = Unautorized;
