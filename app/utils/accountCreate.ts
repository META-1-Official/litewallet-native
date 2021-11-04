//@ts-ignore
import { ChainValidation, FetchChain, PrivateKey, TransactionBuilder } from 'meta1js';

export function generateKeyFromPassword(accountName: any, role: string, password: any) {
  let seed = accountName + role + password;
  let privKey = PrivateKey.fromSeed(seed);
  let pubKey = privKey.toPublicKey().toString();

  return { privKey, pubKey };
}

async function createAccFunc(
  owner_pubkey: any,
  active_pubkey: any,
  memo_pubkey: any,
  new_account_name: any,
  referrer_percent: any,
) {
  ChainValidation.required('meta1register', 'registrar_id');
  ChainValidation.required('meta1register', 'referrer_id');

  const chain_registrar = await FetchChain('getAccount', 'meta1register');
  const chain_referrer = await FetchChain('getAccount', 'meta1register');
  console.log([chain_registrar, chain_referrer]);

  let tr = new TransactionBuilder();
  tr.add_type_operation('account_create', {
    fee: {
      amount: 0,
      asset_id: 0,
    },
    registrar: chain_registrar.get('id'),
    referrer: chain_referrer.get('id'),
    referrer_percent: referrer_percent,
    name: new_account_name,
    owner: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[owner_pubkey, 1]],
      address_auths: [],
    },
    active: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[active_pubkey, 1]],
      address_auths: [],
    },
    options: {
      memo_key: memo_pubkey,
      voting_account: '1.2.5',
      num_witness: 0,
      num_committee: 0,
      votes: [],
    },
  });
}
export default async function createAccountWithPassword(
  account_name: any,
  password: any,
  registrar: any,
  referrer: any,
  referrer_percent: any,
  refcode: any,
  phoneNumber: any,
  email: any,
  lastName: any,
  firstName: any,
) {
  const milkFaucet = async () => {
    let faucetAddress = 'https://faucet.meta1.io/faucet';

    let rawRes = await fetch(faucetAddress + '/api/v1/accounts', {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        account: {
          name: account_name,
          email: email,
          last_name: lastName,
          refcode: '',
          first_name: firstName,
          phone_number: phoneNumber,
          owner_key: 'META1' + owner_private.toPublicKey().toPublicKeyString().substring(5),
          active_key: 'META1' + active_private.toPublicKey().toPublicKeyString().substring(5),
          memo_key: 'META1' + memo_private.toPublicKey().toPublicKeyString().substring(5),
        },
      }),
    });
    const json = await rawRes.json();
    console.log('Register Called');
    console.log(json);
    return json;
  };

  const owner_private = generateKeyFromPassword(account_name, 'owner', password).privKey;
  const active_private = generateKeyFromPassword(account_name, 'active', password).privKey;
  const memo_private = generateKeyFromPassword(account_name, 'memo', password).privKey;

  console.log('create account:', account_name);
  console.log('new active pubkey', active_private.toPublicKey().toPublicKeyString());
  console.log('new owner pubkey', owner_private.toPublicKey().toPublicKeyString());
  console.log('new memo pubkey', memo_private.toPublicKey().toPublicKeyString());
  let create_account = () =>
    createAccFunc(
      owner_private.toPublicKey().toPublicKeyString(),
      active_private.toPublicKey().toPublicKeyString(),
      memo_private.toPublicKey().toPublicKeyString(),
      account_name,
      registrar, //registrar_id,
      // wtf, too many args
      // referrer, //referrer_id,
      // referrer_percent, //referrer_percent,
      // true, //broadcast
    );

  if (registrar) {
    // using another user's account as registrar
    return await create_account();
  } else {
    const faucetRes = await milkFaucet();
    console.log(faucetRes);
    if (faucetRes.error) {
      console.error(faucetRes.error);
      throw new Error('Registration error');
    }
    return faucetRes;
  }
}
