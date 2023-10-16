import config from '../config';
// @ts-ignore
import { Login, PrivateKey, Signature } from 'meta1-vision-js';

async function buildSignature4Fas(accountName: string, passkey: string, email: string) {
  let publicKey, signature;
  const signatureContent = `fas-migration:${email}:${accountName}`;

  try {
    const signerPkey = PrivateKey.fromWif(passkey);
    publicKey = signerPkey.toPublicKey().toString();
    signature = Signature.sign(accountName, signerPkey).toHex();
  } catch (err) {
    console.log('Build signature: ', err);
    try {
      const account = await Login.generateKeys(
        accountName,
        passkey,
        ['owner'],
        config.APP_KEY_PREFIX,
      );
      const ownerPrivateKey = account.privKeys.owner.toWif();
      publicKey = account.pubKeys.owner;
      const signerPkey = PrivateKey.fromWif(ownerPrivateKey);
      signature = Signature.sign(signatureContent, signerPkey).toHex();
    } catch (error) {
      console.error('Build signature: ', error);
    }
  }

  return { publicKey, signature, signatureContent };
}

export default buildSignature4Fas;
