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
 * @property {number} [payloadSigSize] Size of the Signature
 * @property {string} [payloadSig] Signature of the hash of the FutureTx fields. Signed with keyIDOwner
 */
export type AssetCreateTxPayloadJSON = {
    version: number,
    name: string,
    isUnique: number,
    maxMintCount: number,
    updatable: number,
    decimalPoint: number,
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
   * @property {string} [payloadSig] Signature of the hash of the FutureTx fields. Signed with keyIDOwner
   */
  export class AssetCreateTxPayload {
    /**
     * Parse raw payload
     * @param {Buffer} rawPayload
     * @return {AssetCreateTxPayload}
     */
    static fromBuffer(rawPayload: Buffer): AssetCreateTxPayload;
  
    /**
     * Create new instance of payload from JSON
     * @param {string|AssetCreateTxPayloadJSON} payloadJson
     * @return {AssetCreateTxPayload}
     */
    static fromJSON(payloadJson: string | AssetCreateTxPayloadJSON): AssetCreateTxPayload;
  
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
     * @return {AssetCreateTxPayloadJSON}
     */
    toJSON(options?: { skipSignature?: any; network?: any }): AssetCreateTxPayloadJSON;
  
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
    name: string;
    isUnique: number;
    maxMintCount: number;
    updatable: number;
    decimalPoint: number;
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
  