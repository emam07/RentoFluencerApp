import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'

type KitCardProps = {
  kitName: string
  dailyPrice: number // in paise
  category: string
  imageUrl?: string
  onPress?: () => void
}

export const KitCard: React.FC<KitCardProps> = ({
  kitName,
  dailyPrice,
  category,
  imageUrl,
  onPress,
}) => {
  const priceInRupees = dailyPrice / 100
  const priceText = `₹${priceInRupees.toLocaleString()}/day`

  return (
    <Pressable onPress={onPress} style={styles.container}>
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
      <View style={styles.infoContainer}>
        <Text style={styles.kitName}>{kitName}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.price}>{priceText}</Text>
      </View>
    </Pressable>
  )
}

KitCard.displayName = 'KitCard'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: 150,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#f5f5f5',
  },
  placeholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#e5e7eb',
  },
  infoContainer: {
    padding: 12,
  },
  kitName: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 600,
    color: '#171717',
    marginBottom: 4,
  },
  category: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 700,
    color: '#f59e0b',
  },
})