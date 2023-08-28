import React, { useEffect, useState } from 'react';
import { Grid, LineChart } from 'react-native-svg-charts';
import { getHistoryForAsset } from '../../services/meta1Api';

const AssetChart: React.FC<{ symbol: string; color: string }> = ({ symbol, color }) => {
  const [data, setData] = useState<number[]>([1, 1]);
  useEffect(() => {
    async function fn() {
      await getHistoryForAsset(symbol).then(d => setData(d));
    }
    fn();
  }, [symbol]);

  return (
    <LineChart
      style={{ width: 80 }}
      data={data}
      svg={{ stroke: color }}
      contentInset={{ top: 20, bottom: 20 }}
    >
      <Grid />
    </LineChart>
  );
};

export default AssetChart;
