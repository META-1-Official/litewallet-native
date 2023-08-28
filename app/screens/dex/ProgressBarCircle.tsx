import React, { FC } from 'react';
import { ProgressCircle } from 'react-native-svg-charts';
import * as RNSvg from 'react-native-svg';

interface Props {
  progress: number;
  isBuy: boolean;
}

const ProgressBarCircle: FC<Props> = ({ progress = 0, isBuy = false }) => {
  const progressValue = Math.min(100, Math.round(progress * 100)).toString();
  const progressValueXPosition = -1 * Math.round(progressValue.length * 3.33) - 0.5;
  const progressColor = isBuy ? '#0f0' : '#f00';

  return (
    <ProgressCircle
      style={{ height: 40 }}
      progress={progress}
      progressColor={progressColor}
      backgroundColor="#000"
      strokeWidth={2}
      startAngle={0}
      endAngle={Math.PI * 2}
    >
      <RNSvg.Text x={progressValueXPosition} y="3.7" fill={progressColor}>
        {progressValue}
      </RNSvg.Text>
    </ProgressCircle>
  );
};

export default ProgressBarCircle;
