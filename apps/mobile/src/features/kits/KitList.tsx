import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { KitCard } from '../components/KitCard'

type Kit = {
  id: string
  name: string
  description: string
  dailyPrice: number // in paise
  category: string
  imageUrl?: string
}

type KitListProps = {
  kits: Kit[]
  onPress: (kit: Kit) => void
  emptyMessage?: string
}

export const KitList: React.FC<KitListProps> = ({
  kits,
  onPress,
  emptyMessage = 'No kits available',
}) => {
  if (kits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={kits}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <KitCard
          kitName={item.name}
          dailyPrice={item.dailyPrice}
          category={item.category}
          imageUrl={item.imageUrl}
          onPress={() => onPress(item)}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  )
}

KitList.displayName = 'KitList'

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#6b7280',
  },
  listContent: {
    paddingHorizontal: 16,
  },
})