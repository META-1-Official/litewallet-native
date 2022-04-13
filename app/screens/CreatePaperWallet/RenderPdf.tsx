import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { AccountKeysT } from '../../utils/meta1Api';

interface Props {
  keys?: AccountKeysT;
  onReady: (s: string) => void;
}
export default function RenderPdf({ keys, onReady }: Props) {
  return (
    <View>
      {!!keys && (
        <WebView
          source={{ html: htmlSource }}
          injectedJavaScript={inject(keys)}
          onMessage={event => {
            console.warn(event.nativeEvent.data);
            onReady(event.nativeEvent.data);
          }}
        />
      )}
    </View>
  );
}
const inject = ({ account, ownerKey, activeKey, memoKey, privateKey }: AccountKeysT) => {
  const r = `
  setTimeout(function() { createPaperWalletAsPDF('${ownerKey}', '${activeKey}', '${memoKey}', '${account}', '${privateKey}') }, 10000);
  true;
  `;
  console.log(r);
  return r;
};

const htmlSource = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
  <script src="https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js"></script>
</head>

<body style="display: flex;justify-content: center;align-items: center;height: 90vh">
  <div id="qrcode" style="display: none;"></div>
  <script>
    const isLocked = () => true;
    const createPaperWalletAsPDF = function (
      ownerkeys,
      activeKeys,
      memoKey,
      accountName,
      privateKey,
    ) {
      const width = 300,
        height = 450, //mm
        lineMargin = 5,
        qrSize = 50,
        textMarginLeft = qrSize + 7,
        qrMargin = 5,
        qrRightPos = width - qrSize - qrMargin,
        textWidth = width - qrSize * 2 - qrMargin * 2 - 3,
        textHeight = 8,
        logoWidth = (width * 3) / 4,
        logoHeight = logoWidth / 2.8, //  logo original width/height=2.8
        logoPositionX = (width - logoWidth) / 2;
      let rowHeight = logoHeight + 50;
      const keys = [activeKeys, ownerkeys, memoKey];
      const keysName = ['Active Key', 'Owner Key', 'Memo Key'];

      let locked = isLocked();

      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        format: [width, height],
        compressPdf: true,
      });

      const checkPageH = (pdfInstance, currentPageH, maxPageH) => {
        if (currentPageH >= maxPageH) {
          pdfInstance.addPage();
          rowHeight = 10;
        }
        return pdf.internal.getNumberOfPages();
      };

      const keyRow = publicKey => {
        let currentPage = checkPageH(pdf, rowHeight, 400);

        gQrcode(publicKey, qrMargin, rowHeight + 10, currentPage);
        if (locked && !!privateKey) {
          gQrcode(privateKey, qrRightPos, rowHeight + 10, currentPage);
        }
        pdf.text('PublicKey', textMarginLeft, rowHeight + 20);
        pdf.text(publicKey, textMarginLeft, rowHeight + 30);
        pdf.rect(textMarginLeft - 1, rowHeight + 24, textWidth, textHeight);
        pdf.text('PrivateKey', textMarginLeft, rowHeight + 40);
        // pdf.rect(textMarginLeft - 1, rowHeight + 24, textWidth, textHeight)
        // pdf.text('privateKey', textMarginLeft, rowHeight + 50)
        if (locked) {
          pdf.text('PrivateKey', textMarginLeft, rowHeight + 40);
          if (!!privateKey) {
            pdf.text(privateKey, textMarginLeft, rowHeight + 50);
          } else {
            pdf.text('Not found.', textMarginLeft, rowHeight + 50);
          }
          pdf.rect(textMarginLeft - 1, rowHeight + 44, textWidth, textHeight);
        }
        rowHeight += 50;
      };

      const gQrcode = (qrcode, rowWidth, rowHeight, currentPage) => {
        console.log(qrcode);
        const qr = new QRCode(document.createElement('div'), qrcode);
        const data = qr._el.firstChild.toDataURL();
        pdf.setPage(currentPage);
        pdf.addImage(data, "JPEG", rowWidth, rowHeight, qrSize, qrSize);
      };

      let img = new Image();
      img.src = 'https://i.imgur.com/snpkt4t.png';
      pdf.addImage(
        img,
        'PNG',
        logoPositionX,
        30,
        logoWidth,
        logoHeight,
        '',
        'MEDIUM',
      );
      pdf.text('Account:', 18, rowHeight - 10);
      pdf.text(accountName, 42, rowHeight - 10);

      let content = keys.map((publicKeys, index) => {
        if (index >= 1) {
          rowHeight += 25; // add margin-top for block
        }
        checkPageH(pdf, rowHeight, 400);
        pdf.text('Public', 22, rowHeight + 7);
        pdf.text(keysName[index], 120, rowHeight + 7);
        if (locked) {
          pdf.text('Private', 260, rowHeight + 7);
        }
        pdf.line(lineMargin, rowHeight + 1, width - lineMargin, rowHeight + 1);
        pdf.line(lineMargin, rowHeight + 9, width - lineMargin, rowHeight + 9);
        if (typeof publicKeys === 'string') {
          keyRow(publicKeys);
        } else {
          publicKeys.map(publicKey => {
            keyRow(publicKey);
          });
        }
      });

      Promise.all(content).then(() => {
        const x = pdf.output('dataurlstring')
        window.ab = x;
        window.ReactNativeWebView.postMessage(x);
      });
    };
  </script>
</body>

</html>

`;
