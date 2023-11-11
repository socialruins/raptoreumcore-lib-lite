/**
 * @typedef {Object} AssetUpTxPayloadJSON
 * @property {number} version	uint_16	Currently set to 1.
 * @property {string} assetId
 * @property {number} updatable
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
export type AssetUpTxPayloadJSON = {
    version: number,
    assetId: string,
    updatable: number,
    referenceHash: string,
    fee: number,
    type: number,
    targetAddress: string,
    ownerAddress: string,
    collateralAddress: string,
    issueFrequency: number,
    amount: number,
    exChainType: number,
    externalPayoutAddress: string,
    externalTxid: string,
    externalConfirmations: number,
    inputsHash: string,
    payloadSigSize?: number;
    payloadSig?: string;
  };
  
  /**
   * @class AssetUpTxPayload
    * @property {number} version	uint_16	Currently set to 1.
    * @property {string} assetId
    * @property {number} updatable
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
   * @property {number} [payloadSigSize] Size of the Signature
   * @property {string} [payloadSig] Signature of the hash of the Assettx fields. Signed with keyIDOwner
   */
  export class AssetUpTxPayload {
    /**
     * Parse raw payload
     * @param {Buffer} rawPayload
     * @return {AssetUpTxPayload}
     */
    static fromBuffer(rawPayload: Buffer): AssetUpTxPayload;
  
    /**
     * Create new instance of payload from JSON
     * @param {string|AssetUpTxPayloadJSON} payloadJson
     * @return {AssetUpTxPayload}
     */
    static fromJSON(payloadJson: string | AssetUpTxPayloadJSON): AssetUpTxPayload;
  
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
     * @return {AssetUpTxPayloadJSON}
     */
    toJSON(options?: { skipSignature?: any; network?: any }): AssetUpTxPayloadJSON;
  
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
    assetId: string;
    updatable: number;
    referenceHash: string;
    fee: number;
    type: number;
    targetAddress: string;
    ownerAddress: string;
    collateralAddress: string;
    issueFrequency: number;
    amount: number;
    exChainType: number;
    externalPayoutAddress: string;
    externalTxid: string;
    externalConfirmations: number;
    inputsHash: string;
    payloadSigSize?: number;
    payloadSig?: string;
  }
  