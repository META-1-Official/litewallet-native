import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { RootNavigationProp } from '../../AuthNav';
import RoundedButton from '../RoundedButton';
import { TextSecondary } from '../typography';

import styles from './ESignature.styles';

const PDF_URL = 'https://e-sign.dev.cryptomailsvc.io/pdf-demo.pdf';

const ESignature: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const pdfRef = useRef(null);
  const [page, setPage] = useState<number>(0);
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [horizontal] = useState<boolean>(false);
  const [isRead, setIsRead] = useState<boolean>(false);

  useEffect(() => {
    if (page !== 0 && page === numberOfPages) {
      setIsRead(true);
    }
  });

  const handlePress = () => navigation.navigate('ESignatureForm');

  const source = { uri: PDF_URL, cache: true };

  const handlePageChange = (pageNum: number) => {
    setPage(pageNum);
    console.log(`current page: ${pageNum}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        <TextSecondary>
          Please review and sign the META Private Membership Agreement, this is required to use our
          platform or any of META’s services.
        </TextSecondary>
      </View>
      <View style={styles.pdfWrapper}>
        <Pdf
          style={styles.pdf}
          ref={pdfRef}
          trustAllCerts={false}
          source={source}
          horizontal={horizontal}
          onLoadComplete={pagesCount => {
            setNumberOfPages(pagesCount);
            console.log(`Number of pages: ${pagesCount}`);
          }}
          onPageChanged={handlePageChange}
          onError={error => {
            console.log(error);
          }}
        />
      </View>
      <View>
        <RoundedButton title="Sign" onPress={handlePress} disabled={!isRead} />
      </View>
    </SafeAreaView>
  );
};

export default ESignature;
