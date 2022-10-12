import React, { useState } from 'react';
import { View } from 'react-native';
import { Viewer } from '@react-pdf-viewer/core';
import { TextSecondary } from '../typography';

import styles from './ESignature.styles';

const ESignature: React.FC = () => {
  const [, setPagesCount] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(0);
  // todo: fix types
  const handlePageChange = ({ currentPage }: any) => setPageIndex(currentPage);
  // todo: fix types
  const handleDocumentLoad = ({ doc }: any) => setPagesCount(doc._pdfInfo.numPages);

  return (
    <View style={[styles.col]}>
      <TextSecondary>
        Please review and sign the META Private Membership Agreement, this is required to use our
        platform or any of META’s services.
      </TextSecondary>

      <Viewer
        fileUrl={'pdf-demo.pdf'}
        initialPage={pageIndex}
        onPageChange={handlePageChange}
        onDocumentLoad={handleDocumentLoad}
      />

      <View />
    </View>
  );
};

export default ESignature;
