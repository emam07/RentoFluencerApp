import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

type BadgeProps = {
  label: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'default' }) => {
  const variants = {
    default: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
    },
    success: {
      backgroundColor: '#d1e7dd',
      color: '#052e16',
    },
    warning: {
      backgroundColor: '#fffb',
      color: '#92400e',
    },
    error: {
      backgroundColor: '#fecaca',
      color: '#991b1b',
    },
  }

  const style = variants[variant] || variants.default

  return (
    <View style={[
      styles.badge,
      style,
    ]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  )
}

Badge.displayName = 'Badge'

const styles = StyleSheet.create({
  badge: {
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 500,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  badgeText: {
    color: '#374151',
  },
})