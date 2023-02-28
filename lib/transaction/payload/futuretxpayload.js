/* eslint-disable */
// TODO: Remove previous line and work through linting issues at next edit

var constants = require('../../constants');
var Preconditions = require('../../util/preconditions');
var BufferWriter = require('../../encoding/bufferwriter');
var BufferReader = require('../../encoding/bufferreader');
var AbstractPayload = require('./abstractpayload');
var utils = require('../../util/js');

var isUnsignedInteger = utils.isUnsignedInteger;
//var isHexString = utils.isHexaString;

//var CURRENT_PAYLOAD_VERSION = 1;
//var HASH_SIZE = constants.SHA256_HASH_SIZE;

/**
 * @typedef {Object} FutureTxPayloadJSON
 * @property {number} future_maturity
 * @property {number} future_locktime
 */

/**
 * @class FutureTxPayload
 * @property {number} future_maturity
 * @property {number} future_locktime
 */

function FutureTxPayload() {
  AbstractPayload.call(this);
}

FutureTxPayload.prototype = Object.create(AbstractPayload.prototype);
FutureTxPayload.prototype.constructor = AbstractPayload;

/* Static methods */

/**
 * Parse raw transition payload
 * @param {Buffer} rawPayload
 * @return {FutureTxPayload}
 */
FutureTxPayload.fromBuffer = function (rawPayload) {
  var payloadBufferReader = new BufferReader(rawPayload);
  var payload = new FutureTxPayload();
  payload.future_maturity = payloadBufferReader.readUInt32LE();
  payload.future_locktime = payloadBufferReader.readUInt32LE();

  if (!payloadBufferReader.finished()) {
    throw new Error(
      'Failed to parse payload: raw payload is bigger than expected.'
    );
  }

  payload.validate();
  return payload;
};

/**
 * Create new instance of payload from JSON
 * @param {string|FutureTxPayloadJSON} payloadJson
 * @return {FutureTxPayload}
 */
FutureTxPayload.fromJSON = function fromJSON(payloadJson) {
  var payload = new FutureTxPayload();
  payload.future_maturity = payloadJson.future_maturity;
  payload.future_locktime = payloadJson.future_locktime;

  payload.validate();
  return payload;
};

/* Instance methods */

/**
 * Validates payload data
 * @return {boolean}
 */
FutureTxPayload.prototype.validate = function () {
  Preconditions.checkArgument(
    isUnsignedInteger(this.future_maturity),
    'Expect height to be an unsigned integer'
  );
  Preconditions.checkArgument(
    isUnsignedInteger(this.future_locktime),
    'Expect height to be an unsigned integer'
  );
  return true;
};

/**
 * Serializes payload to JSON
 * @return {FutureTxPayloadJSON}
 */
FutureTxPayload.prototype.toJSON = function toJSON() {
  this.validate();
  var json = {
    future_maturity: this.future_maturity,
    future_locktime: this.future_locktime,
  };
  return json;
};

/**
 * Serialize payload to buffer
 * @return {Buffer}
 */
FutureTxPayload.prototype.toBuffer = function toBuffer() {
  this.validate();
  var payloadBufferWriter = new BufferWriter();

  payloadBufferWriter
    .writeUInt32LE(this.future_maturity)
    .writeUInt32LE(this.future_locktime);

  return payloadBufferWriter.toBuffer();
};

/**
 * Copy payload instance
 * @return {FutureTxPayload}
 */
FutureTxPayload.prototype.copy = function copy() {
  return FutureTxPayload.fromJSON(this.toJSON());
};

module.exports = FutureTxPayload;
