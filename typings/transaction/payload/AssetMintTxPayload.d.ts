/**
 * @typedef {Object} AssetMintTxPayloadJSON
 * @property {number} version	uint_16	Currently set to 1.
 * @property {string} assetId
 * @property {number} fee - fee was paid for this mint in addition to miner fee. it is a whole non-decimal point value.
 * @property {string} inputsHash - replay protection
 */
export type AssetMintTxPayloadJSON = {
    version: number,
    assetId: string,
    fee: number,
    inputsHash: string,
  };
  
  /**
   * @class AssetMintTxPayload
    * @property {number} version	uint_16	Currently set to 1.
    * @property {string} assetId
    * @property {number} fee - fee was paid for this mint in addition to miner fee. it is a whole non-decimal point value.
    * @property {string} inputsHash - replay protection
   */
  export class AssetMintTxPayload {
    /**
     * Parse raw payload
     * @param {Buffer} rawPayload
     * @return {AssetMintTxPayload}
     */
    static fromBuffer(rawPayload: Buffer): AssetMintTxPayload;
  
    /**
     * Create new instance of payload from JSON
     * @param {string|AssetMintTxPayloadJSON} payloadJson
     * @return {AssetMintTxPayload}
     */
    static fromJSON(payloadJson: string | AssetMintTxPayloadJSON): AssetMintTxPayload;
  
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
     * @return {AssetMintTxPayloadJSON}
     */
    toJSON(options?: { skipSignature?: any; network?: any }): AssetMintTxPayloadJSON;
  
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
    fee: number;
    inputsHash: string;
  }
  