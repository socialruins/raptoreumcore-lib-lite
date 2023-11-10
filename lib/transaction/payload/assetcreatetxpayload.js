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
var PUBKEY_ID_SIZE = constants.PUBKEY_ID_SIZE;

/*
    "newAssetTx": {
      "version": 1,
      "name": "Asset Test 2 Unique",
      "isUnique": true,
      "maxMintCount": 1,
      "updatable": false,
      "decimalPoint": 0,
      "referenceHash": "",
      "fee": 100,
      "type": 0,
      "targetAddress": "rsYk63PeTw6xxgEgnosnYbFhdyq7vfHCsd",
      "ownerAddress": "rsYk63PeTw6xxgEgnosnYbFhdyq7vfHCsd",
      "collateralAddress": "N/A",
      "issueFrequency": 0,
      "amount": 10000000000,
      "exChainType": 0,
      "externalPayoutAddress": "N/A",
      "externalTxid": "0000000000000000000000000000000000000000000000000000000000000000",
      "externalConfirmations": 0,
      "inputsHash": "45e66f5ea8628b348149e7953340f49d4472edf61269922fba178f2c9ac3022a"
    }
*/

/**
 * @typedef {Object} AssetCreateTxPayloadJSON
 * @property {number} version	uint_16	Currently set to 1.
 * @property {string} name
 * @property {number} isUnique
 * @property {number} maxMintCount
 * @property {number} updatable
 * @property {number} decimalPoint
 * @property {string} referenceHash
 * @property {number} fee
 * @property {number} type
 * @property {string} targetAddress
 * @property {string} ownerAddress
 * @property {string} collateralAddress
 * @property {string} issueFrequency
 * @property {string} amount
 * @property {number} exChainType
 * @property {string} externalPayoutAddress
 * @property {string} externalTxid
 * @property {number} externalConfirmations
 * @property {string} inputsHash
 */

/**
 * // https://github.com/Raptor3um/raptoreum/blob/develop/src/assets/assets.cpp
 * @class AssetCreateTxPayload
 * @property {number} version	uint_16	Currently set to 1.
 * @property {string} name
 * @property {number} isUnique
 * @property {number} maxMintCount
 * @property {number} updatable
 * @property {number} decimalPoint
 * @property {string} referenceHash
 * @property {number} fee
 * @property {number} type
 * @property {string} targetAddress
 * @property {string} [scriptTargetAddress] Payee script (p2pkh/p2sh)
 * @property {string} ownerAddress
 * @property {string} [scriptOwnerAddress] Payee script (p2pkh/p2sh)
 * @property {string} collateralAddress
 * @property {string} issueFrequency
 * @property {string} amount
 * @property {number} exChainType
 * @property {string} externalPayoutAddress
 * @property {string} externalTxid
 * @property {number} externalConfirmations
 * @property {string} inputsHash
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

function AssetCreateTxPayload(options) {
    AbstractPayload.call(this);
    this.version = CURRENT_PAYLOAD_VERSION;
    this.exChainType = 0;
    this.externalPayoutAddress = "0000000000000000000000000000000000000000";
    this.externalTxid = constants.NULL_HASH;
    this.externalConfirmations = 0;
    this.collateralAddress = 0;

    if (options) {
        this.name = options.name;
        this.isUnique = options.isUnique;
        this.maxMintCount = options.maxMintCount;
        this.updatable = options.updatable;
        this.decimalPoint = options.decimalPoint;
        this.referenceHash = options.referenceHash;
        this.fee = options.fee;
        this.type = options.type;
        //this.targetAddress = options.targetAddress;
        this.scriptTargetAddress = Script.fromAddress(
            options.targetAddress
          ).toHex();
        //this.ownerAddress = options.ownerAddress;
        this.scriptOwnerAddress = Script.fromAddress(
            options.ownerAddress
          ).toHex();
        
        //this.scriptCollateralAddress = Script.fromAddress(
        //    options.collateralAddress
        //  ).toHex();
        
        this.issueFrequency = options.issueFrequency;
        this.amount = options.amount;
        this.inputsHash = options.inputsHash;

    }
}

AssetCreateTxPayload.prototype = Object.create(AbstractPayload.prototype);
AssetCreateTxPayload.prototype.constructor = AbstractPayload;

/* Static methods */

