/* eslint-disable */
// TODO: Remove previous line and work through linting issues at next edit

var utils = require('../../util/js');
var constants = require('../../constants');
var Preconditions = require('../../util/preconditions');
var BufferWriter = require('../../encoding/bufferwriter');
var BufferReader = require('../../encoding/bufferreader');
var AbstractPayload = require('./abstractpayload');
var Script = require('../../script');
//var BigNumber = require('bn.js');

var CURRENT_PAYLOAD_VERSION = 1;
var HASH_SIZE = constants.SHA256_HASH_SIZE;

/**
 * @typedef {Object} CreateAssetTxPayloadJSON
 * @property {string} Asset_id
 * @property {string} Asset_name
 * @property {number} Circulating_supply
 * @property {number} MintCount
 * @property {number} maxMintCount
 * @property {string} owner
 * @property {number} Isunique
 * @property {number} Updatable
 * @property {number} Decimalpoint
 * @property {string} ReferenceHash
 * @property {string} Type
 * @property {string} TargetAddress
 * @property {string} IssueFrequency
 * @property {string} Amount
 * @property {string} Distribution
 */

/**
 * // https://github.com/Raptor3um/raptoreum/blob/develop/src/assets/assets.cpp
 * @class CreateAssetTxPayload
 * @property {number} version	uint_16	Currently set to 1.
 * @property {string} assetId
 * @property {number} circulatingSupply //circulatingSupply / COIN
 * @property {string} name
 * @property {number} updatable
 * @property {number} isUnique
 * @property {number} decimalPoint
 * @property {string} referenceHash
 * @property {number} maxMintCount
 * @property {number} fee
 * @property {number} type
 * @property {string} targetAddress
 * @property {number} issueFrequency
 * @property {number} amount
 * @property {string} ownerAddress
 * @property {string} collateralAddress
 */

function GetDistributionType(t) {
    switch (t) {
        case 0:
            return "manual";
        case 1:
            return "coinbase";
        case 2:
            return "address";
        case 3:
            return "schedule";
    }
    return "invalid";
}

function CreateAssetTxPayload(options) {
    AbstractPayload.call(this);
    this.version = CURRENT_PAYLOAD_VERSION;
    this.assetId = "txid";
    this.circulatingSupply = 0;
    this.mintCount = 0;
  
    if (options) {
        this.name = options.name;
        this.updatable = options.updatable;
        this.isUnique = options.isUnique;
        this.decimalPoint = options.decimalPoint;
        this.referenceHash = options.referenceHash;
        this.maxMintCount = options.maxMintCount;
        this.fee = options.fee;
        this.type = options.type;
        //this.targetAddress = options.targetAddress;
        this.scriptTargetAddress = Script.fromAddress(
            options.targetAddress
          ).toHex();
        this.issueFrequency = options.issueFrequency;
        this.amount = options.amount;
        //this.ownerAddress = options.ownerAddress;
        this.scriptOwnerAddress = Script.fromAddress(
            options.ownerAddress
          ).toHex();
        //this.collateralAddress = options.collateralAddress;
        //this.scriptCollateralAddress = Script.fromAddress(
        //    options.collateralAddress
        //  ).toHex();
    }
}

CreateAssetTxPayload.prototype = Object.create(AbstractPayload.prototype);
CreateAssetTxPayload.prototype.constructor = AbstractPayload;

/* Static methods */

/**
 * Parse raw payload
 * @param {Buffer} rawPayload
 * @return {CreateAssetTxPayload}
 */
CreateAssetTxPayload.fromBuffer = function fromBuffer(rawPayload) {
    var payloadBufferReader = new BufferReader(rawPayload);
    var payload = new CreateAssetTxPayload();

    payload.assetId = payloadBufferReader
        .read(HASH_SIZE)
        .reverse()
        .toString('hex');
    payload.circulatingSupply = payloadBufferReader.readUInt16LE();
    payload.mintCount = payloadBufferReader.readUInt16LE();
    payload.name = payloadBufferReader.readUInt8();
    payload.updatable = payloadBufferReader.readUInt8();
    payload.isUnique = payloadBufferReader.readUInt8();
    payload.decimalPoint = payloadBufferReader.readUInt32LE();
    payload.referenceHash = payloadBufferReader.readUInt8();
    payload.maxMintCount = payloadBufferReader.readUInt32LE();
    payload.fee = payloadBufferReader.readUInt16LE();
    payload.type = payloadBufferReader.readUInt8();
    var scriptTargetAddressSize = payloadBufferReader.readVarintNum();
    payload.scriptTargetAddress = payloadBufferReader
      .read(scriptTargetAddressSize)
      .toString('hex');
    payload.issueFrequency = payloadBufferReader.readUInt16LE();
    payload.amount = payloadBufferReader.readUInt16LE();
    var scriptOwnerAddressSize = payloadBufferReader.readVarintNum();
    payload.scriptOwnerAddress = payloadBufferReader
      .read(scriptOwnerAddressSize)
      .toString('hex');
    //payload.collateralAddress = payloadBufferReader.readUInt8();
  
    if (!payloadBufferReader.finished()) {
      throw new Error(
        'Failed to parse payload: raw payload is bigger than expected.'
      );
    }
  
    return payload;
};

