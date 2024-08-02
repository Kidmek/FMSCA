import * as FileSystem from 'expo-file-system'
import Papa from 'papaparse'
import { Asset } from 'expo-asset'

export const readExcelFile = async (): Promise<any[] | undefined> => {
  const started = new Date()
  let jsonData: any[] = []
  let headers: string[] | null = []
  try {
    console.log('Started Reading')
    const asset = Asset.fromModule(require(`../assets/data.csv`))
    await asset.downloadAsync()
    const fileUri = asset.localUri || ''
    const file = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
      // length: CHUNK_SIZE,
      // position:0
    })

    console.log('File Read As String', file.length, getTime(started))

    if (file.length) {
      // ~19s
      // Papa.parse(file, {
      //   complete: (results) => {
      //     if (results.data.length) {
      //       console.log('Parse Result', results.data.length)
      //       jsonData = results.data
      //     }
      //     if (results.errors.length) {
      //       console.log('Parse Error')
      //       console.log(results.errors)
      //     }
      //   },
      //   header: true,
      // })
      const rows = file.split('\n')
      console.log('Rows', rows.length)
      const firstRow = rows.shift()
      if (firstRow) {
        headers = splitComma(firstRow)
      }
      if (headers?.length) {
        rows.map((row) => {
          const rowJson: any = {}
          splitComma(row)?.map((cell, index) => {
            rowJson[headers![index]] = cell
          })
          jsonData.push(rowJson)
        })
      }
    }

    console.log('Finished Reading', jsonData.length, getTime(started))
    return jsonData
  } catch (err) {
    console.log('Reading Excel Err', getTime(started))
    console.log(err)
  }
}

const getTime = (started: Date) => {
  return `${(new Date().getTime() - started.getTime()) / 1000} seconds `
}

function splitComma(str: string) {
  return str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
  // .map((refi) =>
  //   refi.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF"\""]/g, '').trim()
  // )
}
