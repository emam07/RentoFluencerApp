import React from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'

type EquipmentCardProps = {
  name: string
  condition: 'new' | 'used' | 'refurbished'
  imageUrl?: string
  onPress?: () => void
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  name,
  condition,
  imageUrl,
  onPress,
}) => {
  const conditionLabels: Record<'new' | 'used' | 'refurbished', string> = {
    new: 'New',
    used: 'Used',
    refurbished: 'Refurbished',
  }

  const conditionColors: Record<'new' | 'used' | 'refurbished', string> = {
    new: '#10b981',
    used: '#6b7280',
    refurbished: '#f59e0b',
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.conditionBar}>
          <Text style={[
            styles.conditionText,
            { color: conditionColors[condition] },
          ]}>
            {conditionLabels[condition]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

EquipmentCard.displayName = 'EquipmentCard'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 100,
  },
  image: {
    width: '100%',
    height: 100,
    backgroundColor: '#f5f5f5',
  },
  placeholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#e5e7eb',
  },
  info: {
    padding: 8,
  },
  name: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 500,
    color: '#171717',
  },
  conditionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  conditionText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: 500,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  }),
})