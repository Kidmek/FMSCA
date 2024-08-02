import CustomDataTable from '@/components/DataTable'
import Loader from '@/components/Loader'
import { readExcelFile } from '@/utils/readFile'
import { useEffect, useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = () => {
    console.log('Loading set t')
    setLoading(true)
    readExcelFile().then((res) => {
      console.log('Response', res?.length)
      if (res) {
        setData(res)
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    fetch()
  }, [])
  console.log('Loading:', loading)
  if (loading) {
    return <Loader />
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
