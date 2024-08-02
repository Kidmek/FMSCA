import * as FileSystem from 'expo-file-system'
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
    })

    console.log('File Read As String', file.length, getTime(started))

    if (file.length) {
      const rows = file.split('\n')
      const firstRow = rows.shift()
      if (firstRow) {
        headers = splitComma(firstRow)
      }

      if (headers?.length) {
        await processRowsInChunks(rows, headers, jsonData)
      }
    }

    console.log('Finished Reading', jsonData.length, getTime(started))
    return jsonData
  } catch (err) {
    console.log('Reading Excel Err', getTime(started))
    console.log(err)
  }
}

const processRowsInChunks = async (
  rows: string[],
  headers: string[],
  jsonData: any[],
  chunkSize = 100
) => {
  for (let i = 0; i < rows.length; i += chunkSize) {
    await new Promise((resolve) => {
      requestIdleCallback(() => {
        const chunk = rows.slice(i, i + chunkSize)
        chunk.forEach((row) => {
          const rowJson: any = {}
          splitComma(row)?.map((cell, index) => {
            rowJson[headers[index]] = cell
          })
          jsonData.push(rowJson)
        })
        resolve(true)
      })
    })
  }
}

const getTime = (started: Date) => {
  return `${(new Date().getTime() - started.getTime()) / 1000} seconds `
}

function splitComma(str: string) {
  return str.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
}
