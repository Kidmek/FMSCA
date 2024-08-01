import CustomDataTable from '@/components/DataTable'
import { readExcelFile } from '@/utils/readFile'
import { useEffect, useState } from 'react'
import { Text } from 'react-native'
import {
  ActivityIndicator,
  Modal,
  PaperProvider,
  Portal,
} from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const jsonData = await readExcelFile()
    console.log('JSON', jsonData?.at(0))
    if (jsonData) {
      setData(jsonData)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetch()
  }, [])
  if (loading) {
    return (
      <PaperProvider>
        <Portal>
          <Modal
            visible={loading}
            contentContainerStyle={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              gap: 30,
            }}
          >
            <ActivityIndicator size={'large'} />
            <Text
              style={{
                fontSize: 20,
              }}
            >
              Loading . . .
            </Text>
          </Modal>
        </Portal>
      </PaperProvider>
    )
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {data.length > 0 && <CustomDataTable data={data} />}
    </SafeAreaView>
  )
}
