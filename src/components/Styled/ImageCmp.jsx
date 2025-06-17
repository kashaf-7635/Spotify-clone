import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

const ImageCmp = ({
  source,
  height,
  width,
  size,
  borderRadius = 0,
  resizeMode = 'cover',
}) => {
  const imageHeight = size ? scale(size) : verticalScale(height ?? 100);
  const imageWidth = size ? scale(size) : scale(width ?? 100);

  const normalizedSource =
    source && typeof source === 'string'
      ? {uri: source}
      : source || 'https://via.placeholder.com/150';

  return (
    <View
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
    </View>
  );
};

export default ImageCmp;

const styles = StyleSheet.create({
  image: {
    height: '100%',
    width: '100%',
  },
});