/**
 * Parse raw payload
 * @param {Buffer} rawPayload
 * @return {AssetCreateTxPayload}
 */
AssetCreateTxPayload.fromBuffer = function fromBuffer(rawPayload) {
/*
    uint16_t nVersion{CURRENT_VERSION}; // message version
    std::string name;
    bool updatable = true; // If true this asset metadata can be modified using assetTx update process.
    bool isUnique = false; // If true this asset is unique it has an identity per token (NFT flag)
    uint16_t maxMintCount = 0;
    uint8_t decimalPoint = 0;
    std::string referenceHash; // Hash of the underlying physical or digital assets, IPFS hash can be used here.
    uint16_t fee;              // Fee was paid for this asset creation in addition to miner fee. it is a whole non-decimal point value.
    //  distribution
    uint8_t type; // manual, coinbase, address, schedule
    CKeyID targetAddress;
    uint8_t issueFrequency;
    CAmount amount;
    CKeyID ownerAddress;
    CKeyID collateralAddress;

    uint16_t exChainType = 0; // External chain type. each 15 bit unsigned number will be map to a external chain. i.e. 0 for btc
    CScript externalPayoutScript;
    uint256 externalTxid;
    uint16_t externalConfirmations = 0;
    uint256 inputsHash; // replay protection
*/
    var payloadBufferReader = new BufferReader(rawPayload);
    var payload = new AssetCreateTxPayload();

    payload.version = payloadBufferReader.readUInt16LE();
    var assetName = payloadBufferReader.readVarintNum();
    payload.name = payloadBufferReader.read(assetName).toString();
    payload.updatable = payloadBufferReader.readUInt8();
    payload.isUnique = payloadBufferReader.readUInt8();
    payload.maxMintCount = payloadBufferReader.readUInt16LE();
    payload.decimalPoint = payloadBufferReader.readUInt8();
    var referenceHash = payloadBufferReader.readVarintNum();
    payload.referenceHash = payloadBufferReader.read(referenceHash).toString();
    payload.fee = payloadBufferReader.readUInt16LE();
    payload.type = payloadBufferReader.readUInt8();
    //var scriptTargetAddressSize = payloadBufferReader.readVarintNum();
    payload.scriptTargetAddress = payloadBufferReader.read(PUBKEY_ID_SIZE).toString('hex');
    payload.issueFrequency = payloadBufferReader.readUInt8();
    payload.amount = payloadBufferReader.readUInt32LE();
    //var scriptOwnerAddressSize = payloadBufferReader.readVarintNum();
    payload.scriptOwnerAddress = payloadBufferReader.read(PUBKEY_ID_SIZE).toString('hex');
    payload.collateralAddress = payloadBufferReader.readUInt8();
    payload.exChainType = payloadBufferReader.readUInt16LE();
    payload.externalPayoutAddress = payloadBufferReader.read(PUBKEY_ID_SIZE).toString('hex');
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
 * @param {string|AssetCreateTxPayloadJSON} payloadJson
 * @return {AssetCreateTxPayload}
 */
AssetCreateTxPayload.fromJSON = function fromJSON(payloadJson) {
    var payload = new AssetCreateTxPayload(payloadJson);
    payload.validate();
    return payload;
};

/* Instance methods */

/**
 * Validate payload
 * @return {boolean}
 */
AssetCreateTxPayload.prototype.validate = function () {
    /*Preconditions.checkArgument(
      utils.isUnsignedInteger(this.version),
      'Expect version to be an unsigned integer'
    );*/
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
    /*Preconditions.checkArgumentType(
      this.externalConfirmations,
      'number',
      'externalConfirmations'
    );*/
    /*Preconditions.checkArgument(
      utils.isHexaString(this.inputsHash),
      'Expect inputsHash to be a hex string'
    );*/
  };
  
  /**
   * Serializes payload to JSON
   * @param [options]
   * @param [options.network] - network for address serialization
   * @return {AssetCreateTxPayloadJSON}
   */
  AssetCreateTxPayload.prototype.toJSON = function toJSON(options) {
    var network = options && options.network;
    this.validate();
    var payloadJSON = {
        version: this.version,
        name: this.name,
        isUnique: this.isUnique,
        maxMintCount: this.maxMintCount,
        updatable: this.updatable,
        decimalPoint: this.decimalPoint,
        referenceHash: this.referenceHash,
        fee: this.fee,
        type: this.type,
        targetAddress: new Script(this.scriptTargetAddress)
            .toAddress(network)
            .toString(),
        ownerAddress: new Script(this.scriptOwnerAddress)
            .toAddress(network)
            .toString(),
        collateralAddress: this.collateralAddress,
        issueFrequency: this.issueFrequency,
        amount: this.amount,
        exChainType: this.exChainType,
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
  AssetCreateTxPayload.prototype.toBuffer = function toBuffer(options) {
    this.validate();
  
    var payloadBufferWriter = new BufferWriter();

/*
    uint16_t nVersion{CURRENT_VERSION}; // message version
    std::string name;
    bool updatable = true; // If true this asset metadata can be modified using assetTx update process.
    bool isUnique = false; // If true this asset is unique it has an identity per token (NFT flag)
    uint16_t maxMintCount = 0;
    uint8_t decimalPoint = 0;
    std::string referenceHash; // Hash of the underlying physical or digital assets, IPFS hash can be used here.
    uint16_t fee;              // Fee was paid for this asset creation in addition to miner fee. it is a whole non-decimal point value.
    //  distribution
    uint8_t type; // manual, coinbase, address, schedule
    CKeyID targetAddress;
    uint8_t issueFrequency;
    CAmount amount;
    CKeyID ownerAddress;
    CKeyID collateralAddress;

    uint16_t exChainType = 0; // External chain type. each 15 bit unsigned number will be map to a external chain. i.e. 0 for btc
    CScript externalPayoutScript;
    uint256 externalTxid;
    uint16_t externalConfirmations = 0;
    uint256 inputsHash; // replay protection

*/

    payloadBufferWriter.writeUInt16LE(this.version);
    var assetName = Buffer.from(this.name, "utf8");
    payloadBufferWriter.writeVarintNum(assetName.length);
    payloadBufferWriter.write(assetName);
    payloadBufferWriter.writeUInt8(this.updatable);
    payloadBufferWriter.writeUInt8(this.isUnique);
    payloadBufferWriter.writeUInt16LE(this.maxMintCount);
    payloadBufferWriter.writeUInt8(this.decimalPoint);
    var referenceHash = Buffer.from(this.referenceHash, "utf8");
    payloadBufferWriter.writeVarintNum(referenceHash.length);
    payloadBufferWriter.write(referenceHash);
    payloadBufferWriter.writeUInt16LE(this.fee);
    payloadBufferWriter.writeUInt8(this.type);
    var scriptTargetAddress = Buffer.from(this.scriptTargetAddress, 'hex');
    //payloadBufferWriter.writeVarintNum(scriptTargetAddress.length);
    payloadBufferWriter.write(scriptTargetAddress);
    payloadBufferWriter.writeUInt8(this.issueFrequency);
    payloadBufferWriter.writeUInt32LE(this.amount);
    var scriptOwnerAddress = Buffer.from(this.scriptOwnerAddress, 'hex');
    //payloadBufferWriter.writeVarintNum(scriptOwnerAddress.length);
    payloadBufferWriter.write(scriptOwnerAddress);
    payloadBufferWriter.writeUInt8(this.collateralAddress); //collateralAddress not used
    payloadBufferWriter.writeUInt16LE(this.exChainType)
    payloadBufferWriter.write(Buffer.from(this.externalPayoutAddress, 'hex')); //externalPayoutAddress not used
    payloadBufferWriter.write(Buffer.from(this.externalTxid, 'hex').reverse());
    payloadBufferWriter.writeUInt16LE(this.externalConfirmations);
    payloadBufferWriter.write(Buffer.from(this.inputsHash, 'hex').reverse());

    return payloadBufferWriter.toBuffer();
};
  
AssetCreateTxPayload.prototype.copy = function copy() {
    return AssetCreateTxPayload.fromBuffer(this.toBuffer());
};
  
module.exports = AssetCreateTxPayload;
