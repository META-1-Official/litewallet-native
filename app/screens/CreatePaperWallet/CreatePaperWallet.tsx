import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNewLoaderModal } from '../../components/LoaderModal';
import { useStore } from '../../store';
import { colors } from '../../styles/colors';
import { catchError, tid } from '../../utils';
import { generateKeyFromPassword } from '../../utils/accountCreate';
import { AccountWithPassword, _login } from '../../services/meta1Api';
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
  accountName: account,
  password,
}: AccountWithPassword): Promise<KeysT | undefined> {
  await _login(account, password);

  if (isPassPk(password)) {
    throw new Error('Creating paper wallet from private key is not allowed');
  }

  return {
    ownerKeys: generateKeyFromPassword(account, 'owner', password, true),
    activeKeys: generateKeyFromPassword(account, 'active', password, true),
    memoKeys: generateKeyFromPassword(account, 'memo', password, true),
    accountName: account,
  };
}

export default function CreatePaperWallet() {
  const { accountName } = useStore();
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
