// @ts-ignore
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

const EC_GROUP_ORDER = Buffer.from(
  'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141',
  'hex',
);
const ZERO32 = Buffer.alloc(32, 0);
function isScalar(x: Buffer): boolean {
  return Buffer.isBuffer(x) && x.length === 32;
}
function isValidPrivateKey(privateKey: Buffer): boolean {
  if (!isScalar(privateKey)) {
    return false;
  }
  return (
    privateKey.compare(ZERO32) > 0 &&
    // > 0
    privateKey.compare(EC_GROUP_ORDER) < 0
  ); // < G
}
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
export const getPublicCompressed = function (privateKey: Buffer): Buffer {
  // jshint ignore:line
  assert(privateKey.length === 32, 'Bad private key');
  assert(isValidPrivateKey(privateKey), 'Bad private key');
  // See https://github.com/wanderer/secp256k1-node/issues/46
  const compressed = true;
  return Buffer.from(ec.keyFromPrivate(privateKey).getPublic(compressed, 'array'));
};
