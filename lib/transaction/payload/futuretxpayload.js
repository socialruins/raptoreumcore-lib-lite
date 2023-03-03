/* eslint-disable */
// TODO: Remove previous line and work through linting issues at next edit

var utils = require('../../util/js');
var constants = require('../../constants');
var Preconditions = require('../../util/preconditions');
var BufferWriter = require('../../encoding/bufferwriter');
var BufferReader = require('../../encoding/bufferreader');
var AbstractPayload = require('./abstractpayload');
//var Script = require('../../script');
var BigNumber = require('bn.js');

var CURRENT_PAYLOAD_VERSION = 1;
var HASH_SIZE = constants.SHA256_HASH_SIZE;

/**
 * @typedef {Object} FutureTxPayloadJSON
 * @property {number} message version	uint16_t. Currently set to 1. 
 * @property {number} maturity - number of confirmations to be matured and spendable.
 * @property {number} lockTime - number of seconds for this transaction to be spendable
 * @property {number} lockOutputIndex - vout index that is locked in this transaction
 * @property {number} fee - fee was paid for this future in addition to miner fee. it is a whole non-decimal point value.
 * @property {boolean} updatableByDestination - 1 to allow some information of this transaction to be change by lockOutput address
 * @property {number} exChainType external chain type. each 15 bit unsign number will be map to a external chain. i.e 0 for btc
 * @property {string} externalPayoutAddress
 * @property {string} externalTxid
 * @property {number} externalConfirmations
 * @property {string} inputsHash - replay protection
 */

/**
 * @class FutureTxPayload
 * @property {number} version	uint_16	Currently set to 1.
 * @property {number} maturity
 * @property {number} lockTime.
 * @property {number} lockOutputIndex
 * @property {number} fee
 * @property {boolean} updatableByDestination
 * @property {number} exChainType
 * @property {string} externalPayoutAddress
 * @property {string} externalTxid
 * @property {number} externalConfirmations
 * @property {string} inputsHash
 */

function FutureTxPayload(options) {
  AbstractPayload.call(this);
  this.version = CURRENT_PAYLOAD_VERSION;
  this.updatableByDestination = false;
  this.exChainType = 0;
  this.externalPayoutAddress = "N/A";
  this.externalTxid = constants.NULL_HASH;
  this.externalConfirmations = 0;
  

  if (options) {
    this.maturity = options.maturity;
    this.lockTime = options.lockTime;
    this.lockOutputIndex = options.lockOutputIndex;
    this.fee = options.fee;
    this.inputsHash = options.inputsHash;
    //this.externalPayoutAddress = Script.fromAddress(options.externalPayoutAddress).toHex();
  }
}

FutureTxPayload.prototype = Object.create(AbstractPayload.prototype);
FutureTxPayload.prototype.constructor = AbstractPayload;

/* Static methods */

/**
 * Parse raw payload
 * @param {Buffer} rawPayload
 * @return {FutureTxPayload}
 */
FutureTxPayload.fromBuffer = function fromBuffer(rawPayload) {
  var payloadBufferReader = new BufferReader(rawPayload);
  var payload = new FutureTxPayload();

  const isUpdatableByDestination = Boolean(Buffer.from(this.updatableByDestination, "binary")[0]);

  payload.version = payloadBufferReader.readUInt16LE();
  payload.maturity = payloadBufferReader.readUInt32LE();
  payload.lockTime = payloadBufferReader.readUInt32LE();
  payload.lockOutputIndex = payloadBufferReader.readUInt16LE();
  payload.fee = payloadBufferReader.readUInt16LE();
  payload.updatableByDestination = isUpdatableByDestination;
  payload.exChainType = payloadBufferReader.readUInt16LE();
  payload.externalPayoutAddress = payloadBufferReader.read(3).toString();
  payload.externalTxid = payloadBufferReader
    .read(HASH_SIZE)
    .reverse()
    .toString('hex');
  payload.externalConfirmations = payloadBufferReader.readUInt16LE();
  payload.inputsHash = payloadBufferReader
    .read(HASH_SIZE)
    .reverse()
    .toString('hex');

  if (!payloadBufferReader.finished()) {
    throw new Error(
      'Failed to parse payload: raw payload is bigger than expected.'
    );
  }

  return payload;
};

