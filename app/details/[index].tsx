import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function Details() {
  const { index } = useLocalSearchParams()
  return (
    <View>
      <Text>details {index}</Text>
    </View>
  )
}
