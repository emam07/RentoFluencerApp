import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

type BottomSheetProps = {
  isOpen: boolean
  onRequestClose: () => void
  children: React.ReactNode
  onSubmit?: () => void
  submitLabel?: string
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onRequestClose,
  children,
  onSubmit,
  submitLabel = 'Submit',
}) => {
  const handleClose = () => {
    onRequestClose()
  }

  return (
    <View style={styles.overlay} onPress={handleClose}>
      <View style={styles.sheet}>
        {children}
        {onSubmit && (
          <View style={styles.divider} />
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>{submitLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

BottomSheet.displayName = 'BottomSheet'

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fafafa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  submitButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  submitButtonText: {
    color: '#171717',
    fontFamily: 'Inter',
    fontWeight: 600,
    textAlign: 'center',
  },
})