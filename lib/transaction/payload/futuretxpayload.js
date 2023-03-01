/* eslint-disable */
// TODO: Remove previous line and work through linting issues at next edit

var utils = require('../../util/js');
var constants = require('../../constants');
var Preconditions = require('../../util/preconditions');
var BufferWriter = require('../../encoding/bufferwriter');
var BufferReader = require('../../encoding/bufferreader');
var AbstractPayload = require('./abstractpayload');
var Script = require('../../script');
var BigNumber = require('bn.js');

var CURRENT_PAYLOAD_VERSION = 1;
var HASH_SIZE = constants.SHA256_HASH_SIZE;

/**
 * @typedef {Object} FutureTxPayloadJSON
 * @property {number} version	uint_16. Currently set to 1.
 * @property {number} maturity
 * @property {number} lockTime.
 * @property {number} lockOutputIndex
 * @property {number} fee
 * @property {number} updatableByDestination
 * @property {number} exChainType
 * @property {string} externalPayoutAddress
 * @property {string} externalTxid
 * @property {number} externalConfirmations
 * @property {string} inputsHash
 * @property {number} [payloadSigSize] Size of the Signature
 * @property {string} [payloadSig] Signature of the hash of the FutureTx fields. Signed with keyIDOwner
 */

/**
 * @class FutureTxPayload
 * @property {number} version	uint_16	Currently set to 1.
 * @property {number} type
 * @property {number} mode
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
 * @property {number} [payloadSigSize] Size of the Signature
 * @property {string} [payloadSig] Signature of the hash of the FutureTx fields. Signed with keyIDOwner
 */

function FutureTxPayload(options) {
  AbstractPayload.call(this);
  this.version = CURRENT_PAYLOAD_VERSION;

  if (options) {
    this.type = options.type;
    this.mode = options.mode;
    this.maturity = options.maturity;
    this.lockTime = options.lockTime;
    this.lockOutputIndex = options.lockOutputIndex;
    this.fee = options.fee;
    this.updatableByDestination = options.updatableByDestination;
    this.exChainType = options.exChainType;
    this.externalPayoutAddress = options.externalPayoutAddress;
    this.externalTxid = options.externalTxid;
    this.externalConfirmations = options.externalConfirmations;
    this.inputsHash = options.inputsHash;
    this.payloadSig = options.payloadSig;
    this.payloadSigSize = this.payloadSig
      ? Buffer.from(this.payloadSig, 'hex').length
      : 0;
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

  payload.version = payloadBufferReader.readUInt16LE();
  payload.type = payloadBufferReader.readUInt16LE();
  payload.mode = payloadBufferReader.readUInt16LE();
  payload.maturity = payloadBufferReader.readVarintNum();
  payload.lockTime = payloadBufferReader.readVarintNum();
  payload.lockOutputIndex = payloadBufferReader.readUInt32LE();
  payload.fee = payloadBufferReader.readUInt64LEBN().toNumber();
  payload.updatableByDestination = payloadBufferReader.readUInt16LE();
  payload.exChainType = payloadBufferReader.readUInt16LE();
  payload.externalPayoutAddress = payloadBufferReader.readVarLengthBuffer();
  payload.externalTxid = payloadBufferReader
    .read(HASH_SIZE)
    .reverse()
    .toString('hex');
  payload.externalConfirmations = payloadBufferReader.readUInt32LE();
  payload.inputsHash = payloadBufferReader
    .read(HASH_SIZE)
    .reverse()
    .toString('hex');
  payload.payloadSigSize = payloadBufferReader.readVarintNum();
  if (payload.payloadSigSize > 0) {
    payload.payloadSig = payloadBufferReader
      .read(payload.payloadSigSize)
      .toString('hex');
  }
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
    'boolean',
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

  if (Boolean(this.payloadSig)) {
    Preconditions.checkArgumentType(
      this.payloadSigSize,
      'number',
      'payloadSigSize'
    );
    Preconditions.checkArgument(
      utils.isUnsignedInteger(this.payloadSigSize),
      'Expect payloadSigSize to be an unsigned integer'
    );
    Preconditions.checkArgument(
      utils.isHexaString(this.payloadSig),
      'Expect payload sig to be a hex string'
    );
  }
};

/**
 * Serializes payload to JSON
 * @param [options]
 * @param [options.skipSignature]
 * @param [options.network] - network for address serialization
 * @return {FutureTxPayloadJSON}
 */
FutureTxPayload.prototype.toJSON = function toJSON(options) {
  var noSignature = !Boolean(this.payloadSig);
  var skipSignature = noSignature || (options && options.skipSignature);
  //var network = options && options.network;
  this.validate();
  var payloadJSON = {
    version: this.version,
    maturity: this.maturity,
    lockTime: this.lockTime,
    lockOutputIndex: this.lockOutputIndex,
    fee: this.fee,
    updatableByDestination: this.updatableByDestination,
    exChainType: this.exChainType,
    //externalPayoutAddress: new Script(this.scriptPayout).toAddress(network).toString(),
    externalPayoutAddress: this.externalPayoutAddress,
    externalTxid: this.externalTxid,
    externalConfirmations: this.externalConfirmations,
    inputsHash: this.inputsHash,
  };
  if (!skipSignature) {
    payloadJSON.payloadSigSize = this.payloadSigSize;
    payloadJSON.payloadSig = this.payloadSig;
  }
  return payloadJSON;
};

/**
 * Serialize payload to buffer
 * @param [options]
 * @param {Boolean} [options.skipSignature] - skip signature. Needed for signing
 * @return {Buffer}
 */
FutureTxPayload.prototype.toBuffer = function toBuffer(options) {
  var noSignature = !Boolean(this.payloadSig);
  var skipSignature = noSignature || (options && options.skipSignature);
  this.validate();

  var payloadBufferWriter = new BufferWriter();

  payloadBufferWriter
    .writeUInt16LE(this.version)
    .writeUInt16LE(this.type)
    .writeUInt16LE(this.mode)
    .writeVarintNum(this.maturity)
    .writeVarintNum(this.lockTime)
    .writeInt32LE(this.lockOutputIndex)
    .writeUInt64LEBN(new BigNumber(this.fee))
    .writeUInt16LE(this.updatableByDestination)
    .writeUInt16LE(this.exChainType)
    .write(Buffer.from(this.externalPayoutAddress, 'hex'))
    .write(Buffer.from(this.externalTxid, 'hex').reverse())
    .writeInt32LE(this.externalConfirmations)
    .write(Buffer.from(this.inputsHash, 'hex').reverse());

  if (!skipSignature && this.payloadSig) {
    payloadBufferWriter.writeVarintNum(
      Buffer.from(this.payloadSig, 'hex').length
    );
    payloadBufferWriter.write(Buffer.from(this.payloadSig, 'hex'));
  } else {
    payloadBufferWriter.writeVarintNum(constants.EMPTY_SIGNATURE_SIZE);
  }

  return payloadBufferWriter.toBuffer();
};

FutureTxPayload.prototype.copy = function copy() {
  return FutureTxPayload.fromBuffer(this.toBuffer());
};

module.exports = FutureTxPayload;