/**
 * Create new instance of payload from JSON
 * @param {string|CreateAssetTxPayloadJSON} payloadJson
 * @return {CreateAssetTxPayload}
 */
CreateAssetTxPayload.fromJSON = function fromJSON(payloadJson) {
    var payload = new CreateAssetTxPayload(payloadJson);
    payload.validate();
    return payload;
};

/* Instance methods */

/**
 * Validate payload
 * @return {boolean}
 */
CreateAssetTxPayload.prototype.validate = function () {
    Preconditions.checkArgument(
      utils.isUnsignedInteger(this.version),
      'Expect version to be an unsigned integer'
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
   * @return {CreateAssetTxPayloadJSON}
   */
CreateAssetTxPayload.prototype.toJSON = function toJSON(options) {
    //var network = options && options.network;
    this.validate();
    var payloadJSON = {
      Asset_id: this.assetId,
      Asset_name: this.name,
      Circulating_supply: this.circulatingSupply,
      MintCount: this.mintCount,
      maxMintCount: this.maxMintCount,
      owner: new Script(this.scriptOwnerAddress)
        .toAddress(network)
        .toString(),
      Isunique: this.isUnique,
      Updatable: this.updatable,
      Decimalpoint: this.decimalPoint,
      ReferenceHash: this.referenceHash,
      Type: GetDistributionType(this.type),
      TargetAddress: new Script(this.scriptTargetAddress)
        .toAddress(network)
        .toString(),
      //collateralAddress: this.collateralAddress,
      //collateralAddress: new Script(this.scriptCollateralAddress)
      //  .toAddress(network)
      //  .toString(),
      IssueFrequency: this.issueFrequency,
      Amount: this.amount / COIN,
      Distribution: this.type,
    };
  
    return payloadJSON;
};
  
  /**
   * Serialize payload to buffer
   * @param [options]
   * @return {Buffer}
   */
CreateAssetTxPayload.prototype.toBuffer = function toBuffer(options) {
    this.validate();
  
    var payloadBufferWriter = new BufferWriter();

    payloadBufferWriter
      .write(Buffer.from(this.assetId, 'hex').reverse())
      .writeUInt16LE(this.circulatingSupply)
      .writeUInt16LE(this.mintCount);
    
    var scriptName = Buffer.from(this.name, 'utf-8');
    payloadBufferWriter.writeVarintNum(scriptName.length);
    payloadBufferWriter.write(scriptName);

    payloadBufferWriter
      .writeUInt8(this.updatable)
      .writeUInt8(this.isUnique)
      .writeInt32LE(this.decimalPoint)
      .write(Buffer.from(this.referenceHash, 'utf-8'))
      .writeInt32LE(this.maxMintCount)
      .writeUInt16LE(this.fee)
      .writeUInt8(this.type);

    var scriptTargetAddress = Buffer.from(this.scriptTargetAddress, 'hex');
    payloadBufferWriter.writeVarintNum(scriptTargetAddress.length);
    payloadBufferWriter.write(scriptTargetAddress);

    payloadBufferWriter
        .writeUInt16LE(this.issueFrequency)
        .writeUInt16LE(this.amount);

    var scriptOwnerAddress = Buffer.from(this.scriptOwnerAddress, 'hex');
    payloadBufferWriter.writeVarintNum(scriptOwnerAddress.length);
    payloadBufferWriter.write(scriptOwnerAddress);

    return payloadBufferWriter.toBuffer();
};
  
CreateAssetTxPayload.prototype.copy = function copy() {
    return CreateAssetTxPayload.fromBuffer(this.toBuffer());
};
  
module.exports = CreateAssetTxPayload;
  