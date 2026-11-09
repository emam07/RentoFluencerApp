import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

type ToastProps = {
  message: string
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, duration = 3000 }) => {
  return (
    <View style={styles.toast}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  )
}

Toast.displayName = 'Toast'

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    color: '#fafafa',
    fontFamily: 'Inter',
    fontSize: 14,
    alignItems: 'center',
    elevation: 4,
  },
  toastText: {
    textAlign: 'center',
  },
})