import axios, { AxiosInstance } from 'axios';
// @ts-ignore
import { PrivateKey, Signature } from 'meta1-vision-js';

import config from '../config';

class MigrationServices {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.liteWalletOldApiHost,
    });
  }

  // todo: move it out to helpers
  buildSignature = async (accountName: string, password: string) => {
    const signerPkey = PrivateKey.fromWif(password);
    const publicKey = signerPkey.toPublicKey().toString();
    const signature = Signature.sign(accountName, signerPkey).toHex();
    return { accountName, publicKey, signature };
  };

  checkOldUser = async (accountName: string) => {
    try {
      const { data } = await this.api.get('/checkTransferable', { params: { accountName } });
      return { ...data, error: false };
    } catch (e) {
      return { message: 'Something is wrong', error: true };
    }
  };

  validateSignature = async (accountName: string, password: string) => {
    try {
      const payload = await this.buildSignature(accountName, password);
      const { data } = await this.api.post('/validateSignature', payload);
      return data;
    } catch (e) {
      return { message: 'Invalid Signature', error: true };
    }
  };

  checkMigrationable = async (accountName: string) => {
    try {
      const { data } = await this.api.get('/migration-status', {
        params: { identifier: accountName },
      });
      return { ...data, error: false };
    } catch (e) {
      return { message: 'Not able to migrate', error: true };
    }
  };

  migrate = async (accountName: string, password: string) => {
    try {
      const payload = await this.buildSignature(accountName, password);
      const { data } = await this.api.post('/migrate', payload);
      return data;
    } catch (e) {
      return { message: 'Something is wrong', error: true };
    }
  };
}

export default new MigrationServices();
