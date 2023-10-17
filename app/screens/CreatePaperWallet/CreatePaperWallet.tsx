import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNewLoaderModal } from '../../components/LoaderModal';
import useAppSelector from '../../hooks/useAppSelector';
import { colors } from '../../styles/colors';
import { catchError, tid } from '../../utils';
import { generateKeyFromPassword } from '../../utils/accountCreate';
import { AccountWithPassword, _login, getAccount } from '../../services/meta1Api';
import RenderPdf, { KeysT } from './RenderPdf';
import { savePdf } from './SavePdf';
//@ts-ignore
import { PrivateKey } from 'meta1-vision-js';

function isPassPk(password: string): boolean {
  try {
    const _ = PrivateKey.fromWif(password);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getAccountKeys({
  accountName,
  password,
}: AccountWithPassword): Promise<KeysT | undefined> {
  await _login(accountName, password);

  if (isPassPk(password)) {
    let account: any = (await getAccount(accountName))?.account;
    let passwordKeys: any = {};
    const fromWif = PrivateKey.fromWif(password);
    const key = {
      privKey: fromWif ? fromWif.toWif() : fromWif,
      pubKey: fromWif.toPublicKey().toString(),
    };

    ['active', 'owner', 'memo'].forEach(role => {
      if (role === 'memo') {
        if (account.options.memo_key == key.pubKey) {
          passwordKeys[role] = key;
        } else {
          passwordKeys[role] = {
            pubKey: account.options.memo_key,
            privKey: '',
          };
        }
      } else {
        account[role].key_auths.forEach((auth: Array<String>) => {
          if (auth[0] == key.pubKey) {
            passwordKeys[role] = key;
          } else {
            passwordKeys[role] = {
              pubKey: auth[0],
              privKey: '',
            };
          }
        });
      }
    });
    return {
      ownerKeys: passwordKeys.owner || '',
      activeKeys: passwordKeys.active || '',
      memoKeys: passwordKeys.memo || '',
      accountName: accountName,
    };
  } else {
    return {
      ownerKeys: generateKeyFromPassword(accountName, 'owner', password, true),
      activeKeys: generateKeyFromPassword(accountName, 'active', password, true),
      memoKeys: generateKeyFromPassword(accountName, 'memo', password, true),
      accountName: accountName,
    };
  }
}

export default function CreatePaperWallet() {
  const { accountName } = useAppSelector(state => state.wallet);
  const [password, setPassword] = useState('');
  const [keys, setKeys] = useState<KeysT | undefined>(undefined);
  const [document, setDoc] = useState('');
  const loader = useNewLoaderModal();

  useEffect(() => {
    if (document) {
      savePdf(document);
    }
  }, [document]);

  const save = async () => {
    catchError(async () => {
      const _keys = await getAccountKeys({ accountName, password });
      setKeys(_keys);
      if (document) {
        savePdf(document);
        return;
      }
      loader.open();
    });
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 24 }}>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>Create Paper Wallet</Text>
      <View
        style={{ backgroundColor: 'darkred', padding: 12, marginVertical: 24, borderRadius: 6 }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>
          Unlock / login before creating the paper wallet to include private keys
        </Text>
      </View>

      <View>
        <Text style={{ color: colors.BrandYellow }}>Wallet Name</Text>
        <TextInput
          {...tid('CreatePaperWallet/accountName')}
          value={accountName}
          editable={false}
          style={{
            paddingVertical: 12,
            fontSize: 18,
            color: '#ddd',
            borderBottomWidth: 1,
            borderBottomColor: '#555',
          }}
        />
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ color: colors.BrandYellow }}>Passkey</Text>
        <TextInput
          {...tid('CreatePaperWallet/password')}
          value={password}
          onChangeText={t => setPassword(t)}
          style={{
            paddingVertical: 12,
            fontSize: 18,
            color: '#ddd',
            borderBottomWidth: 1,
            borderBottomColor: '#555',
          }}
          secureTextEntry
        />
      </View>
      <RenderPdf
        keys={keys}
        onReady={d => {
          setDoc(d);
          loader.close();
        }}
      />
      <TouchableOpacity {...tid('CreatePaperWallet/Save')} onPress={save}>
        <View
          style={{
            backgroundColor: colors.BrandYellow,
            alignItems: 'center',
            padding: 18,
            marginVertical: 24,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '500' }}>Create Paper Wallet</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
