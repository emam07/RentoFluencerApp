import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'

type Booking = {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED'
  kitName: string
  rentalFrom: string
  rentalUntil: string
  totalPrice: number // in paise
}

type BookingTimelineProps = {
  bookings: Booking[]
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({
  bookings,
}) => {
  const statusLabels: Record<string, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
  }

  const statusColors: Record<string, string> = {
    PENDING: '#f59e0b',
    CONFIRMED: '#3b82f6',
    ACTIVE: '#10b981',
    COMPLETED: '#6b7cfe',
  }

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.row} key={item.id}>
      <View style={styles.statusDot} />
      <Text style={styles.statusText} style={{ color: statusColors[item.status] }}>
        {statusLabels[item.status]}
      </Text>
      <View style={styles.details}>
        <Text style={styles.kitName}>{item.kitName}</Text>
        <Text style={styles.dates}>{item.rentalFrom} - {item.rentalUntil}</Text>
      </View>
      <Text style={styles.price}>₹{item.totalPrice / 100}</Text>
    </View>
  )

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      vertical
      showsVerticalScrollIndicator={false}
    />
  )
}

BookingTimeline.displayName = 'BookingTimeline'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
  },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 12,
    marginHorizontal: 8,
    flex: 1,
  },
  details: {
    flex: 1,
  },
  kitName: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: 500,
    color: '#171717',
  },
  dates: {
    fontFamily: 'Inter',
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  price: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: 600,
    color: '#f59e0b',
  },
})