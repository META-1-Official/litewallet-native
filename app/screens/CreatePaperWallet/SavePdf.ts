import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';

const fs = ReactNativeBlobUtil.fs;
const { CacheDir, DownloadDir } = fs.dirs;

export async function savePdf(dataUrl: string) {
  const [_header, data] = dataUrl.split(',');

  const targetDir = Platform.OS === 'ios' ? CacheDir : DownloadDir;
  const fileName = `Meta1-keys-${new Date().getTime()}.pdf`;
  const fullName = `${targetDir}/${fileName}`;

  console.log(fullName);

  await fs.createFile(fullName, data, 'base64');

  if (Platform.OS === 'ios') {
    ReactNativeBlobUtil.ios.previewDocument(fullName);
  } else if (Platform.OS === 'android') {
    ReactNativeBlobUtil.android.actionViewIntent(fullName, 'application/pdf');
  }
}
