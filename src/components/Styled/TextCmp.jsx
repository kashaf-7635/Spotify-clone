import {StyleSheet, Text as RNText} from 'react-native';
import Fonts from '../../utils/constants/fonts';
import {moderateScale} from 'react-native-size-matters';

const TextCmp = ({
  children,
  weight = 'regular',
  size = 14,
  color = 'white',
  align = 'left',
  textConfig,
}) => {
  const weightStyle = styles[weight];
  const sizeStyle = {fontSize: moderateScale(size)};
  const colorStyle = {color};
  const alignStyle = {textAlign: align};
  return (
    <RNText
      {...textConfig}
      style={[styles.text, weightStyle, sizeStyle, colorStyle, alignStyle]}>
      {children}
    </RNText>
  );
};

export default TextCmp;

const styles = StyleSheet.create({
  regular: {
    fontFamily: Fonts.regular,
  },
  bold: {
    fontFamily: Fonts.bold,
  },
  semibold: {
    fontFamily: Fonts.semibold,
  },
});
