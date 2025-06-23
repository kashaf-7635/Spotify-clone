import { Animated, Image, StyleSheet, View } from 'react-native';
import React from 'react';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const ImageCmp = ({
  source,
  height,
  width,
  size,
  borderRadius = 0,
  resizeMode = 'cover',
  animated = false,
}) => {
  const isAnimatedValue = !!(size && typeof size !== 'number'); 
  const imageHeight = isAnimatedValue
    ? size
    : size
      ? scale(size)
      : verticalScale(height ?? 100);

  const imageWidth = isAnimatedValue
    ? size
    : size
      ? scale(size)
      : scale(width ?? 100);

  const normalizedSource =
    source && typeof source === 'string'
      ? { uri: source }
      : source || { uri: 'https://via.placeholder.com/150' };

  const Wrapper = animated ? Animated.View : View;

  return (
    <Wrapper
      style={{
        height: imageHeight,
        width: imageWidth,
        borderRadius: moderateScale(borderRadius),
        overflow: 'hidden',
      }}>
      <Image
        source={normalizedSource}
        style={styles.image}
        resizeMode={resizeMode}
      />
    </Wrapper>
  );
};

export default ImageCmp;

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});
