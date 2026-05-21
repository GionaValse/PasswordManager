import { StyleProp, ViewStyle } from 'react-native';

export interface StyleableChildProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}
