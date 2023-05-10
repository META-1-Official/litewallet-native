import { ImageStyle, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { theAsset } from '../../utils/useAsset';
import styles from './TradeScreen.styles';

export type ScreenAssets = {
  A: theAsset;
  B: theAsset;
};

export interface AssetsProp {
  assets: ScreenAssets;
}

export type DM<T> = { darkMode?: boolean } & T;

export interface AssetProp {
  asset: theAsset;
  marketPrice?: number;
  slave?: boolean;
}

export type InputProps = {
  validate: (value: string) => boolean;
  onChange: (value: string, valid: boolean) => void;
} & Omit<TextInputProps, 'onChange'>;

export type kindaStyle = Partial<typeof styles> | ViewStyle | TextStyle | ImageStyle;
