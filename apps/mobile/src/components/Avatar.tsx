import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'

type AvatarProps = {
  source: string // URI or local image source
  size?: 'small' | 'medium' | 'large'
  radius?: 'full' | 'square'
  fallback?: string
  style?: any
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  radius = 'full',
  fallback,
  style,
}) => {
  const sizeValues = {
    small: 32,
    medium: 48,
    large: 72,
  }

  return (
    <View
      style={[
        styles.avatar,
        { width: sizeValues[size], height: sizeValues[size] },
        radius === 'full' && styles.fullRadius,
        style,
      ]}>
      <Image
        source={{ uri: source }}
        style={[
          styles.image,
          { width: sizeValues[size], height: sizeValues[size] },
          radius === 'full' && styles.fullRadiusImage,
        ]}
      />
      {fallback && (
        <Text style={[
          styles.fallbackText,
          { width: sizeValues[size], height: sizeValues[size] },
        ]}>
          {fallback}
        </Text>
      )}
    </View>
  )
}

Avatar.displayName = 'Avatar'

const sizeValues = {
  small: 32,
  medium: 48,
  large: 72,
}

const styles = StyleSheet.create({
  avatar: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    objectFit: 'cover',
  },
  fullRadius: {
    borderRadius: 9999,
  },
  fullRadiusImage: {
    borderRadius: 9999,
  },
  fallbackText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fafafa',
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: '#6b7280aa',
  },
})