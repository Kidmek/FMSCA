import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function Details() {
  const data = useLocalSearchParams()
  return (
    <View>
      <Text>details {data.id}</Text>
    </View>
  )
}