/**
 * Create new instance of payload from JSON
 * @param {string|FutureTxPayloadJSON} payloadJson
 * @return {FutureTxPayload}
 */
FutureTxPayload.fromJSON = function fromJSON(payloadJson) {
  var payload = new FutureTxPayload(payloadJson);
  payload.validate();
  return payload;
};

/* Instance methods */

/**
 * Validate payload
 * @return {boolean}
 */
FutureTxPayload.prototype.validate = function () {
  Preconditions.checkArgument(
    utils.isUnsignedInteger(this.version),
    'Expect version to be an unsigned integer'
  );
  Preconditions.checkArgumentType(
    this.maturity,
    'number',
    'maturity'
  );
  Preconditions.checkArgumentType(
    this.lockTime,
    'number',
    'lockTime'
  );
  Preconditions.checkArgumentType(
    this.lockOutputIndex,
    'number',
    'lockOutputIndex'
  );
  Preconditions.checkArgumentType(
    this.fee,
    'number',
    'fee'
  );
  Preconditions.checkArgumentType(
    this.updatableByDestination,
    'number',
    'updatableByDestination'
  );
  Preconditions.checkArgumentType(
    this.exChainType,
    'number',
    'exChainType'
  );
  /*
  Preconditions.checkArgument(
    utils.isHexaString(this.externalPayoutAddress),
    'Expect externalPayoutAddress to be a hex string'
  );
  */
  /*
  Preconditions.checkArgument(
    utils.isSha256HexString(this.externalTxid),
    'Expect externalTxid to be a hex string representing sha256 hash'
  );
  */
  Preconditions.checkArgumentType(
    this.externalConfirmations,
    'number',
    'externalConfirmations'
  );
  Preconditions.checkArgument(
    utils.isHexaString(this.inputsHash),
    'Expect inputsHash to be a hex string'
  );
};

/**
 * Serializes payload to JSON
 * @param [options]
 * @param [options.network] - network for address serialization
 * @return {FutureTxPayloadJSON}
 */
FutureTxPayload.prototype.toJSON = function toJSON(options) {
  //var network = options && options.network;
  this.validate();
  var payloadJSON = {
    version: this.version,
    maturity: this.maturity,
    lockTime: this.lockTime,
    lockOutputIndex: this.lockOutputIndex,
    fee: this.fee,
    updatableByDestination: this.updatableByDestination === 1,
    exChainType: this.exChainType,
    //externalPayoutAddress: new Script(this.scriptPayout).toAddress(network).toString(),
    externalPayoutAddress: this.externalPayoutAddress,
    externalTxid: this.externalTxid,
    externalConfirmations: this.externalConfirmations,
    inputsHash: this.inputsHash,
  };

  return payloadJSON;
};

/**
 * Serialize payload to buffer
 * @param [options]
 * @return {Buffer}
 */
FutureTxPayload.prototype.toBuffer = function toBuffer(options) {
  this.validate();

  var payloadBufferWriter = new BufferWriter();

  payloadBufferWriter
    .writeUInt16LE(this.version)
    .writeInt32LE(this.maturity)
    .writeInt32LE(this.lockTime)
    .writeUInt16LE(this.lockOutputIndex)
    .writeUInt16LE(this.fee)
    .writeUInt8(this.updatableByDestination)
    .write(Buffer.from(this.updatableByDestination, "binary"))
    .writeUInt16LE(this.exChainType)
    .write(Buffer.from(this.externalPayoutAddress, "utf-8"))
    .write(Buffer.from(this.externalTxid, 'hex').reverse())
    .writeUInt16LE(this.externalConfirmations)
    .write(Buffer.from(this.inputsHash, 'hex').reverse());

  return payloadBufferWriter.toBuffer();
};

FutureTxPayload.prototype.copy = function copy() {
  return FutureTxPayload.fromBuffer(this.toBuffer());
};

module.exports = FutureTxPayload;
