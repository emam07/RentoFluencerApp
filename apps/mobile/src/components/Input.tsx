import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

type InputProps = {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  disabled?: boolean
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  disabled = false,
  error,
}) => {
  const errorStyle = error
    ? {
        marginTop: 4,
        color: '#ef4444',
        fontSize: 12,
        fontFamily: 'Inter',
      }
    : {}

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.input,
          { backgroundColor: disabled ? '#f3f4f6' : 'transparent' },
        ]}>
        <View style={styles.inputInner}>
          <Text
            style={[
              styles.inputText,
              { color: disabled ? '#6b7280' : undefined },
              secureTextEntry && { letterSpacing: 2 },
            ]}>
            {secureTextEntry ? '•' : value}
          </Text>
        </View>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

Input.displayName = 'Input'

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#171717',
  },
  inputInner: {
    width: '100%',
  },
  inputText: {
    width: '100%',
  },
  errorText: {
    marginTop: 4,
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter',
  },
})