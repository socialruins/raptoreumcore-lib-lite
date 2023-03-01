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
export type FutureTxPayloadJSON = {
  version: number;
  maturity: number;
  lockTime: number;
  lockOutputIndex: number;
  fee: number;
  updatableByDestination: number;
  exChainType: number;
  externalPayoutAddress: string;
  externalTxid: string;
  externalConfirmations: number;
  inputsHash: string;
  payloadSigSize?: number;
  payloadSig?: string;
};

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
export class FutureTxPayload {
  /**
   * Parse raw payload
   * @param {Buffer} rawPayload
   * @return {FutureTxPayload}
   */
  static fromBuffer(rawPayload: Buffer): FutureTxPayload;

  /**
   * Create new instance of payload from JSON
   * @param {string|FutureTxPayloadJSON} payloadJson
   * @return {FutureTxPayload}
   */
  static fromJSON(payloadJson: string | FutureTxPayloadJSON): FutureTxPayload;

  /**
   * Validate payload
   * @return {boolean}
   */
  validate(): boolean;

  /**
   * Serializes payload to JSON
   * @param [options]
   * @param [options.skipSignature]
   * @param [options.network] - network for address serialization
   * @return {FutureTxPayloadJSON}
   */
  toJSON(options?: { skipSignature?: any; network?: any }): FutureTxPayloadJSON;

  /**
   * Serialize payload to buffer
   * @param [options]
   * @param {Boolean} [options.skipSignature] - skip signature. Needed for signing
   * @return {Buffer}
   */
  toBuffer(options?: { skipSignature?: boolean }): Buffer;

  /**
   * uint_16    2    Provider transaction version number. Currently set to 1.
   */
  version: number;
  type: number;
  mode: number;
  maturity: number;
  lockTime: number;
  lockOutputIndex: number;
  fee: number;
  updatableByDestination: number;
  exChainType: number;
  externalPayoutAddress: string;
  externalTxid: string;
  externalConfirmations: number;
  inputsHash: string;
  payloadSigSize?: number;
  payloadSig?: string;
}
