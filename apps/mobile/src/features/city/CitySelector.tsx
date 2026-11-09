import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

type City = {
  id: string
  name: string
  slug: string
}

type CitySelectorProps = {
  cities: City[]
  selectedCity: string // selected city slug
  onSelect: (city: City) => void
  placeholder?: string
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  cities,
  selectedCity,
  onSelect,
  placeholder = 'Select city',
}) => {
  const renderItem = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={[
        styles.cityItem,
        { backgroundColor: item.slug === selectedCity ? '#f59e0b' : 'transparent' },
        { padding: 12 },
      ]}
      onPress={() => onSelect(item)}
    >
      <Text style={[
        styles.cityText,
        { color: item.slug === selectedCity ? '#171717' : '#6b7280' },
        { fontWeight: item.slug === selectedCity ? 600 : 500 },
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>{placeholder}</Text>
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  )
}

CitySelector.displayName = 'CitySelector'

// Simulated cities for now - will come from Prisma in production
const initialCities = [
  { id: '1', name: 'Delhi', slug: 'delhi' },
  { id: '2', name: 'Mumbai', slug: 'mumbai' },
  { id: '3', name: 'Bangalore', slug: 'bangalore' },
  { id: '4', name: 'Chennai', slug: 'chennai' },
]

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fafafa',
  },
  placeholderText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#9ca3af',
  },
  cityItem: {
    marginHorizontal: 4,
  },
  cityText: {
    fontFamily: 'Inter',
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 4,
  },
})