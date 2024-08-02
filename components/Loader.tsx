import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

export default function Loader() {
  const [time, setTime] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text>Loading {time}</Text>
    </View>
  )
}
