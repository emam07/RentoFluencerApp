import React from 'react'
import { Pressable, Text, StyleSheet } from 'react-native'

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}) => {
  const variants = {
    primary: {
      backgroundColor: '#f59e0b',
      borderColor: '#f59e0b',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: '#a3a1ad',
      borderWidth: 1,
    },
    danger: {
      backgroundColor: '#ef4444',
      borderColor: '#ef4444',
    },
  }

  const common = {
    paddingVertical: 12,
    paddingHorizontal: fullWidth ? 24 : 16,
    borderRadius: 8,
    elevation: 2,
    ...variants[variant],
  }

  return (
    <Pressable onPress={onPress} disabled={disabled} style={fullWidth ? { width: '100' } : undefined} style={common}>
      <Text
        style={{
          color: '#171717',
          fontFamily: 'Inter',
          fontWeight: 600,
          textAlign: 'center',
        }}>
        {title}
      </Text>
    </Pressable>
  )
}

Button.displayName = 'Button'