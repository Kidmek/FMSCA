import * as XLSX from 'xlsx'
import * as FileSystem from 'expo-file-system'
import { Asset } from 'expo-asset'
const CHUNK_SIZE = 1024 ** 2 * 1

export const readExcelFile = async (): Promise<any[] | undefined> => {
  const started = new Date()
  try {
    console.log('Started Reading')
    const asset = Asset.fromModule(require(`../assets/data.csv`))
    await asset.downloadAsync()
    const fileUri = asset.localUri || ''
    const file = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
      // length: CHUNK_SIZE,
      // position:0
    })
    console.log('File Read As String', file.length, getTime(started))
    const workbook = XLSX.read(file, {
      type: 'base64',
      dense: true,
      WTF: true,
      // sheetRows:20
    })
    console.log('XLSX read finished', getTime(started))
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)
    console.log('Finished Reading', jsonData.length, getTime(started))
    return jsonData
  } catch (err) {
    console.log('Reading Excel Err', getTime(started))
    console.log(err)
  }
}

const getTime = (started: Date) => {
  return (new Date().getTime() - started.getTime()) / 1000
}
